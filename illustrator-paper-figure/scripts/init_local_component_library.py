#!/usr/bin/env python3
"""Scaffold an optional project-local Illustrator figure component library."""

from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path


def slugify(value: str) -> str:
    out = []
    last_dash = False
    for char in value.lower():
        if char.isalnum():
            out.append(char)
            last_dash = False
        elif not last_dash:
            out.append("-")
            last_dash = True
    return "".join(out).strip("-") or "components"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project_dir", type=Path, help="Project or figure folder where the local library should live.")
    parser.add_argument("--domain", default="technical-figure", help="Short domain name, e.g. internal-combustion-engine.")
    parser.add_argument("--name", default="", help="Optional library folder name. Defaults to <domain>-components.")
    parser.add_argument("--force", action="store_true", help="Allow using an existing library folder.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    project_dir = args.project_dir.resolve()
    project_dir.mkdir(parents=True, exist_ok=True)

    domain = slugify(args.domain)
    lib_name = slugify(args.name) if args.name else f"{domain}-components"
    root = project_dir / "figure_components" / lib_name

    if root.exists() and any(root.iterdir()) and not args.force:
        print(f"error: component library already exists and is not empty: {root}")
        print("rerun with --force to reuse it")
        return 1

    folders = {
        "prompts": "prompts and visual-direction notes",
        "source_rasters": "generated/source/reference raster images",
        "cleaned_rasters": "cropped/background-cleaned rasters",
        "traced_svg": "local traces or simplified SVG redraws",
        "ai_components": "editable AI component masters",
        "exports": "PDF/PNG previews of reusable components",
    }
    for folder in folders:
        (root / folder).mkdir(parents=True, exist_ok=True)

    manifest = {
        "name": lib_name,
        "domain": domain,
        "created": datetime.now().isoformat(timespec="seconds"),
        "purpose": "Project-local reusable components for Illustrator paper figures.",
        "policy": [
            "Keep this local to the project; do not treat it as a universal domain library.",
            "Store prompts/source references separately from cleaned/redrawn components.",
            "Prefer editable AI/SVG components for final manuscript use.",
            "Record provenance and manual edits in the components list.",
        ],
        "folders": folders,
        "components": [],
    }
    manifest_path = root / "component_manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"created local component library: {root}")
    print(f"manifest: {manifest_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
