#!/usr/bin/env python3
"""Build a QTI 2.1 ZIP package from questions.json for Blackboard Ultra import.

Usage:
    python3 Materials/Final-Exam/build_qti.py

Reads:  Materials/Final-Exam/questions.json
Writes: Materials/Final-Exam/final-exam-pool.zip
"""

import json
import os
import shutil
import sys
import zipfile
from pathlib import Path
from xml.dom.minidom import getDOMImplementation, parseString
from xml.etree.ElementTree import (
    Element,
    SubElement,
    tostring,
)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
QUESTIONS_JSON = SCRIPT_DIR / "questions.json"
IMAGES_DIR = SCRIPT_DIR / "images"
OUTPUT_ZIP = SCRIPT_DIR / "final-exam-pool.zip"


# ---------------------------------------------------------------------------
# XML helpers
# ---------------------------------------------------------------------------
def _pretty_xml(root: Element) -> bytes:
    """Return pretty-printed XML bytes with declaration, 2-space indent."""
    rough = tostring(root, encoding="unicode", xml_declaration=False)
    dom = parseString(rough)
    pretty = dom.toprettyxml(indent="  ", encoding="UTF-8")
    # minidom adds an extra xml declaration; keep it.
    # Remove blank lines minidom sometimes introduces.
    lines = [line for line in pretty.decode("utf-8").splitlines() if line.strip()]
    return "\n".join(lines).encode("utf-8")


# ---------------------------------------------------------------------------
# Build one assessmentItem XML
# ---------------------------------------------------------------------------
def build_assessment_item(question: dict) -> bytes:
    """Create QTI 2.1 assessmentItem XML for a single question."""

    qid = question["id"]
    topic = question.get("topic", "")
    stem = question["stem"]
    options = question["options"]
    image = question.get("image")

    # Determine correct key
    correct_key = None
    for opt in options:
        if opt["correct"]:
            correct_key = opt["key"]
            break
    if correct_key is None:
        raise ValueError(f"Question {qid} has no correct answer marked")

    # Namespaces
    ns = "http://www.imsglobal.org/xsd/imsqti_v2p1"

    root = Element("assessmentItem", xmlns=ns)
    root.set("identifier", qid)
    root.set("title", f"{qid} - {topic}")
    root.set("adaptive", "false")
    root.set("timeDependent", "false")

    # responseDeclaration
    resp_decl = SubElement(root, "responseDeclaration")
    resp_decl.set("identifier", "RESPONSE")
    resp_decl.set("cardinality", "single")
    resp_decl.set("baseType", "identifier")
    correct_resp = SubElement(resp_decl, "correctResponse")
    val = SubElement(correct_resp, "value")
    val.text = correct_key

    # outcomeDeclaration
    outcome_decl = SubElement(root, "outcomeDeclaration")
    outcome_decl.set("identifier", "SCORE")
    outcome_decl.set("cardinality", "single")
    outcome_decl.set("baseType", "float")
    default_val = SubElement(outcome_decl, "defaultValue")
    dv = SubElement(default_val, "value")
    dv.text = "0"

    # itemBody
    item_body = SubElement(root, "itemBody")

    # Stem paragraph
    p_stem = SubElement(item_body, "p")
    p_stem.text = stem

    # Optional image
    if image:
        p_img = SubElement(item_body, "p")
        img_el = SubElement(p_img, "img")
        img_el.set("src", f"images/{image}")
        img_el.set("alt", f"{topic} diagram")

    # choiceInteraction
    choice_interaction = SubElement(item_body, "choiceInteraction")
    choice_interaction.set("responseIdentifier", "RESPONSE")
    choice_interaction.set("shuffle", "true")
    choice_interaction.set("maxChoices", "1")

    for opt in options:
        sc = SubElement(choice_interaction, "simpleChoice")
        sc.set("identifier", opt["key"])
        sc.text = opt["text"]

    # responseProcessing
    rp = SubElement(root, "responseProcessing")
    rp.set(
        "template",
        "http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct",
    )

    return _pretty_xml(root)


