#!/usr/bin/env python3
"""Local WXR -> private review inventory. No network, CMS writes, or rendering."""

import argparse
from collections import Counter
import hashlib
import json
import os
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit, urlunsplit
import xml.etree.ElementTree as ET

CONTENT = "{http://purl.org/rss/1.0/modules/content/}encoded"
EXCERPT = "{http://wordpress.org/export/1.2/excerpt/}encoded"
MAX_BYTES = 64 * 1024 * 1024


def digest(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def site_identity(value):
    parts = urlsplit(value)
    if (parts.scheme not in ("https", "http") or not parts.netloc
            or parts.username or parts.password or parts.query or parts.fragment):
        raise ValueError("Source site must be an HTTP(S) site URL without credentials/query/fragment")
    return urlunsplit((parts.scheme, parts.netloc.lower(), parts.path.rstrip("/"), "", ""))


def parse_file(path):
    with Path(path).open("rb") as stream:
        raw = stream.read(MAX_BYTES + 1)
    if len(raw) > MAX_BYTES:
        raise ValueError("WXR part exceeds 64 MiB; use split exports")
    source = raw.decode("utf-8-sig")
    if "\x00" in source or re.search(r"<!\s*(?:DOCTYPE|ENTITY)\b", source, re.I):
        raise ValueError("Only UTF-8 WXR without DTD/entity declarations is accepted")
    root = ET.fromstring(source)
    channel = root.find("channel")
    if channel is None:
        raise ValueError("Missing WXR channel")
    version = next((node for node in channel if node.tag.endswith("}wxr_version")), None)
    if version is None or version.text not in ("1.1", "1.2"):
        raise ValueError("Expected WXR version 1.1 or 1.2")
    wp = version.tag.split("}")[0] + "}"
    site = channel.findtext(wp + "base_blog_url") or channel.findtext("link") or ""
    return channel, wp, site_identity(site), hashlib.sha256(raw).hexdigest()


def value(item, tag):
    return item.findtext(tag) or ""


def metadata(item, wp):
    result = {}
    for node in item.findall(wp + "postmeta"):
        key = value(node, wp + "meta_key")
        result.setdefault(key, []).append(value(node, wp + "meta_value"))
    return result


def normalize(paths, source_site, post_types=("page", "post"), meta_keys=()):
    site = site_identity(source_site)
    if set(post_types) & {"attachment", "revision", "nav_menu_item", "wp_navigation", "wp_block"}:
        raise ValueError("Dependencies must not be selected as editorial page types")
    records, attachments, source_files = {}, {}, []
    excluded, duplicate_count = Counter(), 0
    for path in paths:
        channel, wp, exported_site, file_hash = parse_file(path)
        if exported_site != site:
            raise ValueError("WXR source site differs from --source-site; verify the export scope")
        source_files.append({"sha256": file_hash})
        for item in channel.findall("item"):
            kind, status = value(item, wp + "post_type"), value(item, wp + "status")
            protected = bool(value(item, wp + "post_password"))
            is_attachment = kind == "attachment"
            if protected:
                excluded["password_protected"] += 1
                continue
            if not is_attachment and kind not in post_types:
                excluded["unselected_type"] += 1
                continue
            if (is_attachment and status not in ("inherit", "publish")) or (not is_attachment and status != "publish"):
                excluded["non_published"] += 1
                continue
            source_id = value(item, wp + "post_id")
            if not re.fullmatch(r"[1-9][0-9]*", source_id):
                raise ValueError("Selected record has no valid WordPress post ID")
            meta = metadata(item, wp)
            first = lambda key: (meta.get(key) or [""])[0]
            excerpt = value(item, EXCERPT) or value(item, EXCERPT.replace("1.2", "1.1"))
            record = {
                "sourceId": source_id,
                "sourceKey": f"wordpress:{site}#{source_id}",
                "sourceUrl": value(item, "link"),
                "sourceType": kind,
                "sourceStatus": status,
                "title": value(item, "title"),
                "slug": value(item, wp + "post_name"),
                "parentId": value(item, wp + "post_parent"),
            }
            if is_attachment:
                record.update({"url": value(item, wp + "attachment_url"),
                               "alt": first("_wp_attachment_image_alt"), "captionHtml": excerpt})
            else:
                body = value(item, CONTENT)
                featured = first("_thumbnail_id")
                image_ids = set(re.findall(r"\bwp-image-([1-9][0-9]*)\b", body))
                if featured:
                    image_ids.add(featured)
                fields = {key: meta[key] for key in sorted(set(meta_keys) & meta.keys())}
                unmapped = sorted(set(meta) - set(meta_keys) - {"_thumbnail_id", "_wp_page_template"})
                record.update({
                    "bodyHtml": body, "bodySha256": digest(body), "excerptHtml": excerpt,
                    "publishedAtGmt": value(item, wp + "post_date_gmt"),
                    "modifiedAtGmt": value(item, wp + "post_modified_gmt"),
                    "template": first("_wp_page_template"),
                    "featuredImageId": featured or None,
                    "imageIds": sorted(image_ids, key=lambda key: (len(key), key)),
                    "taxonomy": [{"taxonomy": node.get("domain", ""),
                                  "slug": node.get("nicename", ""), "label": node.text or ""}
                                 for node in item.findall("category")],
                    "customFields": fields,
                    "unmappedMetaKeys": unmapped,
                    "blockNames": sorted(set(re.findall(r"<!--\s+wp:([\w/-]+)", body))),
                    "possibleShortcodes": sorted(set(re.findall(r"(?<!\[)\[(?!\[)/?([A-Za-z][\w-]*)\b", body))),
                    "reviewRequired": ["type_field_route_mapping", "rendered_page_comparison",
                                       "public_byline_mapping", "media_and_embed_resolution"],
                })
                if not record["sourceUrl"].startswith(("https://", "http://")):
                    record["reviewRequired"].append("missing_or_invalid_permalink")
            # Hash selected source values only, excluding private/omitted metadata.
            record["sourceSha256"] = digest(json.dumps(record, sort_keys=True, ensure_ascii=False))
            target = attachments if is_attachment else records
            if source_id in target:
                if target[source_id] != record:
                    raise ValueError(f"Conflicting duplicate WordPress post ID {source_id}; recapture one snapshot")
                duplicate_count += 1
            target[source_id] = record
    if set(records) & set(attachments):
        raise ValueError("WordPress post ID appears as both content and attachment")
    referenced = {key for record in records.values() for key in record["imageIds"]}
    # A parent outside selected editorial content requires explicit scope review.
    media = {key: record for key, record in attachments.items()
             if key in referenced and record["parentId"] in ("", "0", *records.keys())}
    for record in records.values():
        record["unresolvedImageIds"] = sorted(set(record["imageIds"]) - media.keys())
    excluded["unreferenced_or_out_of_scope_attachment"] = len(attachments) - len(media)
    return {
        "format": "kismet-wordpress-review-inventory-v1",
        "reviewOnly": True,
        "sourceSystem": "wordpress", "sourceSite": site, "sourceFiles": source_files,
        "scope": {"postTypes": sorted(set(post_types)), "status": "publish", "metaKeys": sorted(set(meta_keys))},
        "counts": {"content": len(records), "media": len(media), "duplicateRecords": duplicate_count,
                   "excludedOccurrences": dict(sorted(excluded.items()))},
        "content": sorted(records.values(), key=lambda row: int(row["sourceId"])),
        "media": sorted(media.values(), key=lambda row: int(row["sourceId"])),
        "remainingEvidence": ["sitemap_reconciliation", "menus_and_front_page_settings",
                              "rendered_pages", "media_binaries_rights_dimensions",
                              "canonical_entities", "target_contract_mapping"],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("wxr", nargs="+", type=Path)
    parser.add_argument("--source-site", required=True)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--post-types", default="page,post")
    parser.add_argument("--meta-key", action="append", default=[])
    args = parser.parse_args()
    try:
        inventory = normalize(args.wxr, args.source_site, args.post_types.split(","), args.meta_key)
        encoded = json.dumps(inventory, ensure_ascii=False, indent=2) + "\n"
        fd = os.open(args.output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            stream.write(encoded)
        print(json.dumps({"reviewOnly": True, "counts": inventory["counts"]}))
    except (ValueError, OSError, ET.ParseError) as error:
        print(f"Inventory failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
