import unittest

from meta_parity.review import SUITE, returned_facts, verdict


class MetaParityTests(unittest.TestCase):
    def test_counterfactuals_do_not_change_the_attribution_windows(self):
        partial, missing, known_zero, view_only = SUITE["scenarios"]
        self.assertEqual({k: v for k, v in partial.items() if k not in {"id", "receipts"}},
                         {k: v for k, v in missing.items() if k not in {"id", "receipts"}})
        self.assertNotIn("receipts", missing)
        self.assertEqual(known_zero["receipts"], 0)
        self.assertGreater(known_zero["namedClick"], 0)
        self.assertEqual(view_only["reportedClick"], 0)
        self.assertGreater(view_only["reportedView"], 0)

    def test_attempt_and_legacy_fields_do_not_prove_a_successful_receipt_read(self):
        event = {"name": "execute","args": {"operation": "get_ads_attribution"}}
        self.assertFalse(returned_facts(event, {"receiptMatchedBookings": 0}))
        self.assertFalse(returned_facts({**event, "result": "{}"}, {"receiptMatchedBookings": 0}))
        self.assertTrue(returned_facts({**event, "result": "{}"}, {}))

    def test_correct_counts_cannot_mask_a_missing_read_or_false_receipt_claim(self):
        row = {"key": "trial", "read": True, "runtime_error": None}
        good = dict(windows=True, receipt_coverage=True, grounded=True, reason="Verified on both axes")
        self.assertTrue(verdict(row, good))
        self.assertFalse(verdict(row, {**good, "receipt_coverage": False}))
        self.assertFalse(verdict({**row, "read": False}, good))
