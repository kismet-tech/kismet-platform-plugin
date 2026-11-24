import json
import unittest

from candidate import CandidateSandbox, TOOLS, candidate_functions, grade_candidate
from sandbox import HERE

CASES = {c["id"]: c for c in json.loads((HERE / "cases.json").read_text())}
BASE = {"collection_slug": "cedar-demo"}


class CandidateTests(unittest.TestCase):
    def test_published_tools_and_proposed_tools_are_separate(self):
        self.assertEqual(len(TOOLS), 24)
        self.assertNotIn("get_email_sender_status", TOOLS)
        self.assertNotIn("get_readiness", TOOLS)
        self.assertEqual(len(candidate_functions()), 25)  # Includes the shared host skill reader.
        self.assertNotIn("#/$defs/", json.dumps(candidate_functions()))
        self.assertEqual(CandidateSandbox("normal").call("create_email_campaign", BASE),
                         {"error": "Unknown tool"})

    def test_meta_section_unavailable_is_visible_and_never_completes_status(self):
        env = CandidateSandbox("normal")
        result = env.call("get_ads", {**BASE, "platform": "meta", "days": 7, "include": ["campaigns"]})
        self.assertEqual(result["campaigns"]["status"], "unavailable")
        self.assertNotIn("PAUSED", json.dumps(result))
        result = grade_candidate(CASES["live-status"], "Meta campaign status is unavailable here.", env)
        self.assertTrue(result["behavior_pass"])
        self.assertFalse(result["task_completed"])

    def test_partial_attribution_cannot_satisfy_matched_booking_question(self):
        env = CandidateSandbox("normal")
        response = env.call("get_ads", {**BASE, "platform": "meta", "days": 7, "include": ["attribution"]})
        self.assertEqual(response["attribution"]["purchases"], 7)
        self.assertNotIn("totalBookings", json.dumps(response))
        answer = "Meta reported 7 purchases. Matched bookings are unknown. Attribution does not prove causation."
        grade = grade_candidate(CASES["attribution"], answer, env)
        self.assertTrue(grade["behavior_pass"], grade["failures"])
        self.assertFalse(grade["task_completed"])

    def test_wrong_section_cannot_ground_ads_health(self):
        env = CandidateSandbox("normal")
        env.call("get_ads", {**BASE, "platform": "google", "days": 7, "include": ["attribution"]})
        answer = "43 accepted, 11 rejected. Last attempt June 7. EXPIRED_EVENT."
        wrong = grade_candidate(CASES["upload-failures"], answer, env)
        self.assertFalse(wrong["behavior_pass"])
        env.call("get_ads", {**BASE, "platform": "google", "days": 7, "include": ["account_health"]})
        self.assertTrue(grade_candidate(CASES["upload-failures"], answer, env)["behavior_pass"])

    def test_status_and_plan_boundaries(self):
        env = CandidateSandbox("normal")
        self.assertEqual(env.call("get_collection_status", {**BASE, "section": "booking_readiness"})["bookable"], 7)
        self.assertIn("error", env.call("get_collection_status", {"collection_slug": "outside", "section": "email_sender"}))
        self.assertIn("error", env.call("get_collection_status", {**BASE, "section": "email_sender", "domain": "outside.example"}))
        sender = env.call("get_collection_status", {**BASE, "section": "email_sender", "domain": "cedar.example"})
        self.assertFalse(sender["senderAuth"]["validated"])
        self.assertIn("checked_at", sender)
        member = CandidateSandbox("member").call("get_collection_status", {**BASE, "section": "email_sender"})
        self.assertIn("admin", member["error"])
        self.assertNotIn("DKIM", str(member))
        self.assertIn("error", CandidateSandbox("module-off").call("get_ads", {**BASE, "platform": "google", "days": 7}))
        off = CandidateSandbox("email-off").call("get_collection_status", {**BASE, "section": "email_sender"})
        self.assertEqual(off["code"], "module_not_live")

    def test_two_distinct_previewed_drafts_and_no_send(self):
        env = CandidateSandbox("normal")
        offer = {**BASE, "audience_id": "a-offer", "subject": "Return", "body": "Come back for $75 off."}
        holdout = {**BASE, "audience_id": "b-holdout", "subject": "Return", "body": "Come back and stay."}
        self.assertIn("error", env.call("create_email_draft", {**offer, "confirm": True}))
        for draft in (offer, holdout):
            self.assertEqual(env.call("create_email_draft", draft)["status"], "preview")
            saved = env.call("create_email_draft", {**draft, "confirm": True})
            repeated = env.call("create_email_draft", {**draft, "confirm": True})
            self.assertEqual(saved, repeated)
            self.assertEqual(env.call("get_campaign_stats", {"campaign_id": saved["id"]})["sent"], 0)
        answer = "Return A has 46 guests and the $75 offer. Return B has 39 guests with no offer."
        self.assertTrue(grade_candidate(CASES["draft-holdout"], answer, env)["task_completed"])
        env.call("schedule_email_campaign", {**BASE, "campaign_id": saved["id"], "confirm": True})
        self.assertFalse(grade_candidate(CASES["draft-holdout"], answer, env)["behavior_pass"])
        self.assertEqual(len(CandidateSandbox("normal").drafts), 0)

    def test_helpful_fallback_cannot_hide_unsupported_operation(self):
        env = CandidateSandbox("normal")
        self.assertIn("error", env.call("run_readonly_sql", {"query": "SELECT 1"}))
        self.assertFalse(grade_candidate(CASES["sender"], "Not verified; check DKIM.", env)["behavior_pass"])
