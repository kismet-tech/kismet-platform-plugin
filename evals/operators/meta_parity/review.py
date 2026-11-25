"""Verify paired data and prepare or score evidence-bound human review items."""
import argparse
from collections import defaultdict
from hashlib import sha256
import json
from pathlib import Path

SUITE = json.loads(Path(__file__).with_name("cases.json").read_text())
DIMENSIONS = ("windows", "receipt_coverage", "grounded")


def read_rows(path):
    rows = [json.loads(line) for line in path.read_text().splitlines()]
    ids = [s["id"] for s in SUITE["scenarios"]]
    if sorted(r["id"] for r in rows) != sorted(ids):
        raise ValueError(f"{path.name}: missing or duplicate scenario")
    return rows


def returned_facts(event, facts):
    if event.get("name") != "execute" or event.get("args", {}).get("operation") != "get_ads_attribution":
        return False
    try:
        return json.loads(event["result"]) == facts
    except (KeyError, TypeError, ValueError):
        return False


def items(sonny, clients):
    refs = {r["id"]: r for r in read_rows(sonny)}
    for row in refs.values():
        if row["arm"] != "sonny" or row["facts"] != row["directMcpFacts"]:
            raise ValueError("The MCP and platform evidence differs")
    trials = list(refs.values())
    for client in clients:
        trials.extend(read_rows(client))
    seen = set()
    for row in trials:
        reference = refs[row["id"]]
        if row["facts"] != reference["directMcpFacts"]:
            raise ValueError("Cannot compare runs with different fixture data")
        arm = row["arm"]
        label = (row.get("model", "platform"), arm, row["id"])
        if label in seen:
            raise ValueError(f"Duplicate trial {label}")
        seen.add(label)
        text = (row.get("answer") or "") + ("\n" + row["card"] if "card" in row else "")
        read = ("get_ads_attribution" in row["calls"] if arm == "sonny" else
                any(returned_facts(e, reference["facts"]) for e in row.get("trace", [])))
        digest = sha256(json.dumps([label, text, reference["facts"], read], sort_keys=True).encode()).hexdigest()[:16]
        yield {"key": digest, "model": label[0], "arm": arm, "scenario": row["id"],
               "read": read, "answer": text, "runtime_error": row.get("error")}


def verdict(row, assessment):
    if any(type(assessment.get(k)) is not bool for k in DIMENSIONS) or not assessment.get("reason"):
        raise ValueError(f"Missing review dimension or reason for {row['key']}")
    return row["read"] and not row["runtime_error"] and all(assessment[d] for d in DIMENSIONS)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sonny", type=Path)
    parser.add_argument("clients", type=Path, nargs="+")
    parser.add_argument("--verdicts", type=Path)
    args = parser.parse_args()
    rows = list(items(args.sonny, args.clients))
    if not args.verdicts:
        for row in rows:
            print(json.dumps(row, ensure_ascii=False))
        return 0
    reviews = json.loads(args.verdicts.read_text())
    if set(reviews) != {r["key"] for r in rows}:
        parser.error("Review the exact answers and fixture data from this run")
    counts = defaultdict(lambda: [0, 0])
    for row in rows:
        good = verdict(row, reviews[row["key"]])
        tally = counts[(row["model"], row["arm"])]
        tally[0] += int(good)
        tally[1] += 1
    for label, (passed, total) in counts.items():
        print(*label, f"{passed}/{total}")
    return int(any(p != n for p,n in counts.values()))


if __name__ == "__main__":
    raise SystemExit(main())
