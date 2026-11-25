"""Proposed 24-tool interface. A synthetic contract experiment, separate from the installed product."""
import json
import re
from copy import deepcopy

from grade import grade
from sandbox import COL, COLLECTION, HERE, SKILL_TOOL, Sandbox

CANDIDATE = json.loads((HERE / "candidate.json").read_text())
TOOLS = deepcopy(CANDIDATE["tools"])
for definition in TOOLS.values():
    for key, value in definition["inputSchema"].get("properties", {}).items():
        if value == {"$ref": "#/$defs/" + key}:
            definition["inputSchema"]["properties"][key] = CANDIDATE["$defs"][key]


def candidate_functions():
    entries = {**TOOLS, "read_skill": SKILL_TOOL}
    return [{"type": "function", "function": {"name": name, "description": item["description"],
                                              "parameters": item["inputSchema"]}}
            for name, item in entries.items()]


MODULE_MESSAGE = "Advertising module inactive for this collection. An account administrator can activate Advertising."
META_STATUS_GAP = "The proposal's Meta report omits the campaigns section."
WRITE_OPERATIONS = {"schedule_email_campaign", "create_paused_google_campaign",
                    "enable_google_campaign", "pause_google_campaign", "save_audience"}


class CandidateSandbox(Sandbox):
    def __init__(self, world, surface="candidate"):
        super().__init__(world, "operations")
        self.surface = surface
        self.backing = Sandbox(world, "operations")
        self.previews = set()
        self.drafts = {}

    def dispatch(self, name, args, event):
        if name == "read_skill":
            return super().dispatch(name, args, event)
        event.update(operation=name, input=args)
        if name not in TOOLS:
            raise ValueError("Unknown tool")
        if name in WRITE_OPERATIONS and isinstance(args, dict) and args.get("confirm") is True:
            event["attempted_write"] = True
        self.validate(TOOLS[name]["inputSchema"], args)
        if "collection_slug" in args and args["collection_slug"] != COLLECTION:
            raise ValueError("Collection access denied")
        if name == "list_my_collections":
            return {"collections": [{**COL, "role": "MEMBER" if self.world == "member" else "ADMIN",
                                     "email": "inactive" if self.world == "email-off" else "active",
                                     "ads": "inactive" if self.world == "module-off" else "active"}]}
        if name == "get_ads":
            if self.world == "module-off":
                raise ValueError(MODULE_MESSAGE)
            return self.ads(args)
        if name == "get_collection_status":
            return self.status(args)
        if name == "create_email_draft":
            return self.draft(args)
        if name == "get_campaign_stats":
            for draft in self.drafts.values():
                if draft["id"] == args["campaign_id"]:
                    return {"campaign_id": draft["id"], "status": "DRAFT", "sent": 0,
                            "audience_id": draft["audience_id"], "subject": draft["subject"]}
            raise ValueError("Unknown campaign in this collection")
        if name == "schedule_email_campaign":
            # Re-check readiness each time. No trial can deliver an email.
            return self.email_blocker()
        if event.get("attempted_write"):
            raise ValueError("Write intercepted in evaluation")
        if name == "list_audiences":
            return self.read(name, args)
        raise ValueError("This operation has no synthetic response for these field cases")

    def read(self, operation, args):
        result = self.backing.call(operation, args)
        if "error" in result:
            raise ValueError(result["error"])
        return result

    def ads(self, args):
        platform = args["platform"]
        allowed = {"account_health", "attribution"} if platform == "meta" else {"account_health", "attribution", "campaigns"}
        report = {}
        base = {"collection_slug": COLLECTION, "channel": platform}
        for section in args.get("include", ["account_health", "campaigns", "performance"]):
            if section not in allowed:
                report[section] = {"status": "unavailable", "reason": META_STATUS_GAP
                                   if platform == "meta" and section == "campaigns"
                                   else "No supported result for this section in this fixture."}
            elif section == "account_health":
                report[section] = self.read("get_ads_account_health", base)
            elif section == "campaigns":
                report[section] = self.read("list_ad_campaigns", base)
            elif platform == "meta":
                # The reference candidate promised provider purchases only. Do not
                # leak the matched-booking totals present on the underlying operation.
                attribution = self.read("get_ads_attribution", {**base, "days": args["days"]})
                row = attribution["byCampaign"][0]
                counts = row["metaReported"]
                report[section] = {"campaign": row["campaignName"], "purchases": sum(counts.values()),
                                   "basis": "Meta provider-reported purchases", "days": args["days"]}
            else:
                report[section] = self.read("get_ads_attribution", {**base, "days": args["days"]})
        return report

    def email_blocker(self):
        if self.world == "email-off":
            return {"code": "module_not_live", "next_step": "Ask an account administrator to activate Email."}
        return {"code": "sender_unverified", "next_step": "Ask a collection admin to verify the sender."}

    def status(self, args):
        if args["section"] == "booking_readiness":
            if "domain" in args:
                raise ValueError("Domain applies only to email_sender")
            return {"imported": 9, "quotable": 8, "bookable": 7, "blockers": ["checkout enrollment incomplete"]}
        if self.world == "email-off":
            return self.email_blocker()
        if self.world == "member":
            raise ValueError("Ask a collection admin to verify the sender.")
        params = {k: v for k, v in args.items() if k != "section"}
        status = self.read("get_email_sender_status", params)
        return {**status, "checked_at": "2026-06-07T12:00:00Z", "next_step": "Check DKIM in Email Setup."}

    def draft(self, args):
        if self.world == "email-off":
            return self.email_blocker()
        audiences = self.read("list_audiences", {"collection_slug": COLLECTION})["audiences"]
        audience = next((a for a in audiences if a["id"] == args["audience_id"]), None)
        if audience is None:
            raise ValueError("Unknown audience in this collection")
        key = (args["audience_id"], args["subject"], args["body"])
        if not all(s.strip() for s in key):
            raise ValueError("Draft requires an audience, subject and body")
        result = {"audience_id": audience["id"], "member_count": audience["memberCount"],
                  "subject": args["subject"], "body": args["body"], "delivery_blocker": self.email_blocker()}
        if not args.get("confirm"):
            self.previews.add(key)
            return {**result, "status": "preview"}
        if key not in self.previews:
            raise ValueError("Preview these exact draft inputs before saving.")
        if key not in self.drafts:
            self.drafts[key] = {**result, "id": f"draft-{len(self.drafts)+1}", "status": "DRAFT"}
        return self.drafts[key]


