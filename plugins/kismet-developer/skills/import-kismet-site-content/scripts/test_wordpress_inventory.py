import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from wordpress_inventory import normalize


def post(post_id, kind="page", status="publish", body="<p>Public copy</p>", meta="", extra=""):
    return f"""<item><title>Page {post_id}</title><link>https://source.example/page-{post_id}/</link>
    <wp:post_id>{post_id}</wp:post_id><wp:post_type>{kind}</wp:post_type><wp:status>{status}</wp:status>
    <wp:post_name>page-{post_id}</wp:post_name><wp:post_parent>0</wp:post_parent>
    <content:encoded><![CDATA[{body}]]></content:encoded>{meta}{extra}</item>"""


def meta(key, value):
    return f"<wp:postmeta><wp:meta_key>{key}</wp:meta_key><wp:meta_value><![CDATA[{value}]]></wp:meta_value></wp:postmeta>"


def wxr(items):
    return f"""<?xml version="1.0" encoding="UTF-8"?><rss xmlns:wp="http://wordpress.org/export/1.2/"
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>
    <wp:wxr_version>1.2</wp:wxr_version><wp:base_blog_url>https://source.example</wp:base_blog_url>
    <wp:author><wp:author_email>private-author@example.invalid</wp:author_email></wp:author>
    {items}</channel></rss>"""


class InventoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = Path(self.temp.name) / "source.xml"

    def run_inventory(self, items, **kwargs):
        self.path.write_text(wxr(items), encoding="utf-8")
        return normalize([self.path], "https://source.example", **kwargs)

    def test_excludes_private_protected_comments_and_unapproved_metadata(self):
        result = self.run_inventory(
            post(1, meta=meta("internal_token", "SECRET-TOKEN"),
                 extra="<wp:comment><wp:comment_content>PRIVATE-COMMENT</wp:comment_content></wp:comment>")
            + post(2, status="private", body="PRIVATE-BODY")
            + post(3, status="draft", body="DRAFT-BODY")
            + post(4, body="PROTECTED-BODY", extra="<wp:post_password>password</wp:post_password>")
            + post(5, kind="shop_order", body="ORDER-BODY"))
        output = json.dumps(result)
        for secret in ("SECRET-TOKEN", "PRIVATE-COMMENT", "PRIVATE-BODY", "DRAFT-BODY",
                       "PROTECTED-BODY", "ORDER-BODY", "private-author@example.invalid"):
            self.assertNotIn(secret, output)
        self.assertEqual(result["counts"]["content"], 1)
        self.assertIn("internal_token", result["content"][0]["unmappedMetaKeys"])

    def test_preserves_source_and_flags_unsupported_content_without_executing(self):
        body = '<!-- wp:paragraph --><p>Hello</p><!-- /wp:paragraph -->[booking_form id="12"]'
        result = self.run_inventory(post(11, body=body, meta=meta("hero_heading", "Hello") + meta("private_key", "omit"),
            extra='<category domain="category" nicename="local">Local</category><wp:post_date_gmt>2026-09-28 12:00:00</wp:post_date_gmt>'),
            meta_keys=["hero_heading"])
        row = result["content"][0]
        self.assertEqual(row["bodyHtml"], body)
        self.assertEqual(row["sourceKey"], "wordpress:https://source.example#11")
        self.assertEqual(row["customFields"], {"hero_heading": ["Hello"]})
        self.assertEqual(row["blockNames"], ["paragraph"])
        self.assertEqual(row["possibleShortcodes"], ["booking_form"])
        self.assertEqual(row["taxonomy"][0]["slug"], "local")
        self.assertTrue(result["reviewOnly"])

    def test_only_referenced_in_scope_media_is_exposed_and_missing_is_explicit(self):
        page = post(1, meta=meta("_thumbnail_id", "12"), body='<img class="wp-image-13"><img class="wp-image-99">')
        image = post(12, "attachment", "inherit", meta=meta("_wp_attachment_image_alt", "View"),
                     extra="<wp:attachment_url>https://source.example/uploads/view.jpg</wp:attachment_url>")
        outside = post(13, "attachment", "inherit").replace("<wp:post_parent>0", "<wp:post_parent>20")
        result = self.run_inventory(page + image + outside + post(14, "attachment", "inherit", body="PRIVATE-ASSET"))
        self.assertEqual([row["sourceId"] for row in result["media"]], ["12"])
        self.assertEqual(result["media"][0]["alt"], "View")
        self.assertEqual(result["content"][0]["unresolvedImageIds"], ["13", "99"])
        self.assertNotIn("PRIVATE-ASSET", json.dumps(result))

    def test_split_export_replay_deduplicates_but_conflicts_fail(self):
        self.path.write_text(wxr(post(1)), encoding="utf-8")
        result = normalize([self.path, self.path], "https://source.example")
        self.assertEqual(result["counts"]["content"], 1)
        self.assertEqual(result["counts"]["duplicateRecords"], 1)
        other = self.path.with_name("other.xml")
        other.write_text(wxr(post(1, body="Changed")), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Conflicting duplicate"):
            normalize([self.path, other], "https://source.example")

    def test_slug_changes_preserve_identity_and_change_hash(self):
        before = self.run_inventory(post(1))["content"][0]
        after = self.run_inventory(post(1).replace("page-1", "new-slug"))["content"][0]
        self.assertEqual(before["sourceKey"], after["sourceKey"])
        self.assertNotEqual(before["sourceSha256"], after["sourceSha256"])

    def test_mixed_public_and_private_snapshots_cannot_resurrect_a_page(self):
        for first, second in (("publish", "private"), ("private", "publish")):
            with self.subTest(first=first), self.assertRaisesRegex(ValueError, "Conflicting record scope"):
                self.run_inventory(post(1, status=first) + post(1, status=second))

    def test_rejects_wrong_site_entities_and_dependency_types(self):
        self.path.write_text(wxr(post(1)), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "differs"):
            normalize([self.path], "https://other.example")
        with self.assertRaisesRegex(ValueError, "Dependencies"):
            normalize([self.path], "https://source.example", post_types=["attachment"])
        self.path.write_text(wxr(post(1)).replace("<rss", '<!DOCTYPE rss [<!ENTITY leak SYSTEM "file:///etc/passwd">]><rss'), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "DTD/entity"):
            normalize([self.path], "https://source.example")

    def test_custom_type_requires_explicit_selection(self):
        result = self.run_inventory(post(1, "local_guide"))
        self.assertEqual(result["counts"]["content"], 0)
        result = self.run_inventory(post(1, "local_guide"), post_types=["local_guide"])
        self.assertEqual(result["counts"]["content"], 1)

    def test_cli_creates_private_output_and_refuses_overwrite(self):
        self.path.write_text(wxr(post(1)), encoding="utf-8")
        output = self.path.with_name("review.json")
        command = [sys.executable, str(Path(__file__).with_name("wordpress_inventory.py")), str(self.path),
                   "--source-site", "https://source.example", "--output", str(output)]
        first = subprocess.run(command, capture_output=True, text=True)
        self.assertEqual(first.returncode, 0, first.stderr)
        self.assertEqual(os.stat(output).st_mode & 0o777, 0o600)
        second = subprocess.run(command, capture_output=True, text=True)
        self.assertEqual(second.returncode, 1)
        self.assertEqual(json.loads(output.read_text())["counts"]["content"], 1)


if __name__ == "__main__":
    unittest.main()
