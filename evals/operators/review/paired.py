"""Create an arm-blind review packet, then join reviewer decisions to observed outcomes."""
import argparse
from hashlib import sha256
import json
from pathlib import Path

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from workflow_pair import CASES, groups


def load_trials(directory):
    trials = {}
    cases = {case["id"]: case for case in CASES}
    settings = set()
    catalogs = {}
    for size in ("4b", "20b"):
        for arm in ("receipt", "explicit"):
            path = directory / f"{size}-{arm}.jsonl"
            records = [json.loads(line) for line in path.read_text().splitlines()]
            meta = records[0]["run"]
            rows = records[1:-1]
            if (records[-1] != {"total": len(cases)} or len(rows) != len(cases)
                    or {r["case"] for r in rows} != set(cases) or meta["arm"] != arm
                    or meta["model"] != f"operator-workflows-{size}"):
                raise ValueError(f"Incomplete or mismatched run: {path.name}")
            settings.add(tuple(meta[k] for k in ("cases", "skills", "system", "source", "protocol", "max_tokens", "temperature")))
            catalogs.setdefault(arm, set()).add(meta["catalog"])
            for row in rows:
                opaque = sha256(f"{path.name}:{row['case']}:{row.get('answer','')}".encode()).hexdigest()[:12]
                if opaque in trials:
                    raise ValueError("Duplicate review item")
                case = cases[row["case"]]
                trials[opaque] = (size, arm, case, row)
    if len(settings) != 1 or any(len(values) != 1 for values in catalogs.values()):
        raise ValueError("Unequal experiment settings across arms or models")
    return trials


def review_packet(trials):
    for opaque, (_, _, case, row) in sorted(trials.items()):
        if case["job"] == "status":
            truth = {"live": case["live"], "recorded": case["stored"]}
        else:
            truth = {"audiences": groups(case), "amount": case["amount"], "offer": case["offer"]}
        yield {"id": opaque, "prompt": case["prompt"], "truth": truth,
               "answer": row.get("answer", ""), "stored": [{k: d[k] for k in ("id", "audience_id", "subject", "body")}
                                                          for d in row["drafts"]]}


def score(trials, decisions):
    if set(trials) != set(decisions):
        raise ValueError("Provide one decision for every review ID")
    for opaque, (size, arm, case, row) in sorted(trials.items()):
        decision = decisions[opaque]
        if type(decision["pass"]) is not bool or not decision["reason"].strip():
            raise ValueError(f"Missing verdict or reason for {opaque}")
        failures = list(row["state_failures"])
        if row.get("error"):
            failures.append(row["error"])
        yield {"id": opaque, "model": size, "arm": arm, "case": case["id"], "split": case["split"],
               "job": case["job"], "pass": decision["pass"] and not failures,
               "answer_review": decision["reason"], "state_failures": failures}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--decisions", type=Path)
    args = parser.parse_args()
    trials = load_trials(args.directory)
    rows = (score(trials, json.loads(args.decisions.read_text())) if args.decisions else review_packet(trials))
    with args.output.open("x") as stream:
        for row in rows:
            print(json.dumps(row), file=stream)


if __name__ == "__main__":
    main()
