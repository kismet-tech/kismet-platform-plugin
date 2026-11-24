import unittest
from unittest.mock import patch

from revised import RevisedSandbox, revised_functions
from run import CASES, score_answer

SLUG = {"collection_slug": "cedar-demo"}
OFFER = {"audience_id": "a-offer", "subject": "Autumn visit", "body": "Come back for $75 off."}
HOLDOUT = {"audience_id": "b-holdout", "subject": "Autumn visit", "body": "Come back for a visit."}


class RevisedTests(unittest.TestCase):
    def test_same_size_catalog(self):
        definitions = revised_functions()
        self.assertEqual(len(definitions), 25)
        self.assertEqual(len({d["function"]["name"] for d in definitions}), 25)

    def test_status_sources_do_not_blend(self):
        for world, live, effective in [("normal", "ACTIVE", "ACTIVE"), ("fallback", None, None)]:
            env = RevisedSandbox(world)
            result = env.call("get_ads", {**SLUG, "platform": "meta", "include": ["campaigns"]})
            row, = result["campaigns"]
            self.assertEqual(row["last_recorded_kismet_status"], "PAUSED")
            self.assertEqual(row["live_meta_status"], live)
            self.assertEqual(row["effective_meta_status"], effective)
            self.assertEqual(bool(row["live_checked_at"]), live is not None)
            self.assertNotIn("attribution", result)

    def test_attribution_survives_multiple_campaigns_and_currency_fields(self):
        env = RevisedSandbox("normal")
        rows = [{"campaignName": name, "bookings": count, "metaReported": {
            "clickPurchases": count + 2, "viewPurchases": 1, "clickValueUsd": 1000}}
                for name, count in [("Orchard", 8), ("Coast", 0)]]
        with patch.object(env, "read", return_value={"byCampaign": rows}):
            data = env.call("get_ads", {**SLUG, "platform": "meta", "days": 12, "include": ["attribution"]})
        self.assertEqual(data["attribution"]["days"], 12)
        results = data["attribution"]["campaigns"]
        self.assertEqual([(r["meta_reported_purchases"], r["matched_kismet_bookings"]) for r in results],
                         [(11, 8), (3, 0)])

    def test_all_or_nothing_and_retry(self):
        env = RevisedSandbox("normal")
        bad = {**HOLDOUT, "audience_id": "missing"}
        self.assertIn("error", env.call("create_email_draft", {**SLUG,"variants": [OFFER, bad]}))
        self.assertFalse(env.batches)
        self.assertFalse(env.drafts)
        preview = env.call("create_email_draft", {**SLUG, "variants": [OFFER, HOLDOUT]})
        self.assertFalse(env.drafts)
        save = {**SLUG, "preview_id": preview["preview_id"]}
        first = env.call("create_email_draft", save)
        self.assertEqual(first, env.call("create_email_draft", save))
        self.assertEqual(first["sent"], 0)
        self.assertEqual([(d["audience_id"], d["id"]) for d in first["drafts"]],
                         [("a-offer", "draft-1"), ("b-holdout", "draft-2")])
        case = next(c for c in CASES if c["id"] == "draft-holdout")
        answer = "Offer group Return A has 46 guests, $75 off. Holdout Return B has 39 with no offer."
        self.assertFalse(score_answer(case, answer, env)["task_completed"])
        self.assertTrue(score_answer(case, answer + " Saved draft-1 and draft-2.", env)["task_completed"])

    def test_preview_is_scoped_and_immutable(self):
        env = RevisedSandbox("normal")
        tool = "create_email_draft"
        receipt = env.call(tool, {**SLUG, "variants": [OFFER]})["preview_id"]
        self.assertIn("error", env.call(tool, {"collection_slug": "spruce-demo", "preview_id": receipt}))
        changed = env.call(tool, {**SLUG, "preview_id": receipt, "variants": [HOLDOUT]})
        self.assertEqual(changed["status"], "preview")
        self.assertNotEqual(changed["preview_id"], receipt)
        self.assertFalse(env.drafts)
        self.assertIn("error", RevisedSandbox("normal").call(tool, {**SLUG, "preview_id": receipt}))
        self.assertIn("error", env.call(tool, {**SLUG, "variants": [OFFER, OFFER]}))
        env.world = "email-off"
        self.assertEqual(env.call(tool, {**SLUG, "preview_id": receipt})["code"], "module_not_live")
        self.assertFalse(env.drafts)

    def test_invented_save_id_with_new_variants_only_previews(self):
        env = RevisedSandbox("normal")
        tool = "create_email_draft"
        preview = env.call(tool, {**SLUG, "preview_id": "invented", "variants": [OFFER, HOLDOUT]})
        self.assertFalse(preview["saved"])
        self.assertFalse(env.drafts)
        followup = preview["save_call"]
        self.assertNotEqual(followup["arguments"]["preview_id"], "invented")
        self.assertEqual(len(env.call(followup["tool"], followup["arguments"])["drafts"]), 2)

    def test_misspelled_collection_requires_user_scoped_discovery(self):
        env = RevisedSandbox("normal")
        result = env.call("get_ads", {"collection_slug": "typo", "platform": "meta"})
        self.assertEqual(result["error"], "Collection access denied")
        self.assertIn("list_my_collections", result["next_step"])
        self.assertNotIn("cedar", str(result))
        self.assertEqual(result["next_step"], env.trace[-1]["next_step"])

    def test_saved_preview_is_a_failure_on_an_explanation_only_request(self):
        from run import TRANSFER_CASES
        case = next(c for c in TRANSFER_CASES if c["id"] == "preview-without-saving")
        env = RevisedSandbox("normal")
        env.call("list_audiences", SLUG)
        args = env.call("create_email_draft", {**SLUG, "variants": [OFFER, HOLDOUT]})["save_call"]["arguments"]
        env.call("create_email_draft", args)
        self.assertFalse(score_answer(case, "Return A has 46. Return B has 39. Subject: welcome back for $50.", env)["behavior_pass"])
