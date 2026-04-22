#!/usr/bin/env bash
# Generate the 17 new slide images for community-college-talk.
#
# Usage:
#   export GEMINI_API_KEY=your_key_here   # or put one in ../../.env as before
#   cd /path/to/Materials/community-college-talk
#   bash generate_new_images.sh
#
# Each call takes ~10-30 seconds. Re-running overwrites. Safe to Ctrl-C and resume
# by commenting out the lines that already succeeded.

set -e
cd "$(dirname "$0")"

TOOL="../_tools/generate_image.py"
OUT="images"

run() {
  local out="$1"; shift
  local preset="$1"; shift
  local prompt="$1"
  if [[ -f "$OUT/$out" ]]; then
    echo "[skip] $out already exists"
    return
  fi
  echo "[generate] $out"
  python3 "$TOOL" -o "$OUT/$out" -p "$preset" "$prompt"
}

# ====================================================================
# SECTION 0 — THE HOOK
# ====================================================================

run "slide-01.png" "engagement" \
"Editorial illustration for a title slide: a young accounting student at a clean modern desk looking confidently at a laptop. Floating abstract AI elements around the laptop — a glowing neural network node cluster, a stylized balance scale made of glowing numbers, subtle flowing data lines. Warm inviting lighting, white and light gray palette with NIU Red accent on one AI glow element. Centered composition, polished and welcoming."

run "slide-02.png" "educational" \
"Split-screen diagrammatic comparison on a white background. Left half: a small plain speech bubble pointing at a thin, generic output document with just a few flat lines of content and a gray dull color. Right half: a detailed speech bubble (with subtle pictograms suggesting role/context/task) pointing at a well-structured output document with clear sections, bullets, and bolded callouts rendered in NIU Red accent. A subtle arrow between them suggesting progression. Flat modern vector style, clean, no real text."

# ====================================================================
# SECTION 1 — INSIDE THE BOX
# ====================================================================

run "slide-06.png" "educational" \
"A visual metaphor for a 'galaxy of meaning' on a very light gray background. Three distinct clusters of softly glowing dots connected by faint lines. One cluster (upper left) is tightly packed and colored NIU Red, suggesting payment-related terms. Another cluster (center) is navy blue, suggesting depreciation/accounting terms. Far to the lower right, a single solitary dot drifts alone, suggesting an unrelated word. Clean vector constellation style, subtle starfield, no text labels."

run "slide-07.png" "educational" \
"A visual metaphor for semantic search: a magnifying glass hovering over a stack of rows that look like transaction records on a white background. The magnifying glass is over one row, but glowing highlight arcs extend to other rows in the stack — as if it 'understood' those rows too. The glowing highlights are in NIU Red. Clean modern vector illustration. No actual text inside the rows — just placeholder line-shapes."

run "slide-09.png" "educational" \
"Abstract visualization of an AI attention mechanism. A central glowing word-node in NIU Red with rays of varying thickness connecting to other smaller nodes. Thicker rays go to the most relevant nodes (suggesting 'asset', 'vehicle', 'useful life'); thinner gray rays go to less relevant ones. All on a white background. Clean flat vector style, navy blue for the satellite nodes, NIU red for the central node."

# ====================================================================
# SECTION 2 — HALLUCINATIONS
# ====================================================================

run "slide-11.png" "educational" \
"A clean flat illustration of an AI robot confidently handing a document to a skeptical-looking accountant. The document has generic text lines and a bright red warning icon stamped on it. The accountant raises an eyebrow. Warm but slightly cautionary tone. Modern vector illustration, white background, NIU Red for the warning stamp. No real text on the document."

run "slide-13.png" "educational" \
"A 3x2 grid of six tile icons on a white background, each representing a hallucination mitigation tactic. Tile 1: a document with a cloud-upload arrow (ground it). Tile 2: a dashboard dial turned to 'low' (lower temperature). Tile 3: quotation marks next to a page-number marker (demand citations). Tile 4: a warning triangle next to a question mark (what would make you wrong). Tile 5: two speech bubbles side by side (two-model check). Tile 6: a human hand signing a document (golden rule: human verifies). Clean flat vector style, subtle drop shadows, NIU red accent on each icon. No text labels inside the tiles."

run "slide-14.png" "educational" \
"A clean modern infographic showing a downward-trending bar chart across three eras. Three vertical bars of decreasing height, each rendered in a progressively lighter shade of NIU Red: a tall bar on the left representing early AI (2023), a medium bar in the middle (2024), and a short bar on the right (2026). A thin downward arrow overlay in navy. Small logo-like badges above each bar suggesting 'GPT-3.5 / GPT-4 / flagship models' — just abstract shapes, no real text. White background, minimalist, editorial infographic style."

