#!/bin/bash

# Generate sample competitor ad images for the Day 4 lab.
# Lecture slides are handled by NotebookLM — this script only creates lab assets.
#
# Usage: export GEMINI_API_KEY='your_key' && ./generate_assets.sh

# Check for API Key
if [ -z "$GEMINI_API_KEY" ]; then
    echo "Error: GEMINI_API_KEY is not set."
    echo "Please export your key: export GEMINI_API_KEY='your_key_here'"
    exit 1
fi

TOOLS_DIR="../../../_tools"
OUTPUT_DIR="images"

mkdir -p "$OUTPUT_DIR"

DELAY=15  # seconds between requests to avoid 429 rate limits

echo "Generating Day 4 Lab Assets (with ${DELAY}s delay between requests)..."

# Competitor Ad 1 — Luxe Home & Style (upscale lifestyle retailer competing with Beacon)
python3 "$TOOLS_DIR/generate_image.py" \
    "Photorealistic retail marketing advertisement for a premium lifestyle store called Luxe Home & Style. A curated spring display featuring fashionable spring jackets on mannequins, decorative throw pillows, ceramic planters with fresh greenery, and scented candles on sleek wooden tables. Soft natural lighting, airy and elegant. A tasteful banner reads 'The Spring Edit — New Arrivals'. Muted cream, sage green, and gold color palette. Shot in the style of a Crate & Barrel or Anthropologie catalog page. Professional commercial photography, 4K quality." \
    -o "$OUTPUT_DIR/competitor_ad_1.png" -p none
sleep $DELAY

# Competitor Ad 2 — MarketSquare (budget lifestyle retailer competing with Beacon)
python3 "$TOOLS_DIR/generate_image.py" \
    "Photorealistic retail marketing advertisement for a budget-friendly lifestyle store called MarketSquare. A bright, welcoming spring sale display with racks of colorful casual jackets and tees, stacked throw blankets, patio lanterns, and potted flowers on sale. A bold red and yellow banner reads 'Spring Into Savings — Styles from \$12.99'. Warm overhead lighting, clean but packed shelves, family-friendly energy. Shot in the style of a TJ Maxx or Old Navy promotional flyer. Professional commercial photography, vibrant colors, 4K quality." \
    -o "$OUTPUT_DIR/competitor_ad_2.png" -p none

echo "Done! Lab assets generated in $OUTPUT_DIR/"
