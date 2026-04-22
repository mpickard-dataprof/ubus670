#!/usr/bin/env python3
"""Build a 10-question sample QTI package for BB Ultra test import."""
import json
import os
import sys
import zipfile
from pathlib import Path

# Reuse the build_qti functions
sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_qti import build_assessment_item, build_manifest

SAMPLE_IDS = {"Q001", "Q033", "Q066", "Q097", "Q123", "Q148", "Q153", "Q180", "Q190", "Q200"}
SCRIPT_DIR = Path(__file__).resolve().parent
IMAGES_DIR = SCRIPT_DIR / "images"
OUTPUT_ZIP = SCRIPT_DIR / "sample-10-questions.zip"

with open(SCRIPT_DIR / "questions.json", "r") as f:
    data = json.load(f)

sample = [q for q in data["questions"] if q["id"] in SAMPLE_IDS]
print(f"Selected {len(sample)} questions:")
for q in sample:
    img = f" [img: {q['image']}]" if q.get("image") else ""
    print(f"  {q['id']} Day {q['day']} ({q['blooms_level']}){img}")

# Collect image files
image_files = []
for q in sample:
    if q.get("image") and q["image"] not in image_files:
        image_files.append(q["image"])

# Build ZIP
with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
    for q in sample:
        xml = build_assessment_item(q)
        zf.writestr(f"items/{q['id'].lower()}.xml", xml)

    for img in image_files:
        img_path = IMAGES_DIR / img
        if img_path.exists():
            zf.write(str(img_path), f"images/{img}")

    manifest = build_manifest(sample, image_files)
    zf.writestr("imsmanifest.xml", manifest)

size_kb = OUTPUT_ZIP.stat().st_size / 1024
print(f"\nSample: {OUTPUT_ZIP.name} ({size_kb:.0f} KB, {len(image_files)} images)")
