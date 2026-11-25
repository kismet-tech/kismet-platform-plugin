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

To compare complete runs, use `python evals/operators/report.py /tmp/operators-compact.jsonl /tmp/operators-named.jsonl`. It checks the skills, catalog, case and runner fingerprints, selected cases and temperature before showing totals, per-case passes, repeated-trial consistency and runtime failures. Model output is stochastic even with fixed temperature. Rerun after changes and retain the earlier file for a dated baseline. Use separate reports when one of the fingerprints changes.

For a separate anonymous installation preflight, run `python evals/operators/check_install.py`. It reads the actual packaged URL, sends a credential-free tool-list request, follows the metadata link in the 401 challenge, and verifies that the identified resource matches the install. A passing preflight covers the challenge step only. Completing OAuth and executing a scoped operation require a signed-in customer session.

## Proposed 24-tool contract

Run the same command with `--surface candidate` to test the proposed 24 named operations. This model-only experiment reuses the public skill index. The 23 unchanged descriptors come from the 25-tool benchmark. The shared `get_collection_status` replaces booking readiness and email sender status. The full schemas plus the skill reader use about 51 KB before conversation history. Choose a model context large enough to test the whole catalog and record that size.

The synthetic implementation covers the selected field jobs. A saved draft requires an exact prior preview, separate saved audiences and no scheduling. The scorer checks both stored bodies. The Meta advertising section in this proposal lacks live campaign status and matched booking counts. A truthful limitation may pass the behavior check while leaving the operator's job incomplete. Other fixture operations without supporting data return an explicit fixture limitation. Compare this profile against a named control with the same context budget.

If manual review reveals a scoring error, add a grader regression test. Use `python evals/operators/rescore.py ORIGINAL.jsonl NEW.jsonl` to preserve the original and score the same answers again. The replay checks that the case definitions and observed tool replies still match. This runs locally without calling a model.

## Compare the revised Operator contract

Use `--surface candidate` for the first 24-tool proposal and `--surface revised` for the revision. Use the same local model, context, `--max-tokens`, suite and repeat count in both runs. Both arms load the skills in the current checkout. For the original model and skill snapshot, use the November 24 baseline commit.

The revised ads report returns a live provider state, its check time, and a separately labeled stored state. The fallback leaves the live fields empty. Meta attribution carries both provider purchases and matched bookings for each campaign. The timestamp is the fixture's simulated observation time.

The revised draft operation accepts one or more variants in a single preview. Any call containing variants only previews them. Saving takes the preview receipt scoped to the collection and session, is idempotent, and returns a draft ID per audience. The draft test checks the persisted bodies, offer assignment and returned IDs. A successful save has no delivery effect. The connection's current customer email-authoring restriction is still covered by the compact and named controls.

```sh
python evals/operators/run.py --model YOUR_MODEL --surface revised --max-tokens 3000 \
  --repeat 2 --output /tmp/operator-revised.jsonl
python evals/operators/run.py --model YOUR_MODEL --surface revised --max-tokens 3000 \
  --suite transfer --repeat 2 --output /tmp/operator-transfer.jsonl
```

The transfer suite changes the phrasing and requested outcome. It checks a source-and-time handoff, an owner-facing sentence when live data is unavailable, and a preview-only request where persisting even a valid draft fails. Keep transfer scores separate from the ten historical field questions.

### Explicit saves and owner-facing status

The [frozen comparison protocol](workflow-protocol.md) covers the two workflow changes. The control uses the prior preview receipt. The experiment replaces that operation with one direct, unscheduled batch save and adds a forwardable sentence only when Meta cannot confirm delivery. Both use the same existing skills. The schema models whole-dollar USD credits for this experiment. All accounts and writes are in memory.

Run each model and arm using the local runner. For example, with a local 4B model loaded under the alias `operator-workflows-4b`:

```sh
python evals/operators/workflow_pair.py --model operator-workflows-4b --arm receipt --output /tmp/4b-receipt.jsonl
python evals/operators/workflow_pair.py --model operator-workflows-4b --arm explicit --output /tmp/4b-explicit.jsonl
```

Use the corresponding `operator-workflows-20b` alias and `20b-ARM.jsonl` filenames for the second model. After all four runs, prepare a label-blind review packet and join the decisions:

```sh
python evals/operators/review/paired.py /tmp /tmp/blind.jsonl
python evals/operators/review/paired.py /tmp /tmp/scored.jsonl --decisions /tmp/decisions.json
```

The JSON decisions object maps each opaque item ID to a boolean `pass` and a short `reason`. Review against the frozen protocol. A state failure or runtime error still fails the trial. Retain the raw packet and review decisions. For an independent release set, have a second person select fresh, redacted operator questions from a later period. Keep each customer conversation and its paraphrases together in one split. Keep those cases outside the public repo until the contract and scorer are frozen. After revealing a set, use it for regression coverage and draw a new one for the next release decision.

For the cross-repo comparison of Sonny and the external connector on the same Meta attribution payloads, see the [replay and scoring instructions](meta_parity/README.md) and the [November 24 side-by-side results](baselines/2026-11-24-meta-parity.md).
