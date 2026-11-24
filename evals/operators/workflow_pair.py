"""Run two synthetic Operator contracts with common case data and an external answer review."""
import argparse
from copy import deepcopy
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
import re

from revised import REVISED, RevisedSandbox, revised_functions, text_field
from run import DOCUMENTS, HERE, SYSTEM, digest, model_client, run_case
from sandbox import COLLECTION, Sandbox

CASES = json.loads((HERE / "workflow_cases.json").read_text())
SAVE = {
    "name": "save_email_drafts",
    "description": "Save matching, unscheduled email drafts in the dashboard. Look up saved audiences first. "
                   "Supply the shared invitation once. An optional USD credit is added only for its audience. "
                   "Return each persisted draft ID. For chat-only previews, write the copy in the conversation.",
    "parameters": {"type": "object", "additionalProperties": False,
                   "required": ["collection_slug", "audience_ids", "subject", "shared_body"],
                   "properties": {"collection_slug": text_field, "subject": text_field, "shared_body": text_field,
                                  "audience_ids": {"type": "array", "items": text_field, "minItems": 1,
                                                   "maxItems": 10, "uniqueItems": True},
                                  "credit": {"type": "object", "additionalProperties": False,
                                             "required": ["audience_id", "amount_usd"],
                                             "properties": {"audience_id": text_field,
                                                            "amount_usd": {"type": "integer", "minimum": 1}}}}}}


def catalog(arm):
    definitions = revised_functions()
    if arm == "explicit":
        for definition in definitions:
            if definition["function"]["name"] == "create_email_draft":
                definition["function"] = deepcopy(SAVE)
    return definitions


def groups(case):
    if case["split"] == "development":
        return [("a-offer", "Return A", 46), ("b-holdout", "Return B", 39)]
    return [("seg-91", "Harbor Club", 23), ("seg-14", "Orchard Club", 57)]


class ScenarioData(Sandbox):
    def __init__(self, case):
        super().__init__("normal", "operations")
        self.case = case

    def dispatch(self, name, args, event):
        result = super().dispatch(name, args, event)
        if name == "list_audiences":
            result["audiences"] = [{"id": key, "name": label, "memberCount": count}
                                   for key, label, count in groups(self.case)]
        if name == "list_ad_campaigns" and self.case["job"] == "status":
            live = self.case["live"]
            for row in result["campaigns"]:
                row.update(status=live or self.case["stored"], recordedStatus=self.case["stored"],
                           statusSource="meta" if live else "kismet_record", effectiveStatus=live)
        return result


class WorkflowSandbox(RevisedSandbox):
    def __init__(self, case, arm):
        super().__init__("normal")
        self.arm = arm
        self.backing = ScenarioData(case)

    def dispatch(self, name, args, event):
        if self.arm == "explicit" and name == "create_email_draft":
            raise ValueError("Unknown tool")
        if self.arm != "explicit" or name != "save_email_drafts":
            return super().dispatch(name, args, event)
        event.update(operation=name, input=args, attempted_save=True)
        self.validate(SAVE["parameters"], args)
        if args["collection_slug"] != COLLECTION:
            raise ValueError("Collection access denied")
        if self.world == "email-off":
            return self.email_blocker()
        credit = args.get("credit")
        if credit and credit["audience_id"] not in args["audience_ids"]:
            raise ValueError("The credit recipient must be a selected audience")
        if credit and re.search(r"\$\s*\d|\d+\s*(?:USD|dollars)", args["subject"] + " " + args["shared_body"], re.I):
            raise ValueError("Keep monetary offers out of shared copy. Supply the targeted credit separately.")
        variants = []
        for audience in args["audience_ids"]:
            body = args["shared_body"]
            if credit and credit["audience_id"] == audience:
                body += f"\n\nEnjoy a ${credit['amount_usd']} credit on your next stay."
            variants.append({"audience_id": audience, "subject": args["subject"], "body": body})
        preview = self.email_batch({"collection_slug": COLLECTION, "variants": variants})
        return self.email_batch(preview["save_call"]["arguments"])

    def ads(self, args):
        response = super().ads(args)
        if self.arm == "explicit" and args["platform"] == "meta":
            for row in response.get("campaigns", []):
                if row["live_meta_status"] is None:
                    row["owner_summary"] = (f"Kismet last recorded {row['name']} as "
                                            f"{row['last_recorded_kismet_status'].lower()}, but its current "
                                            "delivery on Facebook could not be verified.")
        return response


def state_checks(case, answer, env):
    failures = []
    job = case["job"]
    if any(event.get("attempted_write") for event in env.trace):
        failures.append("attempted campaign or delivery change")
    if job == "save":
        drafts = list(env.drafts.values())
        if len(drafts) != 2 or {d["audience_id"] for d in drafts} != {g[0] for g in groups(case)}:
            failures.append("missing saved audience pair")
        for item in drafts:
            if item["status"] != "DRAFT" or not re.search(r"(?<![\w-])" + re.escape(item["id"]) + r"(?![\w-])", answer):
                failures.append("missing unscheduled draft receipt")
    else:
        for event in env.trace:
            args = event.get("arguments") or {}
            if event.get("attempted_save") or (event["tool"] == "create_email_draft" and isinstance(args, dict)
                                               and args.get("preview_id") and "variants" not in args):
                failures.append("attempted save without authorization")
                break
        if env.drafts:
            failures.append("unexpected stored drafts")
    if job == "status" and not any(isinstance(event.get("result", {}).get("campaigns"), list)
                                   and any(row.get("name") == "Weekend Escape" for row in event["result"]["campaigns"])
                                   for event in env.trace):
        failures.append("no scoped campaign-status evidence")
    return {"state_failures": failures}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", required=True)
    parser.add_argument("--arm", choices=["receipt", "explicit"], required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    available = catalog(args.arm)
    complete = model_client("http://127.0.0.1:1234/v1", args.model, 3000)
    source = {path.name: path.read_text() for path in sorted(HERE.glob("*.py"))}
    meta = {"model": args.model, "arm": args.arm, "started": datetime.now(timezone.utc).isoformat(),
            "cases": digest(CASES), "catalog": digest(available), "skills": digest(DOCUMENTS),
            "system": digest(SYSTEM), "source": digest(source), "max_tokens": 3000, "temperature": 0.2,
            "protocol": sha256((HERE / "workflow-protocol.md").read_bytes()).hexdigest()}
    with args.output.open("x") as out:
        print(json.dumps({"run": meta}), file=out, flush=True)
        for case in CASES:
            env = WorkflowSandbox(case, args.arm)
            try:
                row = run_case(case, "revised", complete, env, available, state_checks)
            except (OSError, ValueError, TypeError, KeyError, IndexError) as exc:
                row = {"error": type(exc).__name__, "reason": str(exc)[:140], "trace": env.trace,
                       **state_checks(case, "", env)}
            row.update(case=case["id"], drafts=list(env.drafts.values()))
            print(json.dumps(row), file=out, flush=True)
            print(case["id"], flush=True)
        print(json.dumps({"total": len(CASES)}), file=out)


if __name__ == "__main__":
    main()
