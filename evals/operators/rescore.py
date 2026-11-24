"""Apply improved graders to frozen answers after verifying every recorded fixture response."""
import argparse
import json
from collections import Counter
from pathlib import Path

from report import read_run
from run import SUITES, digest, sandbox_for, score_answer

BY_ID = {case["id"]: case for cases in SUITES.values() for case in cases}


def rescore(row, surface):
    if "error" in row:
        return row
    case = BY_ID[row["case"]]
    env = sandbox_for(case["world"], surface)
    for event in row["trace"]:
        if event.get("error") == "Invalid JSON arguments" and "arguments" not in event:
            env.trace.append(event)
            continue
        env.call(event["tool"], event["arguments"])
        if env.trace[-1] != event:
            raise ValueError(f"Fixture response changed in {row['case']} at {event['tool']}")
    score = score_answer(case, row["answer"], env)
    return {**row, **score}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    meta, rows = read_run(args.source)
    if meta["cases_sha256"] != digest(SUITES[meta.get("suite", "field")]):
        parser.error("The frozen cases differ from this checkout")
    base = Path(__file__).resolve().parent
    rubric = digest({n: (base / n).read_text() for n in ("grade.py", "candidate.py", "revised.py")})
    metadata = {**meta, "regraded_from": args.source.name, "grader_sha256": rubric}
    results = [rescore(r, meta["surface"]) for r in rows]
    counts = Counter(total=len(results), behavior_pass=sum(r["behavior_pass"] for r in results),
                     task_completed=sum(r["task_completed"] for r in results), errors=sum("error" in r for r in results))
    with args.output.open("x") as stream:
        for item in [{"run": metadata}, *results, {"summary": dict(counts)}]:
            print(json.dumps(item), file=stream)
    print(args.output.name, dict(counts))


if __name__ == "__main__":
    main()
