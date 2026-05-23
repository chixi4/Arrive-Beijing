#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops, ImageStat


ROOT = Path(__file__).resolve().parents[1]
REF_ROOT = ROOT / "assets" / "style-anchors" / "variants" / "18x9"
OUT_ROOT = ROOT / "artifacts" / "style-anchor-check"
CHROME = (
    os.environ.get("CHROME_BIN")
    or "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
)


@dataclass(frozen=True)
class RouteSpec:
    route: str
    ref: str


ROUTES = [
    RouteSpec("#/style-anchor/02-list", "02-list.png"),
    RouteSpec("#/style-anchor/03-detail", "03-detail.png"),
    RouteSpec("#/style-anchor/04-form", "04-form.png"),
    RouteSpec("#/style-anchor/05-completion", "05-completion.png"),
    RouteSpec("#/style-anchor/06-loading", "06-loading.png"),
    RouteSpec("#/style-anchor/07-profile", "07-profile.png"),
    RouteSpec("#/style-anchor/08-modal", "08-modal.png"),
]


def capture(route: RouteSpec) -> Path:
    ref_path = REF_ROOT / route.ref
    with Image.open(ref_path) as ref_img:
        width, height = ref_img.size

    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    out_path = OUT_ROOT / route.ref
    url = f"http://127.0.0.1:4173/{route.route}"

    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        f"--window-size={width},{height}",
        f"--screenshot={out_path}",
        "--virtual-time-budget=2500",
        url,
    ]
    env = os.environ.copy()
    env.setdefault("TZ", "Asia/Shanghai")
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env)
    return out_path


def diff_images(rendered: Path, reference: Path) -> dict:
    with Image.open(rendered).convert("RGBA") as rendered_img, Image.open(reference).convert("RGBA") as reference_img:
        ref_w, ref_h = reference_img.size
        if rendered_img.size != reference_img.size:
            rendered_img = rendered_img.resize((ref_w, ref_h), Image.Resampling.LANCZOS)

        diff = ImageChops.difference(rendered_img, reference_img)
        stat = ImageStat.Stat(diff)
        mean_abs = sum(stat.mean[:3]) / 3.0
        mae_pct = mean_abs / 255.0 * 100.0

        # Count pixels whose average channel delta crosses a perceptual threshold.
        pixels = list(diff.getdata())
        changed = 0
        for px in pixels:
            if (px[0] + px[1] + px[2]) / 3.0 > 18:
                changed += 1
        changed_pct = changed / (ref_w * ref_h) * 100.0

        # Build a simple red heatmap to inspect gross mismatch regions.
        heat = Image.new("RGBA", (ref_w, ref_h), (0, 0, 0, 0))
        heat_pixels = []
        for px in pixels:
            d = int(min(255, ((px[0] + px[1] + px[2]) / 3.0) * 3.0))
            heat_pixels.append((255, 0, 0, min(200, d)))
        heat.putdata(heat_pixels)
        overlay = Image.alpha_composite(reference_img, heat)

        return {
            "size": [ref_w, ref_h],
            "mae_pct": round(mae_pct, 4),
            "changed_pct": round(changed_pct, 4),
            "diff_path": None,
            "overlay_path": overlay,
        }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-capture", action="store_true")
    args = parser.parse_args()

    if not args.skip_capture:
      if not shutil.which(CHROME) and not Path(CHROME).exists():
            print(f"Chrome not found at {CHROME}", file=sys.stderr)
            return 2

    report = {"routes": []}
    OUT_ROOT.mkdir(parents=True, exist_ok=True)

    for spec in ROUTES:
        ref_path = REF_ROOT / spec.ref
        rendered_path = OUT_ROOT / spec.ref
        if not args.skip_capture:
            capture(spec)

        with Image.open(ref_path) as ref_img:
            ref_w, ref_h = ref_img.size

        diff_data = diff_images(rendered_path, ref_path)
        overlay_path = OUT_ROOT / f"{Path(spec.ref).stem}-overlay.png"
        diff_data["overlay_path"] = str(overlay_path.relative_to(ROOT))
        with Image.open(rendered_path).convert("RGBA") as rendered_img, Image.open(ref_path).convert("RGBA") as reference_img:
            if rendered_img.size != reference_img.size:
                rendered_img = rendered_img.resize(reference_img.size, Image.Resampling.LANCZOS)
            diff = ImageChops.difference(rendered_img, reference_img)
            heat = Image.new("RGBA", reference_img.size, (0, 0, 0, 0))
            heat.putdata([
                (255, 0, 0, min(200, int(((px[0] + px[1] + px[2]) / 3.0) * 3.0)))
                for px in diff.getdata()
            ])
            Image.alpha_composite(reference_img, heat).save(overlay_path)

        diff_data["rendered_path"] = str(rendered_path.relative_to(ROOT))
        diff_data["reference_path"] = str(ref_path.relative_to(ROOT))
        diff_data["route"] = spec.route
        diff_data["ref"] = spec.ref
        report["routes"].append(diff_data)

    report_path = OUT_ROOT / "report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(report_path)
    for route in report["routes"]:
        print(
            f'{route["ref"]}: mae={route["mae_pct"]:.2f}% changed={route["changed_pct"]:.2f}%'
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
