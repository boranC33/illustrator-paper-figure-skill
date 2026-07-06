#!/usr/bin/env python3
"""Convert a clean raster line-art image into an SVG trace via Potrace."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def load_pillow():
    try:
        from PIL import Image, ImageFilter, ImageOps
    except ImportError as exc:
        raise RuntimeError(
            "Pillow is required. Install it with `python -m pip install pillow` "
            "or use a Python environment that already includes PIL."
        ) from exc
    return Image, ImageFilter, ImageOps


def otsu_threshold(values: list[int]) -> int:
    hist = [0] * 256
    for value in values:
        hist[value] += 1

    total = len(values)
    sum_total = sum(index * count for index, count in enumerate(hist))
    sum_background = 0.0
    weight_background = 0
    best_variance = -1.0
    best_threshold = 127

    for threshold, count in enumerate(hist):
        weight_background += count
        if weight_background == 0:
            continue
        weight_foreground = total - weight_background
        if weight_foreground == 0:
            break

        sum_background += threshold * count
        mean_background = sum_background / weight_background
        mean_foreground = (sum_total - sum_background) / weight_foreground
        variance_between = weight_background * weight_foreground * (mean_background - mean_foreground) ** 2
        if variance_between > best_variance:
            best_variance = variance_between
            best_threshold = threshold

    return best_threshold


def image_values(image) -> list[int]:
    if hasattr(image, "get_flattened_data"):
        return list(image.get_flattened_data())
    return list(image.getdata())


def infer_foreground(gray_image) -> str:
    width, height = gray_image.size
    sample = max(4, min(width, height) // 20)
    boxes = [
        (0, 0, sample, sample),
        (width - sample, 0, width, sample),
        (0, height - sample, sample, height),
        (width - sample, height - sample, width, height),
    ]
    corner_values: list[int] = []
    for box in boxes:
        corner_values.extend(image_values(gray_image.crop(box)))
    corner_mean = sum(corner_values) / len(corner_values)
    return "light" if corner_mean < 128 else "dark"


def threshold_to_pbm(
    input_path: Path,
    pbm_path: Path,
    preview_path: Path | None,
    threshold: int | None,
    foreground: str,
    max_size: int | None,
    median_filter: int,
    autocontrast: bool,
) -> tuple[int, str]:
    Image, ImageFilter, ImageOps = load_pillow()
    image = Image.open(input_path)
    gray = image.convert("L")

    if max_size and max(gray.size) > max_size:
        gray.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    if autocontrast:
        gray = ImageOps.autocontrast(gray)
    if median_filter > 1:
        if median_filter % 2 == 0:
            median_filter += 1
        gray = gray.filter(ImageFilter.MedianFilter(size=median_filter))

    values = image_values(gray)
    resolved_threshold = threshold if threshold is not None else otsu_threshold(values)
    resolved_foreground = infer_foreground(gray) if foreground == "auto" else foreground

    if resolved_foreground == "dark":
        mask = gray.point(lambda value: 0 if value <= resolved_threshold else 255, mode="1")
    else:
        mask = gray.point(lambda value: 0 if value >= resolved_threshold else 255, mode="1")

    mask.save(pbm_path)
    if preview_path:
        mask.convert("L").save(preview_path)
    return resolved_threshold, resolved_foreground


def run_potrace(
    pbm_path: Path,
    output_svg: Path,
    turdsize: int,
    alphamax: float,
    opttolerance: float,
) -> None:
    potrace = find_potrace()
    if not potrace:
        raise RuntimeError(
            "Potrace was not found on PATH. Install Potrace, then rerun this script. "
            "Rerun with --preview-png or --keep-pbm if you want an intermediate manual tracing guide."
        )

    output_svg.parent.mkdir(parents=True, exist_ok=True)
    command = [
        potrace,
        str(pbm_path),
        "-s",
        "-o",
        str(output_svg),
        "-t",
        str(turdsize),
        "-a",
        str(alphamax),
        "-O",
        str(opttolerance),
    ]
    subprocess.run(command, check=True)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_image", type=Path, help="Clean raster sketch/component image.")
    parser.add_argument("output_svg", type=Path, help="Output SVG path.")
    parser.add_argument("--threshold", type=int, choices=range(0, 256), metavar="0-255", help="Manual threshold. Defaults to Otsu.")
    parser.add_argument("--foreground", choices=("auto", "dark", "light"), default="auto", help="Foreground line color. Defaults to auto.")
    parser.add_argument("--max-size", type=int, default=2400, help="Resize largest dimension before tracing. Use 0 to disable.")
    parser.add_argument("--median-filter", type=int, default=0, help="Optional median filter size for speckle cleanup.")
    parser.add_argument("--no-autocontrast", action="store_true", help="Disable grayscale autocontrast before thresholding.")
    parser.add_argument("--preview-png", type=Path, help="Save the thresholded black/white preview PNG.")
    parser.add_argument("--keep-pbm", type=Path, help="Save the intermediate PBM used by Potrace.")
    parser.add_argument("--turdsize", type=int, default=8, help="Potrace speckle suppression size.")
    parser.add_argument("--alphamax", type=float, default=1.0, help="Potrace corner smoothing parameter.")
    parser.add_argument("--opttolerance", type=float, default=0.2, help="Potrace curve optimization tolerance.")
    return parser.parse_args(argv)


def find_potrace() -> str | None:
    found = shutil.which("potrace")
    if found:
        return found

    local_app_data = os.environ.get("LOCALAPPDATA")
    if local_app_data:
        install_root = Path(local_app_data) / "Programs" / "Potrace"
        if install_root.exists():
            candidates = sorted(install_root.glob("**/potrace.exe"), reverse=True)
            if candidates:
                return str(candidates[0])

    return None


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    input_image = args.input_image.resolve()
    output_svg = args.output_svg.resolve()
    if not input_image.exists():
        print(f"error: input image not found: {input_image}", file=sys.stderr)
        return 2

    max_size = None if args.max_size == 0 else args.max_size
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            pbm_path = args.keep_pbm.resolve() if args.keep_pbm else Path(tmpdir) / "trace_input.pbm"
            if args.keep_pbm:
                pbm_path.parent.mkdir(parents=True, exist_ok=True)

            threshold, foreground = threshold_to_pbm(
                input_image,
                pbm_path,
                args.preview_png.resolve() if args.preview_png else None,
                args.threshold,
                args.foreground,
                max_size,
                args.median_filter,
                not args.no_autocontrast,
            )
            run_potrace(pbm_path, output_svg, args.turdsize, args.alphamax, args.opttolerance)

        print(f"wrote: {output_svg}")
        print(f"threshold: {threshold}; foreground: {foreground}")
        return 0
    except subprocess.CalledProcessError as exc:
        print(f"error: potrace failed with exit code {exc.returncode}", file=sys.stderr)
        return exc.returncode or 1
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
