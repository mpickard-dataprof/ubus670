# UBUS 670 Style Guide

**Based on:** [NIU Communication Standards](https://www.niu.edu/communication-standards/visual/index.shtml)
**Created:** 2026-02-04

---

## Brand Colors

### Primary Colors

| Color | Hex | RGB | CSS Variable | Usage |
|-------|-----|-----|--------------|-------|
| NIU Red | `#C8102E` | 200, 16, 46 | `--niu-red` | Primary accent, highlights, CTAs |
| Black | `#000000` | 0, 0, 0 | `--niu-black` | Text, headers, backgrounds |
| Gray | `#A5A7A8` | 165, 167, 168 | `--niu-gray` | Borders, subtle accents |
| White | `#FFFFFF` | 255, 255, 255 | `--niu-white` | Backgrounds, text on dark |

### Secondary Colors (Use Sparingly)

| Color | Hex | CSS Variable | Suggested Use |
|-------|-----|--------------|---------------|
| Orange | `#E35205` | `--niu-orange` | Warnings, attention |
| Yellow | `#FEDB00` | `--niu-yellow` | Highlights, tips |
| Lime | `#D0DF00` | `--niu-lime` | Success states |
| Green | `#43B02A` | `--niu-green` | Success, completion |
| Teal | `#00968F` | `--niu-teal` | Information |
| Blue | `#00A9E0` | `--niu-blue` | Links, interactive |
| Navy | `#1D428A` | `--niu-navy` | Deep contrast |

### Functional Colors

| Purpose | Light Theme | Dark Theme |
|---------|-------------|------------|
| Background | `#FFFFFF` | `#1a1a1a` |
| Surface | `#f5f5f5` | `#2d2d2d` |
| Text Primary | `#000000` | `#FFFFFF` |
| Text Secondary | `#A5A7A8` | `#A5A7A8` |
| Accent | `#C8102E` | `#C8102E` |

---

## Typography

### Font Stack

```css
/* Headlines - Montserrat (Gotham substitute) */
--font-headline: 'Montserrat', Arial, sans-serif;

/* Body - System serif or Times */
--font-body: Georgia, 'Times New Roman', serif;

/* Code/Monospace */
--font-mono: 'Fira Code', 'Consolas', monospace;
```

### Font Sizes (Desktop)

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Slide Title) | 2.5rem (40px) | 700 | 1.2 |
| H2 (Section) | 2rem (32px) | 600 | 1.3 |
| H3 (Subsection) | 1.5rem (24px) | 600 | 1.4 |
| Body | 1.125rem (18px) | 400 | 1.6 |
| Small/Caption | 0.875rem (14px) | 400 | 1.5 |

### Typography Rules

1. **Headlines:** Always use Montserrat (bold weights)
2. **Body text:** Use Georgia or system serif for readability
3. **Never** use more than 2 font families on a single page
4. **Minimum** body text size: 18px for presentations

---

## Graphic Elements

### Shield Pattern

The NIU shield pattern creates subtle texture and brand reinforcement.

**Usage Rules:**
- Light backgrounds: Use at 10-15% opacity
- Dark backgrounds: Use at 80-90% opacity
- Never let pattern compete with content
- Maintain consistent scale

**Implementation:**
```css
.shield-pattern-light {
  background-image: url('assets/shield-pattern.svg');
  background-repeat: repeat;
  opacity: 0.1;
}

.shield-pattern-dark {
  background-image: url('assets/shield-pattern.svg');
  background-repeat: repeat;
  opacity: 0.85;
  filter: invert(1);
}
```

### Highlight Frame

Black background with thick NIU Red border. Use for key takeaways.

```css
.highlight-frame {
  background: var(--niu-black);
  border: 4px solid var(--niu-red);
  color: var(--niu-white);
  padding: 1.5rem;
}
```

### Shield Frame

Gray border with white background. Use for focal content.

```css
.shield-frame {
  background: var(--niu-white);
  border: 3px solid var(--niu-gray);
  padding: 1.5rem;
  /* Hexagonal clip-path optional */
}
```

---

## Spacing System

Based on 8px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight spacing |
| `--space-sm` | 8px | Inline elements |
| `--space-md` | 16px | Standard padding |
| `--space-lg` | 24px | Section spacing |
| `--space-xl` | 32px | Major sections |
| `--space-2xl` | 48px | Page sections |

---

## Component Patterns

### Cards

```css
.card {
  background: var(--niu-white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: var(--space-lg);
}

.card-accent {
  border-left: 4px solid var(--niu-red);
}
```

### Buttons

```css
.btn-primary {
  background: var(--niu-red);
  color: var(--niu-white);
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-family: var(--font-headline);
  font-weight: 600;
}

.btn-secondary {
  background: transparent;
  color: var(--niu-red);
  border: 2px solid var(--niu-red);
}
```

### Quiz Feedback

```css
.feedback-correct {
  background: rgba(67, 176, 42, 0.1);
  border-left: 4px solid var(--niu-green);
}

.feedback-incorrect {
  background: rgba(200, 16, 46, 0.1);
  border-left: 4px solid var(--niu-red);
}
```

---

## Accessibility

### Color Contrast

All text must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum

**Verified Combinations:**
- Black on White: 21:1 ✓
- White on NIU Red: 4.6:1 ✓
- White on Black: 21:1 ✓
- NIU Red on White: 4.6:1 ✓

### Focus States

All interactive elements must have visible focus indicators:

```css
:focus-visible {
  outline: 3px solid var(--niu-blue);
  outline-offset: 2px;
}
```

---

## File Naming Convention

```
assets/
├── niu-logo-horizontal.svg
├── niu-logo-stacked.svg
├── beacon-logo.svg
├── shield-pattern.svg
├── icons/
│   ├── icon-check.svg
│   ├── icon-warning.svg
│   └── ...
└── images/
    └── [descriptive-name].png
```

---

## Slide Design Principles

1. **One idea per slide** — Avoid cognitive overload
2. **Visual hierarchy** — Clear distinction between headline and content
3. **Breathing room** — Generous margins, don't crowd edges
4. **Consistent placement** — Headers, footers in same position
5. **Brand reinforcement** — Subtle red accents, not overwhelming

---

*Reference: [NIU Communication Standards](https://www.niu.edu/communication-standards/visual/index.shtml)*
