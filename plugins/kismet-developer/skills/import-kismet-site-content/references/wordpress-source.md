# WordPress source capture

Use this source adapter with `site-content-migration`, not as a separate CMS
contract. It works for RockyPoint or any authorized WordPress migration.

## 1. Scope and discover

Reuse the confirmed SSH host/alias, WordPress path, site URL (including the
multisite subsite), and destination collection from the task. Resolve missing
scope before remote access. Keep credentials in the existing SSH mechanism.
No installation, database changes, plugin activation, or production cutover is
part of capture. WP-CLI bootstraps the installed application; use an existing
read replica/export environment when available. Do not claim that loading
arbitrary plugins is guaranteed free of side effects.

Inventory public URLs from sitemaps, navigation and rendered pages alongside
WordPress types and records. Reconcile both directions: sitemap-only,
export-only, redirects, archives, pagination, duplicates and exclusions. Keep
`source site + WordPress post ID` as identity; a slug change is an update.

Read-only command templates, after substituting the confirmed path/site:

```sh
wp --path=/confirmed/wordpress --url=https://source.example post-type list --fields=name,label,public,hierarchical --format=json
wp --path=/confirmed/wordpress --url=https://source.example post list --post_type=page,post --post_status=publish --posts_per_page=-1 --fields=ID,post_type,post_status,post_title,post_name,post_parent,url,post_modified_gmt --format=json
wp --path=/confirmed/wordpress --url=https://source.example menu list --format=json
wp --path=/confirmed/wordpress --url=https://source.example menu item list confirmed-menu-slug --fields=db_id,type,title,link,position,menu_item_parent,object_id,object --format=json
wp --path=/confirmed/wordpress --url=https://source.example option get show_on_front
wp --path=/confirmed/wordpress --url=https://source.example option get page_on_front
wp --path=/confirmed/wordpress --url=https://source.example option get page_for_posts
wp --path=/confirmed/wordpress --url=https://source.example option get permalink_structure
```

Store command output privately, not in the public web root. Repeat content
inventory for explicitly selected **editorial** custom post types. Do not use
`post_type=any` as an import scope. Exclude orders, bookings, form submissions,
users, private/password-protected pages and drafts unless separately scoped;
the normalizer below accepts only published, unprotected editorial records.
Block themes may use `wp_navigation` and reusable `wp_block` records instead
of classic menus. Inventory them separately as dependencies, not public pages.

## 2. Sample before bulk capture

Read one complete page and article, plus each materially different type.
Identify Gutenberg blocks, reusable block references, ACF field names,
Elementor/builder data, shortcodes, SEO metadata and form integrations.
Map content types, field names, constraints, ownership and renderer templates
before importing. Identify public bylines separately from account identities.

Use a reviewed custom-field allowlist. Inspect specific keys with
`wp post meta get <ID> <confirmed-key> --format=json`; never export all options,
`wp-config.php`, database dumps or user records for a copy migration. Preserve
builder data as untrusted source evidence; do not execute PHP, scripts,
shortcodes or serialized objects. Unresolved widgets and shortcodes need an
explicit replacement, exclusion or dependency decision.

## 3. Capture selected content and media

For the approved published page/post scope, run over the existing SSH session
and redirect stdout into a **local private file** outside repositories:

```sh
umask 077
# Example command within the confirmed source environment; transport through
# the existing SSH connection and save stdout locally as selected-content.xml.
wp --path=/confirmed/wordpress --url=https://source.example export --post_type=page,post --post_status=publish --skip_comments --stdout
```

For a reviewed set of IDs, `wp export --post__in=12,34 --with_attachments
--skip_comments --stdout` includes attachment records too. Confirm all IDs are
in scope first. Raw WXR can still contain author emails, custom metadata and
protected records: keep it private even when filters were supplied.

WXR contains attachment metadata/URLs, **not media binaries or site options**.
Capture featured image IDs, inline image references, original files, alt text,
captions, credit, dimensions and rights separately. Use the existing authorized
file transport or supported media ingestion path; do not invent a media API.
Attachment parents do not reliably identify every image used by a page.
Verify missing/unattached shared media explicitly before broadening capture.

Keep menus (including hierarchy/object IDs), selected front-page settings,
taxonomy, canonical/redirect evidence and public author mapping as companion
review artifacts. They are not all normalized by the WXR helper.

## 4. Normalize locally, then map to the supported contract

```sh
python3 scripts/wordpress_inventory.py /private/path/selected-content.xml \
  --source-site https://source.example \
  --output /private/path/wordpress-review.json
```

Pass multiple WXR files for split exports. Select editorial custom types with
`--post-types page,post,local_guide`. Add a reviewed field with repeated
`--meta-key hero_heading`; otherwise custom values are excluded and only key
names are inventoried. The tool refuses conflicting duplicate post IDs, XML
DTDs/entities, mismatched source sites and output overwrites. Identical split
records are deduplicated. It has no network, CMS write or publication code.

The JSON is **review-only, not a Developer API manifest**. It preserves stable
IDs, permalinks, source hashes, HTML, excerpt, dates, taxonomy, template and
featured-image references. It flags blocks, possible shortcodes, omitted
custom fields and unresolved images. It excludes comments, account metadata,
non-published/protected content and unreferenced attachment records. HTML and
allowlisted metadata still require sanitization and review; this is not a
general PII scrubber. Do not load the raw HTML into an editor unsanitized.

Merge this inventory with sitemap/menu/rendered evidence, assign per-source
keep/rewrite/merge/exclude decisions, resolve media/entity references, and
define target routes/redirects. Require every unresolved row to be resolved
or explicitly excluded before applying it; do not silently drop unsupported
content. Translate only to the **current documented** CMS plan/apply contract.
If Article or fixed-route support is missing, keep those records pending.

## 5. Prove a pilot, then batch

Use shared Developer API/SDK/MCP plan/apply/review operations when available.
Do not write directly to the CMS database or create a second importer. Carry
source identity/hash, mapping version and expected target revision through
the shared contract. A retry must not duplicate a record or overwrite an
editor's newer changes. Resume from recorded per-item outcomes.

Pilot one page with a hero and structured blocks, one article with public
byline/date/taxonomy, and one source-specific exception. Confirm draft-only
creation, embedded editing, exact revision preview on the registered staging
domain, mobile layout, links/media and matching HTML/JSON-LD/Markdown/discovery.
Keep production routes/publication unchanged. Expand to batches only after
the pilot and conflict/replay behavior pass. Production promotion is separate.

## References

- [WP-CLI export and its limits](https://developer.wordpress.org/cli/commands/export/)
- [Post inventory fields](https://developer.wordpress.org/cli/commands/post/list/)
- [Menu hierarchy and object IDs](https://developer.wordpress.org/cli/commands/menu/item/list/)
