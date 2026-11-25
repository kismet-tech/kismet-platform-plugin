"""Check the public plugin's OAuth challenge without a browser, login, or credentials."""
import argparse
import json
import re
import sys
from pathlib import Path
import subprocess
import tempfile
from email.parser import Parser
from urllib.parse import urlsplit

PACKAGE = Path(__file__).resolve().parents[2] / "plugins" / "kismet-operators"
ALLOWED = {"https://mcp.kismet.travel", "https://kismet.travel"}


def verify(endpoint, request):
    parsed = urlsplit(endpoint)
    if f"{parsed.scheme}://{parsed.netloc}" not in ALLOWED or parsed.path != "/user-mcp" or parsed.query or parsed.fragment:
        raise ValueError("Unexpected Operator endpoint")
    status, headers, _ = request(endpoint, json.dumps({"jsonrpc":"2.0", "id":1, "method":"tools/list"}).encode())
    match = re.search(r'resource_metadata="([^"]+)"', headers.get("WWW-Authenticate", ""), re.I)
    if status != 401 or not match:
        raise ValueError("Expected a 401 with OAuth resource_metadata")
    location = match[1]
    if location not in {origin + "/.well-known/oauth-protected-resource/user-mcp" for origin in ALLOWED}:
        raise ValueError("Unexpected OAuth resource metadata URL")
    status, _, raw = request(location, None)
    if status != 200:
        raise ValueError("Resource metadata is unavailable")
    metadata = json.loads(raw)
    if metadata.get("resource") != endpoint:
        raise ValueError(f"Install points to {endpoint}, challenge identifies {metadata.get('resource')}")
    if "https://kismet.travel" not in metadata.get("authorization_servers", []):
        raise ValueError("Missing Kismet authorization server")
    return {"endpoint": endpoint, "metadata": location, "resource": metadata["resource"]}


def fetch(url, payload):
    # Use the normal system curl client and trust store. Disable curlrc and redirects.
    with tempfile.TemporaryDirectory() as directory:
        headers, body = (Path(directory) / n for n in ("headers", "body"))
        command = ["curl", "-q", "--silent", "--show-error", "--max-time", "20", "--proto", "=https",
                   "--dump-header", str(headers), "--output", str(body), "--write-out", "%{http_code}",
                   "--header", "Accept: application/json, text/event-stream"]
        if payload is not None:
            command.extend(["--header", "Content-Type: application/json", "--data-binary", "@-"])
        response = subprocess.run([*command, url], input=payload, capture_output=True, check=True)
        final_headers = headers.read_text().strip().split("\n\n")[-1].split("\n", 1)
        return int(response.stdout), Parser().parsestr(final_headers[-1]), body.read_bytes()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--endpoint", choices=sorted(origin + "/user-mcp" for origin in ALLOWED))
    args = parser.parse_args()
    default = json.loads((PACKAGE / ".mcp.json").read_text())["mcpServers"]["kismet-operators"]["url"]
    try:
        print(json.dumps(verify(args.endpoint or default, fetch)))
    except (ValueError, OSError, subprocess.SubprocessError) as err:
        sys.exit(str(err))
