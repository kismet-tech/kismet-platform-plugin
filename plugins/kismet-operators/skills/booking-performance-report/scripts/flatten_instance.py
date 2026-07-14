#!/usr/bin/env python3
"""Flatten a rendered report instance into ONE self-contained HTML file — the
artifact `publish_report` sends to the platform (SKILL.md step 7).

Usage: python3 flatten_instance.py <instance_dir> [output.html]
       (default output: <instance_dir>/report.html)

What it does (using the dc-runtime's own single-file mechanisms):
  - inlines the stylesheet <link>s (resolving relative url() assets to data URIs
    when the files exist; already-data: URLs pass through),
  - inlines support.js and the design-system bundle as classic scripts,
  - converts the report-data.js ES-module tag into an inline classic script
    (the template's loader falls back to window.ReportData by design),
  - embeds doc-page.js / image-slot.js / *.dc.html components as
    window.__resourceBlobs entries, which the runtime checks before fetching,
  - sets window.__resources = {} to suppress the runtime's self-refetch.

Remote references stay remote on purpose: hero/logo images and the React CDN
load over https when the hosted page is viewed. The output renders from any
origin — platform hosting, file://, or a chat client's HTML preview.
"""
import base64
import json
import os
import re
import sys

BLOB_FILES = [  # url key the runtime asks for -> (path, mime)
    ("./doc-page.js", "doc-page.js", "text/javascript"),
    ("./image-slot.js", "image-slot.js", "text/javascript"),
    ("./StatCallout.dc.html", "StatCallout.dc.html", "text/html"),
    ("./TrendBox.dc.html", "TrendBox.dc.html", "text/html"),
]


def die(msg):
    sys.exit(f"flatten_instance: {msg}")


def inline_css(css_path):
    css = open(css_path, encoding="utf-8").read()
    base = os.path.dirname(css_path)

    def swap(m):
        quote, ref = m.group(1), m.group(2)
        if ref.startswith(("data:", "http:", "https:", "#")):
            return m.group(0)
        target = os.path.normpath(os.path.join(base, ref))
        if not os.path.exists(target):
            return m.group(0)  # already-404 asset; behavior unchanged
        ext = target.rsplit(".", 1)[-1].lower()
        mime = {"svg": "image/svg+xml", "png": "image/png", "jpg": "image/jpeg",
                "jpeg": "image/jpeg", "webp": "image/webp",
                "woff2": "font/woff2", "woff": "font/woff"}.get(ext, "application/octet-stream")
        b64 = base64.b64encode(open(target, "rb").read()).decode()
        return f"url({quote}data:{mime};base64,{b64}{quote})"

    return re.sub(r"url\((['\"]?)([^)'\"]+)\1\)", swap, css)


def main():
    if len(sys.argv) not in (2, 3):
        die("usage: flatten_instance.py <instance_dir> [output.html]")
    inst = os.path.abspath(sys.argv[1])
    out_path = sys.argv[2] if len(sys.argv) == 3 else os.path.join(inst, "report.html")
    html_path = os.path.join(inst, "Booking Report.dc.html")
    if not os.path.exists(html_path):
        die(f"no 'Booking Report.dc.html' in {inst}")
    html = open(html_path, encoding="utf-8").read()

    # 1. stylesheets -> inline <style> (helmet hoists them identically)
    def swap_link(m):
        href = m.group(1)
        path = os.path.normpath(os.path.join(inst, href))
        if not os.path.exists(path):
            die(f"stylesheet not found: {href}")
        return "<style>\n" + inline_css(path) + "\n</style>"
    html, n_css = re.subn(r'<link rel="stylesheet" href="([^"]+)">', swap_link, html)
    if n_css < 1:
        die("no stylesheet links found — is this a rendered instance?")

    # 2. classic script tags -> inline (support.js + design-system bundle)
    def swap_script(m):
        src = m.group(1)
        path = os.path.normpath(os.path.join(inst, src))
        if not os.path.exists(path):
            die(f"script not found: {src}")
        return "<script>\n" + open(path, encoding="utf-8").read() + "\n</script>"
    html, n_js = re.subn(r'<script src="([^"]+)"></script>', swap_script, html)

    # 3. report-data.js module -> inline classic script (window.ReportData fallback)
    data_path = os.path.join(inst, "report-data.js")
    if not os.path.exists(data_path):
        die("no report-data.js in the instance")
    data_js = open(data_path, encoding="utf-8").read().replace("export const data", "const data", 1)
    html, n_mod = re.subn(r'<script src="report-data\.js" type="module"></script>',
                          "<script>\n" + data_js + "\n</script>", html)
    if n_mod != 1:
        die("report-data.js module tag not found")

    # 4. runtime resource blobs for everything the dc-runtime fetches at run time
    entries = []
    for key, fname, mime in BLOB_FILES:
        path = os.path.join(inst, fname)
        if not os.path.exists(path):
            die(f"component file missing from instance: {fname}")
        b64 = base64.b64encode(open(path, "rb").read()).decode()
        entries.append(f'  {json.dumps(key)}: mk({json.dumps(b64)}, {json.dumps(mime)})')
    bootstrap = (
        "<script>\n"
        "window.__resources = {};  // suppress the runtime's self-refetch\n"
        "var mk = function (b64, type) {\n"
        "  var bin = atob(b64), bytes = new Uint8Array(bin.length);\n"
        "  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);\n"
        "  return new Blob([bytes], { type: type });\n"
        "};\n"
        "window.__resourceBlobs = {\n" + ",\n".join(entries) + "\n};\n"
        "</script>\n"
    )
    # bootstrap must run before the (now inline) runtime executes
    html, n_boot = re.subn(r"<head>\n", "<head>\n" + bootstrap, html, count=1)
    if n_boot != 1:
        die("could not insert bootstrap after <head>")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    size = os.path.getsize(out_path)
    print(f"wrote {out_path} ({size // 1024} KB, {n_css} stylesheets + {n_js} scripts inlined, "
          f"{len(BLOB_FILES)} runtime blobs)")
    print("self-contained except remote images and the React CDN (intentional — "
          "the hosted page loads them over https). Verify by opening the file directly.")


if __name__ == "__main__":
    main()
