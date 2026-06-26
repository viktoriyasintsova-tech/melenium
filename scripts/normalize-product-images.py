#!/usr/bin/env python3
"""Normalize product PNGs to 1280×884 with consistent bottle scale for catalog."""

import sys
from pathlib import Path

from PIL import Image

TARGET_W = 1280
TARGET_H = 884
TARGET_CONTENT_H = int(TARGET_H * 0.74)


def content_fill(path: Path) -> float:
    img = Image.open(path)
    w, h = img.size
    bbox = img.getbbox() or (0, 0, w, h)
    cw, ch = bbox[2] - bbox[0], bbox[3] - bbox[1]
    return (cw * ch) / (w * h)


def normalize(path: Path) -> bool:
    img = Image.open(path).convert("RGBA")
    bbox = img.getbbox()
    if not bbox:
        return False

    img = img.crop(bbox)
    w, h = img.size
    scale = TARGET_CONTENT_H / h
    new_w = max(1, int(w * scale))
    new_h = max(1, int(h * scale))
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    x = (TARGET_W - new_w) // 2
    y = (TARGET_H - new_h) // 2
    canvas.paste(img, (x, y), img)
    canvas.save(path, "PNG", optimize=True)
    return True


def should_normalize(path: Path, normalize_all: bool) -> bool:
    if normalize_all:
        return True
    img = Image.open(path)
    fill = content_fill(path)
    return fill > 0.32 or fill < 0.13 or img.size != (TARGET_W, TARGET_H)


def main() -> int:
    args = [a for a in sys.argv[1:] if a != "--all"]
    normalize_all = "--all" in sys.argv
    root = Path(args[0] if args else "public/assets/products")
    changed = 0

    for slug_dir in sorted(root.iterdir()):
        if not slug_dir.is_dir():
            continue
        path = slug_dir / "1.png"
        if not path.exists():
            continue

        if not should_normalize(path, normalize_all):
            continue

        fill_before = content_fill(path)
        if normalize(path):
            changed += 1
            fill_after = content_fill(path)
            print(f"✓ {slug_dir.name} ({fill_before:.0%} → {fill_after:.0%})")

    print(f"\n{changed} изображений нормализовано", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
