#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from PIL import Image, ImageChops


def ensure_names(raw: str) -> list[str]:
    names = [item.strip() for item in raw.split(",") if item.strip()]
    if len(names) != 9:
        raise SystemExit("--names must contain exactly 9 comma-separated icon names")
    return names


def cell_box(width: int, height: int, index: int) -> tuple[int, int, int, int]:
    col = index % 3
    row = index // 3
    x0 = round(col * width / 3)
    x1 = round((col + 1) * width / 3)
    y0 = round(row * height / 3)
    y1 = round((row + 1) * height / 3)
    return x0, y0, x1, y1


def luminance_to_alpha(pixel: tuple[int, int, int, int]) -> int:
    r, g, b, a = pixel
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    ink = max(0, min(255, round((255 - lum) * (a / 255))))
    return ink


def write_alpha_csv(image: Image.Image, out_path: Path) -> None:
    rgba = image.convert("RGBA")
    with out_path.open("w", newline="") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        for y in range(rgba.height):
            row = [luminance_to_alpha(rgba.getpixel((x, y))) for x in range(rgba.width)]
            writer.writerow(row)


def render_alpha_csv(csv_path: Path, out_path: Path, ink: tuple[int, int, int] = (0, 0, 0)) -> None:
    rows: list[list[int]] = []
    with csv_path.open(newline="") as handle:
        for row in csv.reader(handle):
            rows.append([max(0, min(255, int(value))) for value in row])
    if not rows or not rows[0]:
        raise SystemExit(f"Empty CSV: {csv_path}")
    width = len(rows[0])
    height = len(rows)
    img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    for y, row in enumerate(rows):
        if len(row) != width:
            raise SystemExit(f"Jagged CSV row in {csv_path} at line {y + 1}")
        for x, alpha in enumerate(row):
            if alpha:
                r, g, b = ink
                img.putpixel((x, y), (r, g, b, alpha))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)


def compare_images(expected: Path, actual: Path, diff_path: Path | None = None) -> dict:
    with Image.open(expected).convert("RGBA") as exp, Image.open(actual).convert("RGBA") as act:
        if exp.size != act.size:
            act = act.resize(exp.size, Image.Resampling.LANCZOS)
        diff = ImageChops.difference(exp, act)
        if diff_path:
            diff_path.parent.mkdir(parents=True, exist_ok=True)
            diff.save(diff_path)
        pixels = list(diff.getdata())
        changed = 0
        for r, g, b, a in pixels:
            if (r + g + b + a) / 4 > 12:
                changed += 1
        total = exp.width * exp.height
        return {
            "expected": str(expected),
            "actual": str(actual),
            "width": exp.width,
            "height": exp.height,
            "diffPixels": changed,
            "totalPixels": total,
            "diffRatio": round(changed / total, 6),
            "pass": changed / total <= 0.05,
        }


def extract(args: argparse.Namespace) -> None:
    names = ensure_names(args.names)
    out = Path(args.out)
    cells_dir = out / "cells"
    csv_dir = out / "csv"
    sim_dir = out / "simulated"
    cells_dir.mkdir(parents=True, exist_ok=True)
    csv_dir.mkdir(parents=True, exist_ok=True)
    sim_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(args.input).convert("RGBA") as board:
        board.save(out / "source-board.png")
        manifest = []
        for index, name in enumerate(names):
            cell = board.crop(cell_box(board.width, board.height, index))
            cell_path = cells_dir / f"{index + 1:02d}-{name}.png"
            csv_path = csv_dir / f"{index + 1:02d}-{name}.csv"
            sim_path = sim_dir / f"{index + 1:02d}-{name}.png"
            cell.save(cell_path)
            write_alpha_csv(cell, csv_path)
            render_alpha_csv(csv_path, sim_path)
            result = compare_images(cell_path, sim_path, out / "diff" / f"{index + 1:02d}-{name}.png")
            manifest.append({"name": name, "cell": str(cell_path), "csv": str(csv_path), "simulated": str(sim_path), **result})

    summary = {
        "source": str(args.input),
        "out": str(out),
        "threshold": 0.05,
        "pass": all(item["pass"] for item in manifest),
        "icons": manifest,
    }
    (out / "manifest.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"pass": summary["pass"], "maxDiffRatio": max(item["diffRatio"] for item in manifest)}, ensure_ascii=False, indent=2))


def compare(args: argparse.Namespace) -> None:
    result = compare_images(Path(args.expected), Path(args.actual), Path(args.diff) if args.diff else None)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if not result["pass"]:
        raise SystemExit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract and compare 3x3 icon calibration boards.")
    sub = parser.add_subparsers(dest="command", required=True)

    extract_parser = sub.add_parser("extract", help="Slice a 3x3 board, write alpha CSVs, and compare CSV simulations.")
    extract_parser.add_argument("--input", required=True, help="Path to a generated 1:1 3x3 icon board PNG.")
    extract_parser.add_argument("--out", required=True, help="Output directory.")
    extract_parser.add_argument("--names", required=True, help="Exactly 9 comma-separated icon names in reading order.")
    extract_parser.set_defaults(func=extract)

    compare_parser = sub.add_parser("compare", help="Compare two same-size PNGs.")
    compare_parser.add_argument("--expected", required=True)
    compare_parser.add_argument("--actual", required=True)
    compare_parser.add_argument("--diff", default="")
    compare_parser.set_defaults(func=compare)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