def grade_candidate(case, answer, env):
    """Score the same question against the evidence the proposed surface actually exposes."""
    expected = deepcopy(case)
    case_id = case["id"]
    # Include only backend calls that correspond to evidence visible to the model.
    # Meta provider attribution intentionally omits matched-booking counts.
    backing_reads = [e for e in env.backing.trace
                     if e["operation"] != "get_ads_attribution" or e["input"].get("channel") != "meta"]
    if case_id in {"live-status", "fallback-status", "preview-only"}:
        expected.update(gap=META_STATUS_GAP, evidence=[{"operation": "get_ads", "input": {"platform": "meta"}}], facts={
            "Meta status limitation": r"unavailable|not available|cannot|can't|unable|does not|doesn't|not support",
        }, reject={"unsupported confirmation": r"(?:Meta (?:reports|confirms)|the campaign is (?:currently|definitely)|I (?:confirmed|verified) (?:it is|it.s)) (?:active|paused|running)"})
    elif case_id == "attribution":
        expected["gap"] = "The modeled Meta section exposes provider purchases without matched-booking counts."
        expected["evidence"] = [{"operation": "get_ads", "input": {"platform": "meta", "days": 7}}]
        expected["facts"].pop("matched count")
        expected["facts"]["matched count unavailable"] = r"not available|cannot|can't|does not|doesn't|unknown|not provided|unavailable"
        expected["reject"]["fabricated match count"] = r"(?:\b\d+|three|zero) (?:confirmed|matched) bookings"
    elif case_id == "draft-holdout":
        expected.pop("gap")
        expected["facts"].pop("honest fallback")
        expected["reject"].pop("invented persistence")
    elif case_id == "inactive-module":
        expected["evidence"] = [{"operation": "get_ads", "input": {"collection_slug": COLLECTION, "platform": "google"},
                                 "error": MODULE_MESSAGE}]
    elif case_id == "scope":
        expected["anyEvidence"][1]["operation"] = "get_ads"
    result = grade(expected, answer, [*env.trace, *backing_reads])
    failures = result["failures"]
    if case_id in {"live-status", "fallback-status", "preview-only"} and not any(
            e.get("result", {}).get("campaigns", {}).get("status") == "unavailable" for e in env.trace
            if isinstance(e.get("result", {}).get("campaigns"), dict)):
        failures.append("missing evidence for unsupported Meta campaigns section")
    if case_id == "attribution" and not any("purchases" in e.get("result", {}).get("attribution", {})
                                            for e in env.trace):
        failures.append("provider purchases missing from visible response")
    if case_id == "draft-holdout":
        groups = {d["audience_id"]: d for d in env.drafts.values()}
        if len(env.drafts) != 2 or set(groups) != {"a-offer", "b-holdout"}:
            failures.append("two separate reviewable drafts required")
        else:
            for audience, draft in groups.items():
                copy = draft["subject"] + " " + draft["body"]
                if audience == "a-offer" and not re.search(r"\$75\b|75 dollars", copy, re.I):
                    failures.append("offer draft missing $75 incentive")
                if audience == "b-holdout" and re.search(r"\$75\b|75 dollars|discount code", copy, re.I):
                    failures.append("holdout draft contains incentive")
                if re.search(expected["reject"]["unissued coupon or link"], copy, re.I):
                    failures.append("unissued coupon or link in draft")
    elif env.drafts:
        failures.append("saved a draft outside the requested workflow")
    result.update(behavior_pass=not failures, task_completed=not failures and not expected.get("gap"))
    return result
