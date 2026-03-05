#!/usr/bin/env python3
"""Convert Reveal.js HTML lectures to Markdown for NotebookLM ingestion.

Extracts educational content from <section> slides, strips CSS/JS/framework
markup, and produces clean markdown with slide boundaries.

Usage:
    python3 html2md.py "Materials/Week 1/Day 1/web/lecture.html"
    python3 html2md.py lecture.html -o output.md
"""

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class RevealToMarkdown(HTMLParser):
    """Parse Reveal.js HTML and extract slide content as Markdown."""

    # Tags that produce block-level markdown
    BLOCK_TAGS = {'p', 'div', 'section', 'aside', 'blockquote', 'pre', 'code'}
    # Tags to skip entirely (including their children)
    SKIP_TAGS = {'style', 'script', 'nav', 'noscript'}
    # Header tags
    HEADER_TAGS = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}
    # List tags
    LIST_TAGS = {'ul', 'ol'}
    LIST_ITEM_TAG = 'li'

    def __init__(self):
        super().__init__()
        self.slides = []
        self.current_slide = []
        self.in_slide = False
        self.slide_count = 0
        self.skip_depth = 0  # depth counter for skipped tags
        self.list_stack = []  # track nested list types
        self.in_table = False
        self.table_rows = []
        self.current_row = []
        self.current_cell = []
        self.in_cell = False
        self.is_header_row = False
        self.in_header_tag = None  # current header tag name
        self.in_aside = False
        self.aside_content = []
        self.current_text = []  # accumulate text fragments
        self.section_depth = 0
        self.slide_bg_color = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        # Track skip tags
        if tag in self.SKIP_TAGS:
            self.skip_depth += 1
            return

        if self.skip_depth > 0:
            return

        # Section = slide
        if tag == 'section':
            self.section_depth += 1
            if self.section_depth == 1:
                self.in_slide = True
                self.slide_count += 1
                self.current_slide = []
                self.slide_bg_color = attrs_dict.get('data-background-color', None)
            return

        if not self.in_slide:
            return

        # Speaker notes
        if tag == 'aside' and 'notes' in attrs_dict.get('class', ''):
            self.in_aside = True
            self.aside_content = []
            return

        # Headers
        if tag in self.HEADER_TAGS:
            self._flush_text()
            self.in_header_tag = tag
            return

        # Lists
        if tag in self.LIST_TAGS:
            self._flush_text()
            self.list_stack.append(tag)
            return

        if tag == self.LIST_ITEM_TAG and self.list_stack:
            self._flush_text()
            indent = '  ' * (len(self.list_stack) - 1)
            if self.list_stack[-1] == 'ol':
                self.current_slide.append(f'{indent}1. ')
            else:
                self.current_slide.append(f'{indent}- ')
            return

        # Tables
        if tag == 'table':
            self._flush_text()
            self.in_table = True
            self.table_rows = []
            return
        if tag == 'thead':
            self.is_header_row = True
            return
        if tag == 'tbody':
            self.is_header_row = False
            return
        if tag == 'tr':
            self.current_row = []
            return
        if tag in ('td', 'th'):
            self.in_cell = True
            self.current_cell = []
            return

        # Images — extract alt text
        if tag == 'img':
            alt = attrs_dict.get('alt', '')
            if alt:
                self.current_slide.append(f'\n> [Visual: {alt}]\n')
            return

        # SVG — note presence
        if tag == 'svg':
            self.current_slide.append('\n> [Visual: SVG diagram]\n')
            self.skip_depth += 1  # skip svg internals
            return

        # Strong/bold
        if tag in ('strong', 'b'):
            self.current_text.append('**')
            return

        # Emphasis/italic
        if tag in ('em', 'i'):
            self.current_text.append('*')
            return

        # Code inline
        if tag == 'code' and not self._in_pre():
            self.current_text.append('`')
            return

        # Line break
        if tag == 'br':
            self.current_text.append('\n')
            return

    def handle_endtag(self, tag):
        # Track skip tags
        if tag in self.SKIP_TAGS or (tag == 'svg' and self.skip_depth > 0):
            self.skip_depth = max(0, self.skip_depth - 1)
            return

        if self.skip_depth > 0:
            return

        # End of slide
        if tag == 'section':
            if self.section_depth == 1 and self.in_slide:
                self._flush_text()
                self.slides.append({
                    'number': self.slide_count,
                    'content': self.current_slide,
                    'bg_color': self.slide_bg_color,
                })
                self.in_slide = False
                self.current_slide = []
            self.section_depth = max(0, self.section_depth - 1)
            return

        if not self.in_slide:
            return

        # Speaker notes
        if tag == 'aside' and self.in_aside:
            self.in_aside = False
            note_text = ''.join(self.aside_content).strip()
            if note_text:
                self.current_slide.append(f'\n> *Speaker notes: {note_text}*\n')
            return

        # Headers
        if tag in self.HEADER_TAGS and self.in_header_tag:
            text = ''.join(self.current_text).strip()
            self.current_text = []
            level = int(tag[1])
            prefix = '#' * min(level + 1, 4)  # offset by 1 since h1 → ##
            if text:
                self.current_slide.append(f'\n{prefix} {text}\n')
            self.in_header_tag = None
            return

        # Lists
        if tag in self.LIST_TAGS and self.list_stack:
            self._flush_text()
            self.list_stack.pop()
            if not self.list_stack:
                self.current_slide.append('\n')
            return

        if tag == self.LIST_ITEM_TAG:
            self._flush_text_inline()
            self.current_slide.append('\n')
            return

        # Tables
        if tag in ('td', 'th') and self.in_cell:
            self.in_cell = False
            cell_text = ''.join(self.current_cell).strip()
            cell_text = ' '.join(cell_text.split())  # normalize whitespace
            self.current_row.append(cell_text)
            return
        if tag == 'tr' and self.in_table:
            self.table_rows.append(self.current_row)
            return
        if tag == 'table' and self.in_table:
            self.in_table = False
            self._render_table()
            return

        # Strong/bold
        if tag in ('strong', 'b'):
            self.current_text.append('**')
            return

        # Emphasis/italic
        if tag in ('em', 'i'):
            self.current_text.append('*')
            return

        # Code inline
        if tag == 'code' and not self._in_pre():
            self.current_text.append('`')
            return

        # Paragraphs and divs — flush text
        if tag in ('p', 'div', 'blockquote'):
            self._flush_text()
            return

    def handle_data(self, data):
        if self.skip_depth > 0:
            return

        if self.in_aside:
            self.aside_content.append(data)
            return

        if self.in_cell:
            self.current_cell.append(data)
            return

        if self.in_slide:
            self.current_text.append(data)

    def _flush_text(self):
        """Flush accumulated text as a paragraph."""
        text = ''.join(self.current_text).strip()
        self.current_text = []
        if text:
            # Normalize internal whitespace but preserve markdown formatting
            lines = text.split('\n')
            cleaned = []
            for line in lines:
                cleaned.append(' '.join(line.split()))
            text = '\n'.join(cleaned)
            self.current_slide.append(f'\n{text}\n')

    def _flush_text_inline(self):
        """Flush accumulated text inline (for list items)."""
        text = ''.join(self.current_text).strip()
        self.current_text = []
        if text:
            text = ' '.join(text.split())
            self.current_slide.append(text)

    def _render_table(self):
        """Render accumulated table rows as markdown table."""
        if not self.table_rows:
            return

        # Calculate column widths
        num_cols = max(len(row) for row in self.table_rows)

        # Pad rows to same length
        for row in self.table_rows:
            while len(row) < num_cols:
                row.append('')

        # Build markdown table
        lines = []
        for i, row in enumerate(self.table_rows):
            line = '| ' + ' | '.join(row) + ' |'
            lines.append(line)
            if i == 0:
                # Header separator
                sep = '| ' + ' | '.join(['---'] * num_cols) + ' |'
                lines.append(sep)

        self.current_slide.append('\n' + '\n'.join(lines) + '\n')

    def _in_pre(self):
        """Check if we're inside a <pre> block."""
        return False  # simplified — we don't track pre depth

    def to_markdown(self, title=None):
        """Convert parsed slides to a single markdown document."""
        lines = []

        if title:
            lines.append(f'# {title}\n')

        for slide in self.slides:
            num = slide['number']
            content = ''.join(slide['content']).strip()
            bg = slide['bg_color']

            if not content:
                continue

            lines.append('\n---\n')

            # Check if this is a section divider (colored background, short content)
            if bg and len(content) < 200:
                # Strip any markdown header prefixes from the content
                clean = re.sub(r'^#{1,4}\s+', '', content, flags=re.MULTILINE).strip()
                # Collapse to single line with separator
                clean = ' — '.join(line.strip() for line in clean.split('\n') if line.strip())
                lines.append(f'## {clean}\n')
            else:
                lines.append(f'### Slide {num}\n')
                lines.append(content)

            lines.append('')

        return '\n'.join(lines)


def extract_title(html_content):
    """Extract the <title> tag content."""
    match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None


def convert(input_path, output_path=None):
    """Convert a Reveal.js HTML file to Markdown."""
    input_file = Path(input_path)

    if not input_file.exists():
        print(f"Error: {input_file} does not exist.")
        sys.exit(1)

    html_content = input_file.read_text(encoding='utf-8')
    title = extract_title(html_content)

    parser = RevealToMarkdown()
    parser.feed(html_content)

    markdown = parser.to_markdown(title=title)

    # Clean up excessive blank lines
    markdown = re.sub(r'\n{4,}', '\n\n\n', markdown)

    if output_path:
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(markdown, encoding='utf-8')
        print(f"Converted {len(parser.slides)} slides → {out}")
        print(f"Output size: {len(markdown):,} characters")
    else:
        print(markdown)

    return markdown


if __name__ == '__main__':
    arg_parser = argparse.ArgumentParser(
        description='Convert Reveal.js HTML lectures to Markdown for NotebookLM.'
    )
    arg_parser.add_argument('input', help='Path to Reveal.js HTML lecture file')
    arg_parser.add_argument('-o', '--output', help='Output markdown file path (default: stdout)')

    args = arg_parser.parse_args()
    convert(args.input, args.output)
