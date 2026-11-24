# Operator dogfood evaluations

Can a general-purpose chat model answer an operator's question using the skills and operations available to that account? This suite replays field questions against fictional collections. Every trial starts a new conversation. The model gets the operator's words, the installed skill index, and native function definitions. It can open the package's skill markdown on demand. It cannot browse the checkout, read grader files, execute code, contact Kismet, use a previous conversation, or send email or spend money.

## Run

Use Python 3.9 or later, from the repository root.

```sh
python3 -m venv evals/operators/.venv
. evals/operators/.venv/bin/activate
python -m pip install -r evals/operators/requirements.txt
python -m unittest discover -s evals/operators -v
python evals/operators/run.py --model YOUR_MODEL --base-url http://127.0.0.1:1234/v1 \
  --surface compact --repeat 3 --output /tmp/operators-compact.jsonl
python evals/operators/run.py --model YOUR_MODEL --base-url http://127.0.0.1:1234/v1 \
  --surface operations --repeat 3 --output /tmp/operators-named.jsonl
```

Use a stateless Chat Completions endpoint that supports native function calling. Local instruction models work without account credentials. For an approved private model endpoint, set its base URL and, if required, supply its model credential via `EVAL_MODEL_API_KEY`. Keep credentials out of commands and reports. Use a new output filename each time. Each file contains fixture and skill fingerprints, the final answers, arguments, fixture results and individual checks. Provider errors and exceeded budgets fail the run. The exit status is nonzero if a behavior check fails. CI runs the deterministic checks without model credentials.

## What each comparison measures

- `compact` replays the November 19 customer connector's two top-level tools, search and execute. The fixture implements keyword lookup over a bounded operation set. Its search ranking is local. The capture only contributes descriptions and JSON input schemas. All data and operation outcomes are synthetic.
- `operations` exposes those same individual operations by name with the same schemas, package and data. This comparison isolates the cost of discovery. It covers eight representative operations. The 24-tool proposed product manifest, the full production catalog, a registry installation, production auth, and live provider delivery each require separate acceptance evidence.
- The Meta live/recorded split reflects the November 23 status correction. Email creation remains absent from the customer fixture, even though a dashboard can create drafts. The inactive-module fixture exercises proposed product behavior. Its wording is illustrative. Fixture rows contain the fields necessary for these questions, not a full provider account.
- Offer redemptions use an explanation-only case. A manager still needs to take a test recipient through actual private checkout to verify delivery and redemption.

## Grade the job and the answer separately

Read `behavior_pass`, `task_completed`, and `product_gap` together. An assistant can describe an unavailable campaign tool accurately and help prepare copy while the request to persist drafts remains incomplete. A guessed number fails without evidence from the correct operation, collection and applicable channel. A write attempt fails even if a fixture refuses it. The grader checks selected answer facts and unsupported claims. It cannot establish that every sentence is true.

Review the actual answers alongside the machine checks. In particular, verify source and freshness, which audience gets the incentive, and whether a claimed transaction, coupon, link or saved draft exists. Record grader disagreements separately. Compare the same case, model version, surface, package and sampling settings across multiple trials. Report correct trials and cases passing every trial. Treat a single fabricated action or access disclosure as an individual release blocker even when other cases pass.

## Add a field case

1. Capture the operator's job and the evidence that would settle it. Replace names, brands, dates, figures, recipients and URLs with synthetic equivalents before committing. Keep raw correspondence and credentialed captures private.
2. Add natural language to `cases.json`, an ordinary or edge state in `sandbox.py`, and independent evidence and answer checks. Include a contrasting case when a field changes the answer, such as live Meta status versus the saved fallback. Test both a correct answer and a plausible false positive in `test_eval.py`.
3. Use `--split development` while revising a skill. Use `--split holdout` for comparison after the revision. A public holdout is invisible to this runner's model but visible to contributors. Rotate in unseen partner questions before a launch decision.
4. Inspect evidence when a case fails. Assign an incorrect backend result to the API owner, a missing customer action to the tool owner, and failed discovery or interpretation of a correct result to the package owner. Keep the original failed run.
5. Verify promising fixes in the target host with an ordinary OAuth account and an assigned test collection. Repeat with an unassigned collection and a disabled module. For authorized action tests, require read-back of the draft, test delivery, or provider state as appropriate. Record only redacted evidence in review.

The evaluation design follows the [OpenAI evaluation guide](https://developers.openai.com/api/docs/guides/evaluation-best-practices).
