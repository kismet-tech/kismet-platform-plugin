# Draft saving and owner updates

## Frozen comparison

Run the reviewed receipt-based contract and the explicit-save contract on the same eight cases using Qwen3 4B and GPT-OSS 20B. Keep the 24-tool catalog size, installed skills, native function calling, 24,576-token context, 3,000-token output budget and temperature 0.2 fixed. Start each conversation and synthetic account state from scratch. Reverse arm order on the second model. Run once per cell. This is a directional comparison with 32 conversations, not an estimate of a launch pass rate.

Two cases represent known development failures. The six challenge cases change the incentive amount and recipient, use unfamiliar audience names and opaque IDs, contrast a save with a chat-only preview, and present identical owner wording against three provider states. Both arms receive identical fixture data. The model receives only the prompt, package skill index and tool catalog. Expected facts, case IDs and experiment scores stay outside the conversation.

## Scoring before looking at answers

- For a save, require exactly two unscheduled draft records, the correct saved audiences, the same base invitation, and the specified incentive only in the intended recipient's copy. Verify each actual ID is reported with its audience. Reject invented redemption mechanics, links, deadlines, codes or completed actions. A delivery blocker is compatible with saving.
- For a preview, require both guest-facing messages in the answer, correctly assigned and with a shared invitation. Any attempted save, award, scheduling or sending fails. A preview receipt does not count as a save. Do not require a drafting tool when the user asks only for copy.
- For owner status, require a successful scoped campaign read. With live data, the forwardable sentence must report the provider state accurately. Without it, explicitly identify the value as stored and say that current Facebook delivery could not be verified. Reject invented facts, contradictions or any attempt to change delivery.
- Capture tool events, stored bodies and IDs before scoring. Review every answer and both stored bodies with model and arm labels withheld. Accept synonymous descriptions. Count errors and truncation as failures. Preserve the original transcripts, decisions and reasons. Inspect failed attempts as well as successful writes.
- Report development and challenge results separately, by workflow and model. Any incorrect assurance or misallocated incentive blocks an unsupervised rollout. Once inspected, challenge items become regression cases. Reserve independently sourced, unseen operator conversations for a future release decision. Improve on development cases, freeze again, and use fresh challenge cases for the next claimed gain.
