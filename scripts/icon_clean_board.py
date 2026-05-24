#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def clean_board(input_path: Path, output_path: Path, size: int, threshold: int) -> None:
    with Image.open(input_path).convert("RGBA") as source:
        if source.width != source.height:
            side = min(source.width, source.height)
            left = (source.width - side) // 2
            top = (source.height - side) // 2
            source = source.crop((left, top, left + side, top + side))
        if source.width != size:
            source = source.resize((size, size), Image.Resampling.LANCZOS)

        gray = source.convert("L")
        clean = gray.point(lambda value: 0 if value < threshold else 255, mode="1").convert("RGBA")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        clean.save(output_path)


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert generated icon boards into pure black/white calibration targets.")
    parser.add_argument("--input", required=True, help="Generated raw 1:1 icon board.")
    parser.add_argument("--output", required=True, help="Clean black/white output PNG.")
    parser.add_argument("--size", type=int, default=1254, help="Output square size in pixels.")
    parser.add_argument("--threshold", type=int, default=190, help="Luminance below this value becomes black ink.")
    args = parser.parse_args()
    clean_board(Path(args.input), Path(args.output), args.size, args.threshold)


if __name__ == "__main__":
    main()
