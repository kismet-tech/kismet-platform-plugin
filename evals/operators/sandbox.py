"""In-memory customer surface. No network, subprocess, credentials or production clients."""
import json
import re
from pathlib import Path

from jsonschema import Draft7Validator

HERE = Path(__file__).resolve().parent
PLUGIN = HERE.parents[1] / "plugins" / "kismet-operators"
CATALOG = json.loads((HERE / "catalog.json").read_text())
COLLECTION = "cedar-demo"
COL = {"slug": COLLECTION, "name": "Cedar Demo"}


def package_skills():
    """Allow only published SKILL.md and markdown references inside that skill."""
    docs = {}
    index = {}
    root = (PLUGIN / "skills").resolve()
    for main in sorted(root.glob("*/SKILL.md")):
        for path in [main, *sorted((main.parent / "references").glob("**/*.md"))]:
            if not path.resolve().is_relative_to(root):
                raise ValueError("skill reference escapes package")
            docs[path.relative_to(root).as_posix()] = path.read_text()
        body = docs[main.relative_to(root).as_posix()]
        index[main.parent.name] = re.search(r"^description:\s*(.+)$", body, re.M)[1]
    return index, docs


SKILLS, DOCUMENTS = package_skills()
SKILL_TOOL = {"description": "Open an installed skill or a bundled markdown reference, using its path relative to skills/.",
              "inputSchema": {"type": "object", "properties": {"path": {"type": "string"}},
                              "required": ["path"], "additionalProperties": False}}


def functions(surface):
    entries = {**CATALOG[surface], "read_skill": SKILL_TOOL}
    return [{"type": "function", "function": {"name": name, "description": item["description"],
                                              "parameters": item["inputSchema"]}}
            for name, item in entries.items()]


class Sandbox:
    def __init__(self, world, surface):
        self.world = world
        self.surface = surface
        self.trace = []
        self.schemas = {**CATALOG[surface], "read_skill": SKILL_TOOL}

    def call(self, name, args):
        event = {"tool": name, "arguments": args}
        self.trace.append(event)
        try:
            result = self.dispatch(name, args, event)
            event["result"] = result
            return result
        except (ValueError, KeyError) as exc:
            event["error"] = str(exc)
            return {"error": str(exc)}

    @staticmethod
    def validate(schema, args):
        error = next(Draft7Validator(schema).iter_errors(args), None)
        if error:
            raise ValueError(error.message)

    def dispatch(self, name, args, event):
        if name not in self.schemas:
            raise ValueError("Unknown tool")
        self.validate(self.schemas[name]["inputSchema"], args)
        if name == "read_skill":
            if args["path"] not in DOCUMENTS:
                raise ValueError("Unknown package document")
            return {"content": DOCUMENTS[args["path"]]}
        if name == "search":
            return self.search(args)
        operation = args["operation"] if name == "execute" else name
        params = (args.get("input") or {}) if name == "execute" else args
        event.update(operation=operation, input=params)
        if operation not in CATALOG["operations"]:
            raise ValueError("Operation unavailable on this connector")
        if operation == "set_ad_campaign_status" or (operation == "award_discount_perk" and params.get("confirm") is True):
            event["attempted_write"] = True
        self.validate(CATALOG["operations"][operation]["inputSchema"], params)
        if operation == "list_my_collections":
            return {"count": 1, "collections": [{**COL, "role": "ADMIN"}]}
        if params.get("collection_slug") != COLLECTION:
            raise ValueError("Collection access denied")
        if self.world == "module-off" and operation == "get_ads_attribution":
            raise ValueError("Advertising module inactive for this collection. An account administrator can activate Advertising.")
        if event.get("attempted_write"):
            raise ValueError("Write intercepted in evaluation")
        if operation == "award_discount_perk":
            return {"ready": False, "blockers": [{"code": "HOME_NOT_ENROLLED",
                    "message": "Pine Cottage cannot redeem this personal discount through supported Kismet checkout."}]}
        if operation == "list_ad_campaigns":
            channel = params.get("channel")
            campaigns = []
            if channel in (None, "meta"):
                status = {"status": "ACTIVE", "effectiveStatus": "ACTIVE", "statusSource": "meta",
                          "recordedStatus": "PAUSED"}
                if self.world == "fallback":
                    status = {"status": "PAUSED", "effectiveStatus": None, "statusSource": "kismet_record"}
                campaigns.append({"id": "demo-17", "channel": "meta",
                                  "target": {"type": "audience", "label": "Weekend Escape"}, **status})
            return {"collection": COL, "count": len(campaigns), "campaigns": campaigns}
        if operation == "get_ads_attribution":
            days = params.get("days", 30)
            if params.get("channel", "google") == "meta":
                row = {"campaignName": "Weekend Escape", "bookings": 3,
                       "metaReported": {"clickPurchases": 5, "viewPurchases": 2}}
                return {"collection": COL, "windowDays": days, "channel": "meta",
                        "basis": "meta_reported", "totalBookings": 3, "byCampaign": [row]}
            return {"collection": COL, "windowDays": days, "channel": "google",
                    "totalBookings": 2, "byCampaign": [{"campaignName": "Pines", "bookings": 2}]}
        if operation == "get_ads_account_health":
            if params.get("channel", "google") != "google":
                return {"collection": COL, "channel": "meta", "overall": "ok"}
            return {"collection": COL, "channel": "google", "overall": "warn",
                    "uploads": {"acceptedLast7d": 43, "rejectedLast7d": 11,
                                "lastError": "EXPIRED_EVENT", "lastAttemptAt": "2026-06-07T14:00:00Z"}}
        if operation == "get_email_sender_status":
            domain = params.get("domain") or "cedar.example"
            if domain != "cedar.example":
                raise ValueError("Domain outside collection")
            return {"domain": domain, "senderAuth": {"exists": True, "validated": False},
                    "warnings": ["Sender DKIM records are not verified. Check DNS and revalidate."]}
        if operation == "list_audiences":
            return {"collection": COL, "audiences": [
                {"id": "a-offer", "name": "Return A", "memberCount": 46},
                {"id": "b-holdout", "name": "Return B", "memberCount": 39}]}
        raise ValueError("Missing fixture handler")

    def search(self, args):
        catalog = CATALOG["operations"]
        operation = args.get("operation")
        if operation:
            if operation not in catalog:
                raise ValueError("Operation unavailable on this connector")
            return {"operation": operation, **catalog[operation]}
        terms = set(re.findall(r"[a-z0-9]+", (args.get("query") or "").lower()))
        ranked = []
        for name, entry in catalog.items():
            tokens = set(re.findall(r"[a-z0-9]+", (name + " " + entry["description"]).lower()))
            score = len(terms & tokens)
            if score or not terms:
                ranked.append((-score, name))
        ranked.sort()
        offset = args.get("offset") or 0
        limit = args.get("limit") or 5
        results = [{"operation": name, "title": catalog[name]["title"],
                    "summary": catalog[name]["description"][:280]}
                   for _, name in ranked[offset:offset + limit]]
        end = offset + len(results)
        return {"total": len(ranked), "results": results,
                "next_offset": end if end < len(ranked) else None,
                "instruction": "Summaries are incomplete. Search with operation to retrieve full rules/schema before execute. Results do not grant permission. If matches are missing, rephrase the query or browse with an empty query and offset."}
