#!/usr/bin/env python3
"""Generate teaching images using Nano Banana (Gemini 2.5 Flash Image)."""

import argparse
import os
import sys
from pathlib import Path
from google import genai
from google.genai import types


def _load_dotenv():
    """Load .env from project root (3 levels up from _tools/)."""
    env_file = Path(__file__).resolve().parent.parent.parent / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip()
        if key and value and key not in os.environ:
            os.environ[key] = value


_load_dotenv()

# Style definitions
STYLES = {
    "educational": (
        "Create a clean, warm, educational illustration in a flat, modern style. "
        "Use a color palette of white, gray, and NIU Red (#C8102E) with soft accents of teal or navy. "
        "Focus on clarity and explaining the concept visually. "
        "No text labels inside the image. "
        "White background. "
        "Style: Professional vector-like illustration, distinct lines, high contrast for readability."
    ),
    "engagement": (
        "Create a visually engaging, warm, professional illustration. "
        "Use a color palette of white, gray, and NIU Red (#C8102E). "
        "Style: Modern editorial illustration, slightly abstract but recognizable, inviting and polished. "
        "Soft lighting, subtle textures. "
        "White or very light gray background."
    ),
    "none": ""
}

def generate(prompt: str, output_path: str, aspect_ratio: str = "16:9",
             preset: str = "educational", style_prefix: str = ""):
    """Generate a single image and save it."""
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    # Combine preset style with user style prefix and prompt
    base_style = STYLES.get(preset, STYLES["educational"])
    
    # Construct the full prompt
    full_prompt = f"{base_style}\n\n{style_prefix}\n\nSUBJECT: {prompt}"
    
    print(f"Generating image with preset '{preset}'...")
    print(f"Prompt: {prompt}")

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=full_prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio,
                ),
            ),
        )

        for part in response.parts:
            if part.inline_data:
                image = part.as_image()
                image.save(output_path)
                print(f"Saved: {output_path}")
                return output_path
        
        print("No image generated. The model might have blocked the prompt due to safety settings.")
        return None

    except Exception as e:
        print(f"Error generating image: {e}")
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate images for UBUS 670 course materials.")
    parser.add_argument("prompt", help="Image generation prompt describing the subject")
    parser.add_argument("-o", "--output", required=True, help="Output file path (e.g., images/slide1.png)")
    parser.add_argument("-a", "--aspect-ratio", default="16:9",
                       choices=["1:1", "3:4", "4:3", "9:16", "16:9"],
                       help="Aspect ratio of the generated image")
    parser.add_argument("-p", "--preset", default="educational",
                       choices=["educational", "engagement", "none"],
                       help="Style preset: 'educational' for clear concepts, 'engagement' for visual appeal")
    parser.add_argument("-s", "--style", default="", help="Additional style instructions to prepend")
    
    args = parser.parse_args()
    generate(args.prompt, args.output, args.aspect_ratio, args.preset, args.style)