run "slide-15.png" "engagement" \
"Three friendly tool cards arranged horizontally on a white background, each with rounded corners and a soft shadow. Each card has a distinct abstract icon (a gem shape, a chat bubble, a starburst) and subtle branded color accents but all feel balanced and equal. A small 'try it' arrow sits at the bottom-right of each card. Warm, welcoming, inviting. Clean flat vector style. No text on the cards — just the icons."

# ====================================================================
# SECTION 3 — PROMPT ENGINEERING
# ====================================================================

run "slide-17.png" "educational" \
"A vertical stack of five connected blocks on a white background, each block a slightly different color: NIU Red, navy, teal, orange, and a warm gray. Each block has a small distinctive pictogram: a person silhouette (for Role), a document (for Context), a checkmark (for Task), a formatted page with headings (for Format), and a ruler (for Constraints). Below the stack, a clean output document emerges with neatly structured content lines. Clean vector diagram style, subtle connecting lines showing flow. No text labels — the pictograms alone convey meaning."

run "slide-18.png" "engagement" \
"A small stack of 5 colorful index cards fanned out at slight offsets on a warm white desk surface, photographed from slightly above with soft diffused lighting. Each card in a different soft color (NIU Red, navy, teal, warm yellow, gray) and each card has a small distinctive pictogram — person, document, checkmark, formatted page, ruler. Editorial illustration style, tactile, memorable, like a photograph of study materials. No text on the cards."

# ====================================================================
# SECTION 4 — CONTEXT ENGINEERING & RAG
# ====================================================================

run "slide-25.png" "educational" \
"A balanced side-by-side diagram on a white background. Left panel: a speech bubble with a small gear icon inside (suggesting 'instructions') flowing with an arrow into a stylized AI brain icon. Right panel: a stack of documents and books flowing with an arrow into the same AI brain icon. A large plus sign sits between the two panels, showing they combine. Clean vector style, NIU red accents on both panels equally. No text labels."

run "slide-26.png" "educational" \
"A before-and-after split screen showing two AI chat-interface mockups on a white background. Left ('cold'): a chat window with a question and a short, vague response. No attached files indicator. Slightly gray and less confident. Right ('with context'): the same chat window but now with a PDF attachment icon next to the question, and the response is richer with a small highlight callout referencing a page number. NIU red accent highlighting the page-number reference on the right. Clean modern UI illustration style, no real text — just abstract content lines."

run "slide-31.png" "educational" \
"A 2x2 grid of four benefit tiles on a white background. Tile 1: a page icon with a citation bookmark (cite the source). Tile 2: a clock icon with refresh arrows (always current). Tile 3: a lock icon on a folder (private data). Tile 4: a magnifying glass over a tree-of-dots graph (audit trail). Each tile has a soft rounded background and subtle shadow. NIU red and navy accents, professional accounting context. Clean flat vector style. No text inside tiles."

# ====================================================================
# SECTION 5 — TAKEAWAYS
# ====================================================================

run "slide-32.png" "educational" \
"Three clean horizontal tile icons with large numeric badges '1', '2', '3' in NIU Red circles at the top-left of each tile. Tile 1 icon: a brain with a checkmark (verify). Tile 2 icon: a small stack suggesting RCTFC with a temperature dial and a citation mark (framework + temp + citations). Tile 3 icon: a document attached to an AI brain (context wins). Clean flat vector style, soft shadows, white background, professional and summary-feeling."

run "slide-33.png" "engagement" \
"Editorial illustration of a young accounting student at a laptop thoughtfully saving a template file into a small notebook-like app. A soft thought cloud above them contains three small vignettes showing the same template being reused: categorizing expenses, drafting a client email, summarizing a textbook chapter. Warm inviting lighting, white and soft gray palette, NIU red accent on the saved-template icon. Modern editorial style."

run "slide-34.png" "engagement" \
"A warm, inviting Q&A composition on a white background: a large softly glowing question mark on the left paired with a speech-bubble answer shape on the right. Below, three small pathway icons suggesting resources — a link, a book, an envelope. Clean editorial style, navy and NIU red accents, welcoming and open. No text labels."

echo ""
echo "All 17 images generated (or skipped if already present)."
echo "Preview: open lecture.html in a browser."
