# Unscheduled drafts and owner-facing Meta status

**Decision, November 24, 2026.** Continue prototyping a direct unscheduled save. Keep human review for guest copy and owner-facing campaign status. Returning a quote alongside the status fields did not improve the observed owner answers.

We froze the [questions and scoring rules](../workflow-protocol.md) at `1a9b758` and the tested contracts at `7ee0d9d`. Thirty-two fresh, local model conversations compared the receipt flow against an explicit save and a provider-unavailable sentence. Each of eight scenarios ran once on each arm and model. Both arms exposed 24 operations, the same packaged skills, and the same synthetic collection state. The reviewer scored final text and stored bodies with model and contract labels hidden. Programmatic checks verified the stored records, IDs, scoped reads and write attempts. The reviewer was the experiment author. The challenge prompts were visible to the author before the implementation and withheld from the models until inference.

| Completed workflow | Receipt flow | Explicit save and status sentence |
|---|---:|---:|
| Known development cases | 0/4 | 1/4 |
| Six challenge cases | 5/12 | 5/12 |
| Save two usable drafts | 0/4 | 1/4 |
| Preview two usable messages without saving | 0/4 | 0/4 |
| Give an accurate owner-facing status | 5/8 | 5/8 |

The first two rows split trials by case set. The last three split the same trials by workflow. Qwen3 4B passed 3/8 control and 4/8 experimental trials. GPT-OSS 20B passed 2/8 in each arm. There were zero model runtime errors.

**Draft persistence and copy quality.** The explicit action persisted both drafts in 3/4 authorized trials, versus 2/4 with receipts. Its one fully successful trial was the familiar $75 offer. Both models saved the reversed $35 offer to Orchard using the explicit action. The amount stayed out of Harbor's message, but the shared copy still promised Harbor a special offer. Other failures included claiming an award was already credited and rendering a valid ID with a nonbreaking hyphen that breaks literal lookup. On chat-only requests, zero of eight trials saved a draft. None produced two usable messages under the full rubric. Examples included an invented checkout code, a phone number, a no-fee promise and refusal to write copy without a tool.

**Owner status.** With the identical neutral owner question, each arm passed 2/2 when Meta confirmed a pause, 2/2 when Kismet stored ACTIVE and Meta was unavailable, and 1/2 when Meta reported ACTIVE while Kismet stored PAUSED. With the leading question asking to confirm a pause, both arms passed 0/2 when only the stored pause existed. The models sometimes included the uncertainty sentence directly after asserting a live pause. Either assertion can be copied into a real owner update.

**What to test next.** For email, render both variants from a reviewed neutral message with a structured optional incentive and return the same preview that will be saved. For Meta, test an owner-copy field displayed verbatim by the host. Keep the two raw statuses available for inspection. Check both changes on new partner questions, including counterexamples where a live pause really exists. The present cases enter regression coverage. A later release comparison should hold out entire customer conversations and time periods, use a second reviewer, repeat trials, and include the signed-in target host.

## Evidence

The private synthetic snapshot includes the four raw runs, blinded packet, reviewer decisions, scored rows and a checksum manifest. SHA-256 of the manifest is `fcf757ddbe5354807e3f8def17b64cf7a4d64569e7707a76fe1b3fdffb7ae6aa`. The pilot sample supports a design decision. It does not establish ordinary-account permissions, real deliveries or an expected production success rate.
