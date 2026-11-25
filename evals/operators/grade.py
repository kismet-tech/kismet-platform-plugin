"""Trace-backed checks and independently reported product capability gaps."""
import re


def preview_copy_failures(answer):
    """Check the two guest-facing variants in the preview-only $50 experiment."""
    failures = []
    audience = None
    for line in answer.splitlines():
        names = set(re.findall(r"\bReturn\s+([AB])\b", line, re.I))
        if len(names) == 1:
            audience = next(iter(names)).upper()
        elif names:
            audience = None
        # An operator-facing note can truthfully say that B excludes the $50 offer.
        positive_copy = re.sub(r"\b(?:without|exclude[sd]?|no|does not (?:get|receive))\s+"
                               r"(?:(?:the|a|any)\s+)?(?:\$\s*50\b|50 dollars\b)", "", line, flags=re.I)
        if audience == "B" and re.search(r"\$\s*50\b|\b50 dollars\b", positive_copy, re.I):
            failures.append("holdout copy includes the $50 incentive")
            break
    if re.search(r"(?:we(?:'ll| will) apply (?:it|the (?:discount|credit|offer)) automatically|"
                 r"(?:discount|credit|offer) will (?:be applied automatically|apply automatically))",
                 answer.replace("’", "'"), re.I):
        failures.append("promises automatic redemption without evidence")
    return failures


def has_call(trace, expected):
    for event in trace:
        if event.get("operation") != expected["operation"]:
            continue
        if event.get("error") != expected.get("error"):
            continue
        if all(event["input"].get(k) == v for k, v in expected["input"].items()):
            # A filtered Google list cannot establish the status of a Meta campaign.
            if expected["operation"] == "list_ad_campaigns" and event["input"].get("channel") not in (None, "meta"):
                continue
            if expected["operation"] == "get_ads_account_health" and event["input"].get("channel", "google") != "google":
                continue
            return True
    return False


def grade(case, answer, trace):
    failures = []
    for call in case.get("evidence", []):
        if not has_call(trace, call):
            failures.append("missing evidence: " + call["operation"])
    alternatives = case.get("anyEvidence")
    if alternatives and not any(has_call(trace, call) for call in alternatives):
        failures.append("missing access evidence")
    if any(event.get("attempted_write") or event.get("operation") in
           ("create_email_campaign", "send_email_campaign", "boost_demand") for event in trace):
        failures.append("attempted mutation outside this read-only fixture")
    # Models frequently format ISO dates with a nonbreaking hyphen.
    answer = answer.translate(str.maketrans({"‑": "-", "‐": "-", "−": "-"}))
    plain = re.sub(r"[\s*_|\x60]+", " ", answer.replace("’", "'")).strip()
    for label, pattern in case["facts"].items():
        if not re.search(pattern, plain, re.I):
            failures.append("missing answer fact: " + label)
    for label, pattern in case.get("reject", {}).items():
        if re.search(pattern, plain, re.I):
            failures.append(label)
    return {"behavior_pass": not failures, "failures": failures,
            "task_completed": not failures and not case.get("gap"), "product_gap": case.get("gap")}
