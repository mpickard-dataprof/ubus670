#!/bin/bash

# Ensure we are in the right directory or adjust paths
# Usage: ./generate_assets.sh

# Check for API Key
if [ -z "$GEMINI_API_KEY" ]; then
    echo "Error: GEMINI_API_KEY is not set."
    echo "Please export your key: export GEMINI_API_KEY='your_key_here'"
    exit 1
fi

TOOLS_DIR="../../../_tools"
OUTPUT_DIR="images"

mkdir -p "$OUTPUT_DIR"

echo "Generating Day 4 Lecture Images..."

# Slide 1: Title
python3 "$TOOLS_DIR/generate_image.py" \
    "Warm, professional illustration of a friendly AI assistant in a modern office, surrounded by floating holographic images, audio waveforms, and video frames. The AI is helping a diverse group of business professionals. Clean, minimal style with soft warm lighting. NIU red (#C8102E) accent colors. Educational illustration style, not photorealistic." \
    -o "$OUTPUT_DIR/title_slide.png" -p educational

# Slide 5: Multimodal Input
python3 "$TOOLS_DIR/generate_image.py" \
    "Educational infographic showing four input modalities for AI: a camera icon for images, a microphone for audio, a film strip for video, and a document for text — all converging toward a central glowing AI brain. Clean flat design, warm colors, business context. Labels on each modality. White background." \
    -o "$OUTPUT_DIR/multimodal_concept.png" -p educational

# Slide 7: Real World Cases
python3 "$TOOLS_DIR/generate_image.py" \
    "Split illustration showing 6 multimodal AI business applications in equal panels: (1) a drone scanning warehouse shelves, (2) a headset with audio waves representing call center analytics, (3) a camera scanning invoices, (4) a retail store with overhead cameras, (5) a manufacturing inspection camera, (6) a marketing team reviewing AI-generated images. Warm illustration style, consistent color palette with reds and blues." \
    -o "$OUTPUT_DIR/real_world_cases.png" -p educational

# Slide 10: Image Understanding
python3 "$TOOLS_DIR/generate_image.py" \
    "Professional retail store spring product display photograph with seasonal items, warm lighting, and clean merchandising. A realistic in-store display that would be used for competitive marketing analysis. Professional photography style." \
    -o "$OUTPUT_DIR/store_display_analysis.png" -p engagement

# Slide 14: Image Generation Concept
python3 "$TOOLS_DIR/generate_image.py" \
    "Side-by-side illustration: on the left, a person typing a creative text prompt on a laptop. On the right, a beautiful marketing image materializing from the screen — a vibrant spring retail display with seasonal products. Magical sparkle effect between prompt and result. Warm professional style." \
    -o "$OUTPUT_DIR/image_gen_concept.png" -p educational

# Slide 15: Prompt Comparison
python3 "$TOOLS_DIR/generate_image.py" \
    "Two-panel comparison: LEFT panel shows a vague prompt producing a bland, generic image. RIGHT panel shows a detailed prompt producing a polished, professional spring retail campaign image. Clear 'before/after' framing. Educational illustration style." \
    -o "$OUTPUT_DIR/prompt_comparison.png" -p educational

# Slide 18: Scenario Team
python3 "$TOOLS_DIR/generate_image.py" \
    "Warm illustration of the Beacon Retail Group marketing team at a brainstorming table. On a large screen behind them, AI is displaying generated marketing concepts, competitor analysis charts, and customer sentiment graphs. Diverse team of 4-5 professionals. Modern conference room. Collaborative energy." \
    -o "$OUTPUT_DIR/scenario_team.png" -p engagement

# Slide 21: Generated Visual Example
python3 "$TOOLS_DIR/generate_image.py" \
    "Example generated marketing image for Beacon spring campaign — product display with seasonal theme, spring flowers, pastel colors, modern retail aesthetic, warm inviting atmosphere, professional marketing photography style" \
    -o "$OUTPUT_DIR/marketing_visual_example.png" -p engagement

# Slide 23: Human in the Loop
python3 "$TOOLS_DIR/generate_image.py" \
    "Illustration showing a marketing professional reviewing AI-generated content on a tablet. Some items have green checkmarks, others have orange revision marks. The professional is adding notes and brand refinements. Warm, professional style suggesting collaboration between human and AI." \
    -o "$OUTPUT_DIR/human_in_loop.png" -p educational

echo "Generating Lab Sample Assets..."

# Lab Task 1: Competitor Ads
python3 "$TOOLS_DIR/generate_image.py" \
    "Professional marketing image for a fictional competitor store 'Luxe Home': high-end furniture, minimalist aesthetic, cool lighting, gold and emerald green colors, text placeholder 'Spring Elegance'. High-end lifestyle photography." \
    -o "$OUTPUT_DIR/competitor_ad_1.png" -p engagement

python3 "$TOOLS_DIR/generate_image.py" \
    "Vibrant marketing image for a fictional competitor store 'Value Mart': busy layout, bright yellow and orange colors, family-focused products, discount stickers, 'Spring Sale' text. Action-oriented retail style." \
    -o "$OUTPUT_DIR/competitor_ad_2.png" -p engagement

# Lab Task 4b: Video Alternative (Static frame)
python3 "$TOOLS_DIR/generate_image.py" \
    "A clean, wide-angle interior shot of a modern retail boutique with organized shelves, a customer browsing in the background, and clear signage. Used for store walkthrough analysis." \
    -o "$OUTPUT_DIR/store_walkthrough_frame.png" -p educational

echo "Done! Images generated in $OUTPUT_DIR/"
