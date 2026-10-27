---
name: email-sender-setup
description: Set up email sender authentication for a Kismet collection through the authenticated Kismet User MCP, so guest emails can be sent as the brand's own domain. Covers both paths, a Cloudflare-connected brand (Kismet writes the DKIM and return-path records itself) and any other DNS host (Kismet hands back the records for the manager to add), then verification. Use when a manager asks to send email from their own domain, to set up DKIM or SendGrid authentication, to check why branded emails come from a Kismet address, or to verify records they added.
---

# Kismet Email Sender Setup

Guest emails Kismet sends for a brand (refund confirmations, stay emails,
sign-in codes, campaigns) can come from the brand's own address, such as
reservations@brand.com, instead of Kismet's. Mail servers accept that only when
the brand's domain authorizes Kismet's sender, SendGrid, through three DNS
records: one return-path CNAME and two DKIM CNAMEs. This skill sets those up and
checks them.

## The tools

| Tool | What it does |
| --- | --- |
| `get_email_sender_status` | Reads only. Which domain, whether it is a Cloudflare zone the collection's stored grant can edit, whether SendGrid already knows the domain and has validated it, and which setup path applies. |
| `setup_email_sender` | Two calls. `confirm:false` returns the plan: domain, mode, every record, the sending address, plain-language instructions, and a `previewHash`. Nothing is written. `confirm:true` with the same domain, the same `from_address` and that `previewHash` carries it out. |
| `verify_email_sender` | Asks SendGrid to re-check the records and returns each one with whether it now resolves. Never registers a domain, never touches DNS. On green it starts sending as the confirmed `from_address`. |

All three need collection ADMIN and take `collection_slug`. `domain` is
optional and must be one of the collection's own domains: the site Kismet serves
for it, its Cloudflare zone, its website, or the domain of its contact email.
Anything else is refused with the list of allowed domains.

`from_address` is the address guests will see email from, such as
reservations@brand.com. It must be on the domain being authenticated. Setup
and verify take it, and setup will not confirm without it unless the
collection already sends as an address.

## Workflow

1. **Read the status.** Call `get_email_sender_status`. Tell the manager the
   domain and the path in one sentence: "Kismet can add the records to your
   Cloudflare zone" or "You will add three records at your DNS host".
   If the domain is wrong or missing, ask which of their domains to use and pass
   it as `domain`.
2. **Confirm the sending address with the manager. Never assume it.** Ask which
   address guests should see email from, on this domain. A preview without
   `from_address` returns `fromAddress.suggested` (the collection's contact
   address when it is on the domain, else hello@ there): offer it as a
   suggestion, not a decision, and use the address the manager names. If
   `fromAddress.current` is set, the collection already sends as that address
   and setup never changes it; say so, and point to the collection's email
   settings if they want another.
3. **Preview.** Call `setup_email_sender` with `confirm:false` and the manager's
   `from_address`. Show the manager the domain, the mode, each record exactly as
   returned (name, type, value), and the sending address (`fromAddress.planned`).
   Say what will and will not change (see "What setup never does").
4. **Confirm, only after the manager says yes.** Call `setup_email_sender` with
   `confirm:true`, the same `domain`, the same `from_address`, and the returned
   `previewHash`. If the answer says the plan changed, show the new plan and ask
   again. Never reuse an old hash and never confirm on the manager's behalf.
   Confirm is refused while no sending address is confirmed.
5. **Path A, automated** (`mode: automated`): Kismet wrote the records. The
   answer says whether SendGrid validated them at once. If not, DNS is still
   propagating: call `verify_email_sender` again in a few minutes, with the
   same `from_address`.
6. **Path B, records pack** (`mode: partner_handoff`): nothing was written.
   Give the manager the `instructions` lines, or a table of name, type and
   value, and point them to [references/dns-hosts.md](references/dns-hosts.md)
   for their DNS provider. When they say the records are in, call
   `verify_email_sender` with the confirmed `from_address`.
7. **When verification is green**, say so plainly. The answer's
   `stayFromAddress` is the address guest email now comes from: the one the
   manager confirmed, or the address the collection already used. Nothing is
   sent from the brand's domain before this point.

## What setup never does

- It never overwrites or deletes a DNS record. If a record already exists at
  one of the names with another value, setup stops before writing anything and
  reports the conflict.
- It never changes the domain's SPF record, MX records or an existing DMARC
  record. It adds a DMARC record (`p=none`) only when the domain has none at
  all.
- It never writes into a zone the domain does not belong to, or with a grant
  that cannot edit DNS; it hands back the records instead.
- It sends no email and does not change who an email is from until SendGrid has
  validated the records.

## Reading the answers

- `mode`: `automated` (Kismet writes into the collection's Cloudflare zone) or
  `partner_handoff` (the manager adds the records).
- `records[].state`: `create` (will be added), `exists` (already right),
  `conflict` (another value is there; setup stopped), `partner_add` (for the
  manager to add).
- `dmarc`: `exists`, `planned`, `created` or `skipped`.
- `fromAddress`: `current` (what the collection sends as now; never changed by
  setup), `planned` (what it will send as once validated; empty until the
  manager confirms one), `suggested` (something to offer, never adopted on its
  own).
- `aborted`: a reason setup stopped. Read
  [references/troubleshooting.md](references/troubleshooting.md) before
  suggesting a fix.
- `warnings`: explain each in plain words; they never mean a record was changed.

## Tone

Managers are rarely DNS experts. Name what they will see ("three new records,
nothing else changes"), avoid jargon after the first mention, and keep record
values exact: one wrong character fails validation.
