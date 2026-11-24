"""Compare complete immutable run files and show the cases that vary between trials."""
import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path


def read_run(path):
    with Path(path).open() as stream:
        records = [json.loads(line) for line in stream]
    if not records or "run" not in records[0] or "summary" not in records[-1]:
        raise ValueError(f"{path}: incomplete run")
    runs = records[1:-1]
    trials = {(r["case"], r["repeat"]) for r in runs}
    if not runs or len(trials) != len(runs):
        raise ValueError(f"{path}: missing or repeated trial")
    expected = {"total": len(runs), "behavior_pass": sum(r["behavior_pass"] for r in runs),
                "task_completed": sum(r["task_completed"] for r in runs), "errors": sum("error" in r for r in runs)}
    if records[-1]["summary"] != expected:
        raise ValueError(f"{path}: summary does not match trial records")
    return records[0]["run"], runs


def summarize(runs):
    cases = defaultdict(list)
    for row in runs:
        cases[row["case"]].append(row)
    return {
        "trials": len(runs),
        "behaviors_passed": sum(r["behavior_pass"] for r in runs),
        "operator_jobs_completed": sum(r["task_completed"] for r in runs),
        "cases_passing_all_trials": sum(all(r["behavior_pass"] for r in group) for group in cases.values()),
        "cases": len(cases),
        "runtime_errors": sum("error" in r for r in runs),
        "failures": dict(Counter(f for r in runs for f in r.get("failures", []))),
        "by_case": {case: [sum(r["behavior_pass"] for r in group), len(group)]
                    for case, group in cases.items()},
        "jobs_by_case": {case: [sum(r["task_completed"] for r in group), len(group)]
                         for case, group in cases.items()},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("files", type=Path, nargs="+")
    args = parser.parse_args()
    configurations = set()
    rows = []
    for path in args.files:
        meta, runs = read_run(path)
        configurations.add(tuple(meta.get(k) for k in ("catalog_sha256", "cases_sha256", "skills_sha256",
                                                       "system_sha256", "runner_sha256", "grader_sha256")) +
                           (tuple(sorted((r["case"], r["repeat"]) for r in runs)), meta["temperature"], meta.get("max_tokens", 1400)))
        rows.append({"file": path.name, "model": meta["model"], "surface": meta["surface"], **summarize(runs)})
    if len(configurations) != 1:
        parser.error("Use matching catalogs, cases, skills, runners, instructions, sampling settings and repetitions")
    print(json.dumps(rows, indent=2))


if __name__ == "__main__":
    main()
