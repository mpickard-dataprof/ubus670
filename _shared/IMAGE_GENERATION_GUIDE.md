# Image Generation Guide: Nano Banana Style

This guide outlines the visual language for UBUS 670 course materials. We use the Gemini 2.5 Flash Image model ("Nano Banana") to create consistent, high-quality illustrations that reinforce learning.

## Core Visual Identity

All images should adhere to these principles:
1.  **Warm & Professional**: Approachable but suitable for an MBA audience. Avoid overly "cute" or childish styles.
2.  **Clean & Modern**: Use flat or semi-flat illustration styles. Avoid hyper-realistic or overly cluttered compositions.
3.  **NIU Palette**: Primarily use White, Gray, and **NIU Red (#C8102E)** as the accent color. Complementary colors: Navy (#1D428A), Teal (#00968F).
4.  **No Text**: Avoid text within the image itself (labels should be HTML/CSS overlays).

## Image Categories

### 1. Educational Visualization (`--preset educational`)
Use when explaining a specific concept, process, or relationship.

*   **Goal**: Clarity above all.
*   **Style**: Diagrammatic, schematic, simplified. Clear separation of elements.
*   **Examples**:
    *   Transformer architecture diagram.
    *   Relationship between AI model, context, and output.
    *   Flowchart of a business process.
*   **Prompt Structure**: `[Concept] shown as a clean vector-style diagram. Components: [A], [B], [C]. Arrows showing flow from left to right. White background.`

### 2. Engagement Graphic (`--preset engagement`)
Use for title slides, section dividers, or to add visual interest to abstract topics.

*   **Goal**: Visual appeal, setting the tone.
*   **Style**: Editorial illustration, metaphorical, slightly more abstract.
*   **Examples**:
    *   A person interacting with a futuristic interface (for "User Interface" topic).
    *   A stylized brain connecting to a digital cloud (for "AI Brain" metaphor).
    *   A team collaborating around a holographic projection (for "Future of Work").
*   **Prompt Structure**: `Editorial illustration of [Subject] in a modern office setting. Warm lighting. Focus on [Key Element]. Abstract digital elements in background.`

## Workflow

1.  **Identify the Need**: Does the slide need a concept explained (Educational) or visual interest (Engagement)?
2.  **Draft the Prompt**: Describe the subject clearly. Use the `SUBJECT:` prefix in your mind.
3.  **Select Preset**: Choose `educational` or `engagement`.
4.  **Generate**: Use the `generate_image.py` tool.
5.  **Review**: Check for clarity, brand alignment, and absence of text artifacts.

## Prompting Tips for Nano Banana

*   **Be Specific**: "A robot" is too vague. "A stylized, friendly robot arm assembling a digital puzzle" is better.
*   **Metaphors Work**: Describe abstract AI concepts using physical metaphors (e.g., "filters" as sieves, "tokens" as puzzle pieces).
*   **Lighting**: "Soft studio lighting" or "warm sunlight" helps create the desired mood.
*   **Composition**: "Minimalist composition", "Centered", "Isometric view".

## Example Prompts

**Educational:**
> "A visual metaphor for 'Context Window'. A clear glass window frame looking out onto a vast library of books. Only a few books are visible through the frame. The rest are blurred. Clean lines, white background."

**Engagement:**
> "A diverse team of business professionals standing around a glowing digital table, analyzing data visualizations. Modern office background, blurred. Warm, inviting atmosphere. NIU Red accents on the data points."
