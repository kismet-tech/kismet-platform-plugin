import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from report import read_run, summarize


class ReportTests(unittest.TestCase):
    def test_honest_limit_and_completed_job_remain_separate_per_case(self):
        rows = [{"case": "module", "repeat": 1, "behavior_pass": True, "task_completed": False}]
        report = summarize(rows)
        self.assertEqual(report["by_case"]["module"], [1, 1])
        self.assertEqual(report["jobs_by_case"]["module"], [0, 1])

    def test_summary_must_agree_with_each_outcome(self):
        row = {"case": "save", "repeat": 1, "behavior_pass": False, "task_completed": False}
        summary = {"total": 1, "behavior_pass": 1, "task_completed": 1, "errors": 0}
        with TemporaryDirectory() as directory:
            path = Path(directory, "trials.jsonl")
            path.write_text("\n".join(map(json.dumps, [{"run": {}}, row, {"summary": summary}])))
            with self.assertRaisesRegex(ValueError, "summary does not match"):
                read_run(path)
