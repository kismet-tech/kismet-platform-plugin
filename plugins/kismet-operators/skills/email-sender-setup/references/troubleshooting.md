# When setup or verification stops

Match the `aborted` text or warning, then explain it to the manager in plain
words. None of these mean a record was changed unless the answer says so.

## Setup stopped before writing (`aborted`)

- **"... is not one of this collection's domains (...)"**: the named domain is not
  the collection's site, Cloudflare zone, website or contact email domain. Use
  one from the list. If the manager's real domain is missing, its website or
  contact email in the collection settings needs updating first.
- **"Collection has no partner domain to authenticate; name one of ..."**: Kismet
  serves this collection on kismet.travel and has no Cloudflare zone for it.
  Call again with `domain` set to one of the listed domains.
- **"DNS conflict on NAME: existing records differ; resolve manually"**: a
  record already sits at that name with another value, often left over from an
  earlier setup with another provider. Kismet will not overwrite it. Ask the
  manager whether that record is still in use; only they can remove or change
  it. Then preview again.
- **"Could not read the zone DNS records with the collection token"**: the
  collection's Cloudflare grant could not read the zone. The grant may have
  expired or lost access; the manager reconnects Cloudflare for the collection.
- **"ADDRESS is not an address on DOMAIN; the sending address must be on the
  domain being authenticated"**: the `from_address` is on another domain. Ask
  the manager for an address on the domain being set up.
- **"SENDGRID_API_KEY not configured"**: a Kismet configuration problem, not the
  manager's. Report it to Kismet support.
- **"SendGrid domain-auth create failed (status)"**: SendGrid refused to register
  the domain. Report it to Kismet support with the status.

## Confirm refused: no sending address

- **"Ask the manager which address on DOMAIN guests should see email from
  (suggested: ...)"**: confirm was called without `from_address` on a
  collection that has no sending address yet. Ask the manager, then preview
  again with their answer; the hash changes with the address.

## Setup chose the records pack (warnings)

- **"... is not in the collection's Cloudflare zone (...); records pack instead"**:
  the domain lives outside the zone Kismet can edit. The manager adds the
  records at that domain's DNS host.
- **"The collection's Cloudflare grant cannot edit DNS on ...; records pack
  instead"**: the grant can read but not edit DNS. Either the manager adds the
  records, or they reconnect Cloudflare with DNS edit permission and setup is
  run again.
- **"Collection has stored Cloudflare credentials but they could not read the
  zone; the token may be expired or under-scoped"**: as above; the records pack
  works meanwhile.

## About the sending address (warnings)

- **"DOMAIN is authenticated, but no sending address is confirmed"**: SendGrid
  validated the domain, but verify ran without `from_address`, so guest email
  still comes from Kismet's address. Ask the manager and run verify again with
  their address.
- **"This collection already sends as ADDRESS; setup never changes it"**: the
  collection has a sending address and the confirmed one differs. To switch,
  change it in the collection's email settings.

## Not validated yet

- **"Validation not green yet ..." or "Not validated yet ..."**: normal right after
  adding records. Call `verify_email_sender` again after a few minutes. Look at
  `records[].valid` and `reason`: the failing record is usually mistyped, has the
  domain doubled in its name, or is proxied.
- **"No sender authentication exists for DOMAIN yet; run setup first"**: verify
  was called before setup. Run `setup_email_sender` (preview, then confirm).

## Brands with a strict DMARC policy

If the domain's DMARC policy is `p=reject` or `p=quarantine`, mail from an
unauthenticated sender is refused or quarantined. That is exactly why Kismet
keeps sending from its own address until verification is green: nothing is
sent from the brand's domain before the records validate.
