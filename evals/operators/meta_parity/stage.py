"""Stage the cross-repo replay in a disposable platform checkout with installed dependencies."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from sandbox import DOCUMENTS, SKILLS

PLATFORM = "0ad04d6424d9192b3ae25a4a5b0bcd77f2c4ef8c"
INFRA = "c60c009854a4b7504176104c508b7249f5742126"


def stage(platform, infra):
    head = subprocess.check_output(["git", "-C", platform, "rev-parse", "HEAD"], text=True).strip()
    if head != PLATFORM:
        raise ValueError(f"Use a disposable platform checkout at {PLATFORM}")
    target = platform / "operator-meta-parity"
    target.mkdir()
    upstream = target / "upstream"
    upstream.mkdir()

    def source(name):
        return subprocess.check_output(["git", "-C", infra, "show", f"{INFRA}:api/hotels-api-ts/src/{name}"])

    for name in ("contracts.ts", "discovery.ts", "dispatch.ts"):
        (upstream / name).write_bytes(source("compact-mcp/" + name))
    prefix = "tests/operations-golden/__goldens__/"
    listed = {t["name"] for t in json.loads(source(prefix + "user-mcp-tools-list.json"))["tools"]}
    definitions = json.loads(source(prefix + "user-mcp-tool-definitions.json"))
    actions = [t for t in definitions if t["name"] in listed]
    if {t["name"] for t in actions} != listed:
        raise ValueError("Incomplete operator catalog")
    (upstream / "actions.json").write_text(json.dumps(actions))
    (target / "skills.json").write_text(json.dumps({"docs": DOCUMENTS, "index":
        "\n".join(f"{name}/SKILL.md: {desc}" for name,desc in SKILLS.items())}))
    for filename in ("cases.json", "replay.test.ts"):
        shutil.copyfile(HERE / filename, target / filename)
    print(f"Staged {len(actions)} operation definitions in {target}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("platform", type=Path)
    parser.add_argument("infra", type=Path)
    args = parser.parse_args()
    stage(args.platform, args.infra)
