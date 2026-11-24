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
        self.assertIn("error", env.call(tool, {**SLUG, "preview_id": receipt, "variants": [HOLDOUT]}))
        self.assertIn("error", RevisedSandbox("normal").call(tool, {**SLUG, "preview_id": receipt}))
        self.assertIn("error", env.call(tool, {**SLUG, "variants": [OFFER, OFFER]}))
        env.world = "email-off"
        self.assertEqual(env.call(tool, {**SLUG, "preview_id": receipt})["code"], "module_not_live")
        self.assertFalse(env.drafts)
