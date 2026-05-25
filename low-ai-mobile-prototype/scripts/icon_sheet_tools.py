#!/usr/bin/env python3
import argparse
import csv
import json
import os
import sys

try:
    from PIL import Image
except Exception:  # pragma: no cover
    Image = None


def require_pillow():
    if Image is None:
        print("Pillow is required for this command. Install with: python3 -m pip install Pillow", file=sys.stderr)
        sys.exit(2)


def is_dark(pixel, threshold):
    if len(pixel) == 4 and pixel[3] == 0:
        return False
    r, g, b = pixel[:3]
    return (r + g + b) / 3 < threshold


def binary_image(img, threshold):
    src = img.convert("RGBA")
    out = Image.new("RGBA", src.size, (255, 255, 255, 0))
    pix = src.load()
    opix = out.load()
    for y in range(src.height):
        for x in range(src.width):
            if is_dark(pix[x, y], threshold):
                opix[x, y] = (0, 0, 0, 255)
    return out


def ink_bbox(img, threshold):
    src = img.convert("RGBA")
    pix = src.load()
    xs = []
    ys = []
    for y in range(src.height):
        for x in range(src.width):
            if is_dark(pix[x, y], threshold):
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return (min(xs), min(ys), max(xs) + 1, max(ys) + 1)


def expand_bbox(bbox, padding, width, height):
    l, t, r, b = bbox
    return (max(0, l - padding), max(0, t - padding), min(width, r + padding), min(height, b + padding))


def cmd_clean(args):
    require_pillow()
    img = Image.open(args.input)
    out = binary_image(img, args.threshold)
    out.save(args.output)
    print(json.dumps({"output": args.output, "width": out.width, "height": out.height}, ensure_ascii=False, indent=2))


def cmd_slice(args):
    require_pillow()
    img = Image.open(args.input).convert("RGBA")
    os.makedirs(args.output_dir, exist_ok=True)
    cell_w = img.width // args.cols
    cell_h = img.height // args.rows
    outputs = []
    index = 1
    for row in range(args.rows):
        for col in range(args.cols):
            crop = img.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h))
            if args.trim:
                bbox = ink_bbox(crop, args.threshold)
                if bbox:
                    crop = crop.crop(expand_bbox(bbox, args.padding, crop.width, crop.height))
            name = f"{args.prefix}-{index:02d}.png"
            out = os.path.join(args.output_dir, name)
            crop.save(out)
            outputs.append(out)
            index += 1
    print(json.dumps({"count": len(outputs), "outputs": outputs}, ensure_ascii=False, indent=2))


def cmd_csv(args):
    require_pillow()
    img = Image.open(args.input).convert("RGBA")
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    rows = []
    pix = img.load()
    for y in range(img.height):
        row = []
        for x in range(img.width):
            row.append("1" if is_dark(pix[x, y], args.threshold) else "0")
        rows.append(row)
    with open(args.output, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    if args.preview:
        preview = binary_image(img, args.threshold)
        os.makedirs(os.path.dirname(os.path.abspath(args.preview)), exist_ok=True)
        preview.save(args.preview)
    print(json.dumps({"output": args.output, "width": img.width, "height": img.height, "preview": args.preview}, ensure_ascii=False, indent=2))


def cmd_diff(args):
    require_pillow()
    a = binary_image(Image.open(args.a), args.threshold)
    b = binary_image(Image.open(args.b), args.threshold)
    if a.size != b.size:
        b = b.resize(a.size, Image.Resampling.NEAREST)
    ap = a.load()
    bp = b.load()
    total = a.width * a.height
    diff = 0
    for y in range(a.height):
        for x in range(a.width):
            av = ap[x, y][3] > 0
            bv = bp[x, y][3] > 0
            if av != bv:
                diff += 1
    ratio = diff / total if total else 1
    result = {"width": a.width, "height": a.height, "differentPixels": diff, "totalPixels": total, "diffRatio": ratio, "limit": args.limit}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if ratio > args.limit:
        sys.exit(1)


def svg_escape_attr(value):
    return value.replace("&", "&amp;").replace('"', "&quot;")


def cmd_svg_mask(args):
    require_pillow()
    img = Image.open(args.input).convert("RGBA")
    bbox = ink_bbox(img, args.threshold) if args.trim else None
    if bbox:
        img = img.crop(expand_bbox(bbox, args.padding, img.width, img.height))
    pix = img.load()
    rects = []
    for y in range(img.height):
        x = 0
        while x < img.width:
            if not is_dark(pix[x, y], args.threshold):
                x += 1
                continue
            start = x
            while x < img.width and is_dark(pix[x, y], args.threshold):
                x += 1
            rects.append(f'<rect x="{start}" y="{y}" width="{x - start}" height="1"/>')
    body = "\n  ".join(rects)
    title = svg_escape_attr(args.title or os.path.splitext(os.path.basename(args.output))[0])
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {img.width} {img.height}" aria-hidden="true">
  <title>{title}</title>
  <g fill="currentColor">
  {body}
  </g>
</svg>
'''
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    with open(args.output, "w", encoding="utf8") as f:
        f.write(svg)
    print(json.dumps({"output": args.output, "width": img.width, "height": img.height, "rects": len(rects)}, ensure_ascii=False, indent=2))


def build_parser():
    parser = argparse.ArgumentParser(description="Utilities for image-model 3x3 icon target workflows.")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("clean", help="threshold an image into a transparent black/white icon target")
    p.add_argument("input")
    p.add_argument("output")
    p.add_argument("--threshold", type=int, default=180)
    p.set_defaults(func=cmd_clean)

    p = sub.add_parser("slice", help="slice an icon sheet into individual PNG cells")
    p.add_argument("input")
    p.add_argument("output_dir")
    p.add_argument("--rows", type=int, default=3)
    p.add_argument("--cols", type=int, default=3)
    p.add_argument("--prefix", default="icon")
    p.add_argument("--trim", action="store_true")
    p.add_argument("--padding", type=int, default=0)
    p.add_argument("--threshold", type=int, default=180)
    p.set_defaults(func=cmd_slice)

    p = sub.add_parser("csv", help="write a binary CSV mask and optional PNG preview")
    p.add_argument("input")
    p.add_argument("output")
    p.add_argument("--preview")
    p.add_argument("--threshold", type=int, default=180)
    p.set_defaults(func=cmd_csv)

    p = sub.add_parser("diff", help="compare two binary icon targets")
    p.add_argument("a")
    p.add_argument("b")
    p.add_argument("--threshold", type=int, default=180)
    p.add_argument("--limit", type=float, default=0.05)
    p.set_defaults(func=cmd_diff)

    p = sub.add_parser("svg-mask", help="convert a binary target into a currentColor SVG made of rect runs")
    p.add_argument("input")
    p.add_argument("output")
    p.add_argument("--threshold", type=int, default=180)
    p.add_argument("--trim", action="store_true", default=True)
    p.add_argument("--no-trim", action="store_false", dest="trim")
    p.add_argument("--padding", type=int, default=2)
    p.add_argument("--title")
    p.set_defaults(func=cmd_svg_mask)

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()