# ---------------------------------------------------------------------------
# Build imsmanifest.xml
# ---------------------------------------------------------------------------
def build_manifest(questions: list[dict], image_files: list[str]) -> bytes:
    """Create the IMS Content Package manifest."""

    ns_cp = "http://www.imsglobal.org/xsd/imscp_v1p1"
    ns_md = "http://www.imsglobal.org/xsd/imsmd_v1p2"
    ns_qti = "http://www.imsglobal.org/xsd/imsqti_v2p1"

    # We use minidom here so we can control namespace prefixes cleanly.
    impl = getDOMImplementation()
    doc = impl.createDocument(ns_cp, "manifest", None)
    manifest = doc.documentElement
    manifest.setAttribute("xmlns", ns_cp)
    manifest.setAttribute("xmlns:imsmd", ns_md)
    manifest.setAttribute("xmlns:imsqti", ns_qti)
    manifest.setAttribute("identifier", "UBUS670-Final-Exam-Pool")

    # metadata
    metadata = doc.createElement("metadata")
    manifest.appendChild(metadata)

    schema = doc.createElement("schema")
    schema.appendChild(doc.createTextNode("QTIv2.1 Package"))
    metadata.appendChild(schema)

    schema_ver = doc.createElement("schemaversion")
    schema_ver.appendChild(doc.createTextNode("1.0.0"))
    metadata.appendChild(schema_ver)

    # organizations (empty, required by spec)
    organizations = doc.createElement("organizations")
    manifest.appendChild(organizations)

    # resources
    resources = doc.createElement("resources")
    manifest.appendChild(resources)

    # Track which images have already been declared to avoid duplicates.
    # BB Ultra throws DuplicateFileException if the same image path appears
    # in multiple <file> elements across the manifest.
    declared_images: set[str] = set()

    for q in questions:
        qid = q["id"]
        filename = f"items/{qid.lower()}.xml"

        resource = doc.createElement("resource")
        resource.setAttribute("identifier", f"RES-{qid}")
        resource.setAttribute("type", "imsqti_item_xmlv2p1")
        resource.setAttribute("href", filename)

        file_el = doc.createElement("file")
        file_el.setAttribute("href", filename)
        resource.appendChild(file_el)

        # Declare image dependency only on the FIRST question that uses it
        if q.get("image") and q["image"] not in declared_images:
            dep_file = doc.createElement("file")
            dep_file.setAttribute("href", f"images/{q['image']}")
            resource.appendChild(dep_file)
            declared_images.add(q["image"])

        resources.appendChild(resource)

    xml_bytes = doc.toprettyxml(indent="  ", encoding="UTF-8")
    # Clean up blank lines
    lines = [line for line in xml_bytes.decode("utf-8").splitlines() if line.strip()]
    return "\n".join(lines).encode("utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    # Load questions
    if not QUESTIONS_JSON.exists():
        print(f"ERROR: {QUESTIONS_JSON} not found", file=sys.stderr)
        sys.exit(1)

    with open(QUESTIONS_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data["questions"]
    print(f"Loaded {len(questions)} questions from {QUESTIONS_JSON.name}")

    # Collect real image files
    image_files: list[str] = []
    if IMAGES_DIR.is_dir():
        image_files = [
            p.name
            for p in IMAGES_DIR.iterdir()
            if p.is_file() and not p.name.startswith(".")
        ]
    print(f"Found {len(image_files)} image file(s) in images/")

    # Count questions that reference images
    items_with_images = sum(1 for q in questions if q.get("image"))

    # Build ZIP
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        # Write each assessmentItem
        for q in questions:
            xml_bytes = build_assessment_item(q)
            item_path = f"items/{q['id'].lower()}.xml"
            zf.writestr(item_path, xml_bytes)

        # Copy image files into the ZIP
        for img_name in image_files:
            img_path = IMAGES_DIR / img_name
            zf.write(img_path, f"images/{img_name}")

        # Write manifest
        manifest_bytes = build_manifest(questions, image_files)
        zf.writestr("imsmanifest.xml", manifest_bytes)

    zip_size = OUTPUT_ZIP.stat().st_size

    # Summary
    print()
    print("=" * 50)
    print("QTI 2.1 Package Build Summary")
    print("=" * 50)
    print(f"  Total items:        {len(questions)}")
    print(f"  Items with images:  {items_with_images}")
    print(f"  Image files:        {len(image_files)}")
    print(f"  Output:             {OUTPUT_ZIP.name}")
    print(f"  ZIP file size:      {zip_size:,} bytes ({zip_size / 1024:.1f} KB)")
    print("=" * 50)


if __name__ == "__main__":
    main()
