"""Second 24-operation contract, evaluated alongside the frozen first candidate."""
from copy import deepcopy
from hashlib import sha256
import json

from candidate import CandidateSandbox, TOOLS, grade_candidate
from grade import grade
from sandbox import COLLECTION, SKILL_TOOL

REVISED = deepcopy(TOOLS)
REVISED["get_ads"]["description"] = (
    "Check advertising for a collection. For Google conversion upload counts, errors or last attempt "
    "request account_health. For a campaign's current status request campaigns. For purchases versus "
    "matched bookings request attribution. Meta campaign status can be unavailable when the provider "
    "cannot be read. Report the source. Attribution alone cannot establish causation.")
ads_params = REVISED["get_ads"]["inputSchema"]
ads_params["properties"]["days"].update(minimum=1, maximum=365, default=30)
ads_params["required"].remove("days")
REVISED["list_audiences"]["description"] = (
    "Find saved email audiences for a collection. Returns audience IDs, names and member counts. "
    "Use these IDs to draft for existing groups.")
text_field = {"type": "string", "minLength": 1}
variant = {"type": "object", "properties": {k: text_field for k in ("audience_id", "subject", "body")},
           "required": ["audience_id", "subject", "body"], "additionalProperties": False}
REVISED["create_email_draft"] = {
    "description": "Prepare one or more unscheduled email drafts. Look up saved audiences with list_audiences. "
                   "Preview by passing variants, one per audience. To save the preview as reviewable drafts, "
                   "call again with its preview_id and omit variants. Saving returns draft IDs. Nothing sends. "
                   "A request just to preview ends after the first call.",
    "inputSchema": {"type": "object", "properties": {
        "collection_slug": text_field,
        "variants": {"type": "array", "minItems": 1, "maxItems": 10, "items": variant},
        "preview_id": text_field}, "required": ["collection_slug"], "additionalProperties": False,
        "oneOf": [{"required": ["variants"]}, {"required": ["preview_id"]}]}
}


def revised_functions():
    return [{"type": "function", "function": {"name": name, "description": item["description"],
                                              "parameters": item["inputSchema"]}}
            for name, item in {**REVISED, "read_skill": SKILL_TOOL}.items()]


class RevisedSandbox(CandidateSandbox):
    def __init__(self, world):
        super().__init__(world, "revised")
        self.batches = {}

    def dispatch(self, name, args, event):
        if name not in {"get_ads", "create_email_draft"}:
            return super().dispatch(name, args, event)
        event.update(operation=name, input=args)
        self.validate(REVISED[name]["inputSchema"], args)
        if args["collection_slug"] != COLLECTION:
            raise ValueError("Collection access denied")
        if name == "create_email_draft":
            return self.email_batch(args)
        # Reuse the same permission and validation checks as the original candidate.
        return super().dispatch(name, {"days": 30, **args}, event)

    def ads(self, args):
        if args["platform"] != "meta":
            return super().ads(args)
        sections = args.get("include", ["account_health", "campaigns", "performance"])
        other = [section for section in sections if section not in {"campaigns", "attribution"}]
        result = super().ads({**args, "include": other})
        base = {"collection_slug": args["collection_slug"], "channel": "meta"}
        if "campaigns" in sections:
            rows = self.read("list_ad_campaigns", base)["campaigns"]
            result["campaigns"] = []
            for row in rows:
                live = row["statusSource"] == "meta"
                result["campaigns"].append({
                    "id": row["id"], "name": row["target"]["label"],
                    "live_meta_status": row["status"] if live else None,
                    "effective_meta_status": row["effectiveStatus"] if live else None,
                    "last_recorded_kismet_status": row.get("recordedStatus", row["status"] if not live else None),
                    "live_checked_at": "2026-06-07T15:20:00Z" if live else None,
                    "source": "Meta" if live else "Kismet record only. Current Meta status unknown."})
        if "attribution" in sections:
            attribution = self.read("get_ads_attribution", {**base, "days": args["days"]})
            result["attribution"] = {"days": args["days"], "campaigns": [{
                "name": row["campaignName"], "reported_click_purchases": row["metaReported"]["clickPurchases"],
                "reported_view_purchases": row["metaReported"]["viewPurchases"],
                "meta_reported_purchases": row["metaReported"]["clickPurchases"] + row["metaReported"]["viewPurchases"],
                "matched_kismet_bookings": row["bookings"]} for row in attribution["byCampaign"]],
                "basis": "Provider attribution and booking matches. Incremental lift is unmeasured."}
        return result

    def email_batch(self, args):
        if self.world == "email-off":
            return self.email_blocker()
        if "preview_id" in args:
            items = self.batches.get(args["preview_id"])
            if items is None:
                raise ValueError("Unknown preview for this collection and session")
            drafts = [self.draft({**entry, "confirm": True}) for entry in items]
            return {"status": "DRAFT", "drafts": drafts, "sent": 0}

        items = [{"collection_slug": COLLECTION, **item} for item in args["variants"]]
        if len({item["audience_id"] for item in items}) != len(items):
            raise ValueError("Use one variant per saved audience in this batch")
        previews = [self.draft(item) for item in items]
        preview_id = sha256(json.dumps(items, sort_keys=True).encode()).hexdigest()[:16]
        self.batches[preview_id] = items
        return {"status": "preview", "preview_id": preview_id, "variants": previews,
                "next_step": "To save these unscheduled drafts call create_email_draft with collection_slug and preview_id."}


def grade_revised(case, answer, env):
    job = case.get("job", case["id"])
    if job in {"live-status", "fallback-status", "preview-only", "attribution"}:
        # These reads now expose source and matching counts to the caller.
        return grade(case, answer, [*env.trace, *env.backing.trace])
    return grade_candidate(case, answer, env)
