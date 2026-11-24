import unittest

from workflow_pair import CASES, WorkflowSandbox, catalog, state_checks


class WorkflowPairTests(unittest.TestCase):
    def setUp(self):
        self.case = next(c for c in CASES if c["id"] == "reversed-save")
        self.env = WorkflowSandbox(self.case, "explicit")
        self.args = {"collection_slug": "cedar-demo", "audience_ids": ["seg-91", "seg-14"],
                     "subject": "Visit again", "shared_body": "We would love to see you again.",
                     "credit": {"audience_id": "seg-14", "amount_usd": 35}}

    def test_atomic_save_is_unscheduled_idempotent_and_bound_to_recipient(self):
        result = self.env.call("save_email_drafts", self.args)
        self.assertEqual(result["sent"], 0)
        plain, offer = result["drafts"]
        self.assertEqual(plain["body"], self.args["shared_body"])
        self.assertIn("$35", offer["body"])
        self.assertNotEqual(plain["id"], offer["id"])
        self.assertEqual(result, self.env.call("save_email_drafts", self.args))
        self.assertEqual(len(self.env.drafts), 2)
        self.assertEqual(state_checks(self.case, "draft-1 and draft-2", self.env)["state_failures"], [])
        self.assertTrue(state_checks(self.case, "draft-11 and draft-2", self.env)["state_failures"])

    def test_no_partial_or_out_of_scope_save(self):
        for bad in [{"collection_slug": "other"}, {"audience_ids": ["seg-14","unknown"]},
                    {"shared_body": "Get $35 off!"}, {"credit": {"audience_id": "unknown", "amount_usd": 35}}]:
            self.assertIn("error", self.env.call("save_email_drafts", {**self.args, **bad}))
            self.assertFalse(self.env.drafts)
        self.env.world = "email-off"
        self.assertEqual(self.env.call("save_email_drafts", self.args)["code"], "module_not_live")
        self.assertFalse(self.env.drafts)

    def test_preview_forbids_even_rejected_save(self):
        preview = next(c for c in CASES if c["id"] == "reversed-preview")
        self.env.call("save_email_drafts", {**self.args, "collection_slug": "unknown"})
        self.assertIn("attempted save without authorization", state_checks(preview, "", self.env)["state_failures"])

    def test_fallback_sentence_depends_on_provider_state(self):
        for case in [c for c in CASES if c["job"] == "status"]:
            args = {"collection_slug": "cedar-demo", "platform": "meta", "include": ["campaigns"]}
            explicit = WorkflowSandbox(case, "explicit").call("get_ads", args)["campaigns"][0]
            base = WorkflowSandbox(case, "receipt").call("get_ads", args)["campaigns"][0]
            self.assertEqual(explicit["live_meta_status"], case["live"])
            if not case["live"]:
                sentence = explicit.pop("owner_summary")
                self.assertIn(case["stored"].lower(), sentence)
                self.assertIn("could not be verified", sentence)
            self.assertEqual(explicit, base)
        self.assertEqual(len(catalog("receipt")), len(catalog("explicit")))
