# Adding the three records at a DNS host

Every record setup returns is a CNAME. The manager adds each one with the
name and value exactly as given. Two details trip people up at almost every
provider.

1. **The name field.** Many providers want only the part before the domain. For
   `ksm._domainkey.brand.com` at `brand.com`, the name is `ksm._domainkey`.
   Typing the full name there often creates `ksm._domainkey.brand.com.brand.com`,
   which never validates. If the provider shows the domain beside the field,
   leave it off.
2. **Proxy or forwarding.** The records must resolve straight to SendGrid.
   Any proxy, CDN or "flattening" option on these three records must be off.

## By provider

- **Cloudflare** (when Kismet has no grant for the zone): DNS, Records, Add
  record, Type CNAME, Name as above, Target the value, Proxy status **DNS only**
  (grey cloud). An orange cloud fails validation.
- **GoDaddy**: My Products, DNS, Add New Record, Type CNAME, Name the part before
  the domain, Value the target, TTL default.
- **Namecheap**: Domain List, Manage, Advanced DNS, Add New Record, CNAME Record,
  Host the part before the domain, Value the target.
- **Squarespace Domains** (including domains moved from Google Domains): Domains,
  the domain, DNS, Custom records, Add record, Type CNAME, Host the part before
  the domain, Data the target.
- **Amazon Route 53**: Hosted zones, the domain, Create record, Record type
  CNAME, Record name the part before the domain, Value the target, Routing
  simple. Route 53 adds the trailing dot itself.
- **Wix**: Domains, the domain, Manage DNS records, CNAME, Add record, Host name
  the part before the domain, Value the target.
- **Microsoft 365 or Google Workspace**: these manage mail, not usually DNS.
  The records go wherever the domain's nameservers point; check with
  `get_email_sender_status` warnings or the domain registrar.

If the provider is not listed, the same three fields exist everywhere: type
CNAME, a host or name, and a target or value.

## After adding

DNS changes usually show within minutes and can take up to a day at some
providers. Call `verify_email_sender`; it reports each record separately, so a
single typo is easy to find. A record reported as not matching almost always has
the doubled domain in its name or a proxy switched on.

## What not to change

Tell the manager not to edit or remove their existing SPF (`v=spf1` TXT), MX or
DMARC (`_dmarc` TXT) records for this. Kismet's three CNAMEs work alongside the
records their current email provider already uses.
