# What did my Meta ads book?

Use the exact question once per case in a fresh Sonny conversation and a fresh Operators MCP client. Both receive the same selected collection, 30-day window, provider responses and synthetic booking evidence. The Sonny replay exercises the platform's server turn with its deterministic router and renders the actual account card. The external arm uses the platform's JSON-RPC initialize, tools/list and tools/call handlers, the compact discovery index and execute wrapper, a simulated manager identity, and a local chat model. Customer records, the upstream network and OAuth are replaced by fixtures. The compact search catalog comes from the pinned public-tool golden definitions and omits ranking examples present only in the full live site graph.

## Review criteria

1. Report the Meta-attributed seven-day click and one-day view purchase counts separately, including an explicit zero when applicable. Reject a combined booking headline, a causal claim, or a row count presented as a purchase count.
2. When the receipt field is present, distinguish Kismet's named click/view matches from the subset backed by receipts. Partial and known-zero receipt counts have different meanings. Day-and-value matching can still name a booking without a purchase receipt.
3. When the field is absent, say receipt coverage is unknown. Legacy matching totals exist in the payload. They do not establish receipt coverage or a guest identity for every reported purchase.
4. A request for the wrong channel or period cannot ground an answer. Record a missing read, model error or refusal separately. Judge the user-visible answer including the Sonny card. Inspect the actual MCP response before attributing an error to the source data.

The three cases with five click and two view purchases deliberately differ only in receipt coverage. The fourth has zero click and four view purchases. Keep these four as regressions once inspected.

## Replay

Use a disposable kismet.travel checkout at the platform SHA in stage.py, with its ordinary test dependencies installed. Supply a local kismet-infrastructure clone containing the pinned revision. From the Operators package repo:

```sh
python3 evals/operators/meta_parity/stage.py /path/to/disposable-kismet.travel /path/to/kismet-infrastructure
```

In the staged platform checkout, run each command with a fresh output path. For the model arm, load a native tool-calling model on loopback port 1234 with a 24,576-token context.

```sh
KISMET_MCP_COMPACT_TOOLS=true PARITY_RESULT=/tmp/sonny.jsonl npx --no-install vitest run operator-meta-parity/replay.test.ts
KISMET_MCP_COMPACT_TOOLS=true PARITY_MODEL=LOCAL_MODEL_ALIAS PARITY_RESULT=/tmp/operator.jsonl npx --no-install vitest run operator-meta-parity/replay.test.ts
```

Each receipt contains the common attribution payload, calls and visible answer. The model arm also records discovery and operation results. A successful Vitest invocation on the model arm establishes that the runner completed. Grade answer quality separately.

Add `PARITY_SUPPLY_READ=1` and choose a new output filename for the supplied-evidence diagnostic. This inserts the actual definition and scoped MCP operation response into the conversation before the first model completion. The user question and model instructions are unchanged. The deterministic platform run also checks that its source attribution object equals the direct MCP result in each case.

Use `python3 evals/operators/meta_parity/review.py SONNY.jsonl OPERATOR.jsonl [...]` to obtain a review packet. Review the three boolean dimensions `windows`, `receipt_coverage` and `grounded`, with a short reason, keyed by the packet's answer and evidence digest. Supply the resulting JSON object with `--verdicts FILE` to score a run. Full success requires a genuine attribution response, the window split, the correct receipt basis and no unsupported claims. Expected quality failures exit with code 1. The [dated snapshot](../baselines/2026-11-24-meta-parity.md) keeps the actual answers and diagnoses by dimension.
