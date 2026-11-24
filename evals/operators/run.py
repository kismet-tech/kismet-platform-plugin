"""Fresh native tool-calling chat per case, scored by a separate local evaluator."""
import argparse
import datetime
import hashlib
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

from candidate import CANDIDATE, CandidateSandbox, candidate_functions, grade_candidate
from grade import grade
from sandbox import CATALOG, DOCUMENTS, HERE, SKILLS, Sandbox, functions

CASES = json.loads((HERE / "cases.json").read_text())
SYSTEM = ("You are an assistant for a Kismet operator. Use the connected tools for account facts. "
          "Only perform actions the operator authorized. Explain limits plainly. "
          "The installed package offers these optional skills. To open one, call read_skill "
          "with <name>/SKILL.md.\n" + "\n".join(f"{n}: {s}" for n, s in SKILLS.items()))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def model_client(base_url, model):
    url = urllib.parse.urlsplit(base_url)
    if url.username or url.password or url.query or url.fragment:
        raise ValueError("Use a model base URL without credentials, query or fragment")
    if url.scheme != "https" and not (url.scheme == "http" and url.hostname in ("127.0.0.1", "::1", "localhost")):
        raise ValueError("Remote model endpoints require HTTPS")
    opener = urllib.request.build_opener(NoRedirect)
    headers = {"Content-Type": "application/json"}
    key = os.environ.get("EVAL_MODEL_API_KEY")
    if key:
        headers["Authorization"] = "Bearer " + key

    def complete(messages, tools):
        body = json.dumps({"model": model, "messages": messages, "tools": tools,
                           "max_tokens": 1400, "temperature": 0.2}).encode()
        req = urllib.request.Request(base_url.rstrip("/") + "/chat/completions", body, headers)
        with opener.open(req, timeout=180) as response:
            result = json.load(response)
        choice = result["choices"][0]
        if choice.get("finish_reason") == "length":
            raise ValueError("model output truncated")
        return choice["message"], result.get("model", model)
    return complete


def sandbox_for(world, surface):
    return CandidateSandbox(world) if surface == "candidate" else Sandbox(world, surface)


def run_case(case, surface, complete, env=None):
    # No session ID, conversation history, assistant runtime or file tools are sent.
    messages = [{"role": "system", "content": SYSTEM}, {"role": "user", "content": case["prompt"]}]
    env = env or sandbox_for(case["world"], surface)
    available = candidate_functions() if surface == "candidate" else functions(surface)
    resolved = None
    for _ in range(12):
        raw, resolved = complete(messages, available)
        calls = raw.get("tool_calls") or []
        answer = raw.get("content") or ""
        if not calls:
            if not answer.strip():
                raise ValueError("empty final answer")
            score = grade_candidate(case, answer, env) if surface == "candidate" else grade(case, answer, env.trace)
            return {"answer": answer, "model_returned": resolved, "trace": env.trace,
                    **score}
        if len(calls) + len(env.trace) > 24:
            raise ValueError("tool-call budget reached")
        messages.append({"role": "assistant", "content": answer, "tool_calls": calls})
        for call in calls:
            name = call["function"]["name"]
            try:
                args = json.loads(call["function"]["arguments"])
            except (ValueError, TypeError):
                result = {"error": "Invalid JSON arguments"}
                env.trace.append({"tool": name, **result})
            else:
                result = env.call(name, args)
            messages.append({"role": "tool", "tool_call_id": call["id"], "content": json.dumps(result)})
    raise ValueError("turn budget reached")


def digest(data):
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", required=True)
    parser.add_argument("--base-url", default="http://127.0.0.1:1234/v1")
    parser.add_argument("--surface", choices=("compact", "operations", "candidate"), default="compact")
    parser.add_argument("--split", choices=("all", "development", "holdout"), default="all")
    parser.add_argument("--case", choices=[c["id"] for c in CASES], action="append")
    parser.add_argument("--repeat", type=int, default=1)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    selected = [c for c in CASES if args.split in ("all", c["split"]) and
                (not args.case or c["id"] in args.case)]
    if not selected or args.repeat < 1:
        parser.error("Select at least one case and a positive repeat count")
    complete = model_client(args.base_url, args.model)
    metadata = {"model": args.model, "surface": args.surface, "temperature": 0.2,
                "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "skills_sha256": digest(DOCUMENTS), "catalog_sha256": digest({"current": CATALOG, "proposed": CANDIDATE}),
                "cases_sha256": digest(CASES), "system_sha256": digest(SYSTEM),
                "runner_sha256": digest({n: (HERE / n).read_text() for n in ("run.py", "sandbox.py", "grade.py", "candidate.py")})}
    counts = Counter()
    # Exclusive creation keeps historical runs immutable. Persist each completed case.
    with args.output.open("x") as stream:
        print(json.dumps({"run": metadata}), file=stream, flush=True)
        for repeat in range(1, args.repeat + 1):
            for case in selected:
                env = sandbox_for(case["world"], args.surface)
                try:
                    result = run_case(case, args.surface, complete, env)
                except (OSError, ValueError, KeyError, IndexError, TypeError) as err:
                    # Do not record response bodies, credentials or provider stack traces.
                    result = {"behavior_pass": False, "task_completed": False, "trace": env.trace,
                              "error": str(err) if isinstance(err, (ValueError, OSError)) else type(err).__name__}
                counts["total"] += 1
                counts["behavior_pass"] += int(result["behavior_pass"])
                counts["task_completed"] += int(result["task_completed"])
                counts["errors"] += int("error" in result)
                print(json.dumps({"case": case["id"], "repeat": repeat, **result}), file=stream, flush=True)
                print(case["id"], repeat, result.get("failures", result.get("error")), flush=True)
        print(json.dumps({"summary": dict(counts)}), file=stream)
    print(dict(counts))
    return int(counts["behavior_pass"] != counts["total"])


if __name__ == "__main__":
    sys.exit(main())
