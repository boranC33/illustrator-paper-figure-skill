#!/usr/bin/env python3
"""Preflight LaTeX figure assets for Illustrator manuscript workflows."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path


GRAPHICS_EXTENSIONS = (".pdf", ".eps", ".png", ".jpg", ".jpeg", ".tif", ".tiff")
RASTER_EXTENSIONS = (".png", ".jpg", ".jpeg", ".tif", ".tiff")


@dataclass
class FigureRecord:
    tex_file: str
    raw_path: str
    resolved_path: str | None
    exists: bool
    extension: str | None
    is_raster: bool
    ai_candidates: list[str]
    warnings: list[str]


def strip_tex_comments(text: str) -> str:
    lines: list[str] = []
    for line in text.splitlines():
        escaped = False
        kept: list[str] = []
        for char in line:
            if char == "\\":
                escaped = not escaped
                kept.append(char)
                continue
            if char == "%" and not escaped:
                break
            escaped = False
            kept.append(char)
        lines.append("".join(kept))
    return "\n".join(lines)


def read_text(path: Path) -> str:
    for encoding in ("utf-8", "utf-8-sig", "latin-1"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return path.read_text(errors="replace")


def resolve_tex_child(parent: Path, raw: str) -> Path:
    child = raw.strip()
    if not child:
        return parent
    path = Path(child)
    if path.suffix.lower() != ".tex":
        path = path.with_suffix(".tex")
    if not path.is_absolute():
        path = parent.parent / path
    return path.resolve()


def collect_tex_files(main_tex: Path) -> list[Path]:
    seen: set[Path] = set()
    ordered: list[Path] = []

    def visit(path: Path) -> None:
        path = path.resolve()
        if path in seen or not path.exists():
            return
        seen.add(path)
        ordered.append(path)
        text = strip_tex_comments(read_text(path))
        for match in re.finditer(r"\\(?:input|include)\s*\{([^}]+)\}", text):
            visit(resolve_tex_child(path, match.group(1)))

    visit(main_tex)
    return ordered


def parse_graphics_paths(tex_files: list[Path]) -> list[Path]:
    paths: list[Path] = []
    for tex_file in tex_files:
        text = strip_tex_comments(read_text(tex_file))
        for match in re.finditer(r"\\graphicspath\s*\{((?:\s*\{[^{}]+\})+\s*)\}", text):
            for raw_dir in re.findall(r"\{([^{}]+)\}", match.group(1)):
                directory = Path(raw_dir.strip())
                if not directory.is_absolute():
                    directory = tex_file.parent / directory
                paths.append(directory.resolve())
    return paths


def parse_includegraphics(tex_file: Path) -> list[str]:
    text = strip_tex_comments(read_text(tex_file))
    pattern = re.compile(r"\\includegraphics(?:\s*\[[^\]]*\])?\s*\{([^}]+)\}")
    return [match.group(1).strip() for match in pattern.finditer(text)]


def candidate_paths(raw_path: str, tex_file: Path, graphics_paths: list[Path]) -> list[Path]:
    raw = Path(raw_path)
    roots = [tex_file.parent, *graphics_paths]
    bases: list[Path] = []
    if raw.is_absolute():
        bases.append(raw)
    else:
        bases.extend(root / raw for root in roots)

    candidates: list[Path] = []
    for base in bases:
        if base.suffix:
            candidates.append(base)
        else:
            candidates.extend(base.with_suffix(ext) for ext in GRAPHICS_EXTENSIONS)
    return [path.resolve() for path in candidates]


def find_existing_graphic(raw_path: str, tex_file: Path, graphics_paths: list[Path]) -> Path | None:
    for path in candidate_paths(raw_path, tex_file, graphics_paths):
        if path.exists():
            return path
    return None


def find_ai_candidates(graphic_path: Path | None, raw_path: str, tex_file: Path) -> list[Path]:
    if graphic_path is None:
        probe = tex_file.parent / Path(raw_path)
        directory = probe.parent
        stem = probe.stem
    else:
        directory = graphic_path.parent
        stem = graphic_path.stem
    if not directory.exists():
        return []
    return sorted(directory.glob(f"{stem}*.ai"))


def build_record(raw_path: str, tex_file: Path, graphics_paths: list[Path]) -> FigureRecord:
    graphic = find_existing_graphic(raw_path, tex_file, graphics_paths)
    extension = graphic.suffix.lower() if graphic else Path(raw_path).suffix.lower() or None
    ai_candidates = find_ai_candidates(graphic, raw_path, tex_file)
    warnings: list[str] = []

    if graphic is None:
        warnings.append("missing graphic asset")
    if extension in RASTER_EXTENSIONS:
        warnings.append("raster asset used by LaTeX; confirm resolution and journal requirements")
    if " " in raw_path:
        warnings.append("path contains spaces")
    if graphic and graphic.name.lower().startswith("figure") is False:
        warnings.append("nonstandard final figure name")

    return FigureRecord(
        tex_file=str(tex_file),
        raw_path=raw_path,
        resolved_path=str(graphic) if graphic else None,
        exists=graphic is not None,
        extension=extension,
        is_raster=extension in RASTER_EXTENSIONS if extension else False,
        ai_candidates=[str(path) for path in ai_candidates],
        warnings=warnings,
    )


def print_table(records: list[FigureRecord]) -> None:
    if not records:
        print("No \\includegraphics commands found.")
        return

    width = max(len(record.raw_path) for record in records)
    for index, record in enumerate(records, start=1):
        status = "OK" if record.exists else "MISSING"
        ai_status = f"{len(record.ai_candidates)} ai" if record.ai_candidates else "no ai"
        print(f"{index:02d}. {status:<7} {record.raw_path:<{width}}  {record.extension or '-':<5}  {ai_status}")
        if record.resolved_path:
            print(f"    -> {record.resolved_path}")
        for warning in record.warnings:
            print(f"    warning: {warning}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("main_tex", type=Path, help="Path to the main LaTeX file.")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON.")
    parser.add_argument("--require-ai", action="store_true", help="Fail when a graphic has no companion .ai candidate.")
    parser.add_argument("--fail-on-warnings", action="store_true", help="Return nonzero when warnings are present.")
    args = parser.parse_args(argv)

    main_tex = args.main_tex.resolve()
    if not main_tex.exists():
        print(f"error: LaTeX source not found: {main_tex}", file=sys.stderr)
        return 2

    tex_files = collect_tex_files(main_tex)
    graphics_paths = parse_graphics_paths(tex_files)
    records: list[FigureRecord] = []
    for tex_file in tex_files:
        for raw_path in parse_includegraphics(tex_file):
            records.append(build_record(raw_path, tex_file, graphics_paths))

    if args.json:
        print(json.dumps([asdict(record) for record in records], indent=2))
    else:
        print_table(records)

    has_missing = any(not record.exists for record in records)
    missing_ai = args.require_ai and any(not record.ai_candidates for record in records)
    has_warnings = any(record.warnings for record in records)
    if has_missing or missing_ai or (args.fail_on_warnings and has_warnings):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
