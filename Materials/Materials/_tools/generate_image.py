#!/usr/bin/env python3
"""Generate teaching images using Nano Banana (Gemini 2.5 Flash Image)."""

import argparse
import os
from google import genai
from google.genai import types


def generate(prompt: str, output_path: str, aspect_ratio: str = "16:9",
             style_prefix: str = ""):
    """Generate a single image and save it."""
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    full_prompt = f"{style_prefix}\n\n{prompt}" if style_prefix else prompt

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

    print("No image generated. Check prompt for content policy violations.")
    return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt", help="Image generation prompt")
    parser.add_argument("-o", "--output", required=True, help="Output file path")
    parser.add_argument("-a", "--aspect-ratio", default="16:9",
                       choices=["1:1", "3:4", "4:3", "9:16", "16:9"])
    parser.add_argument("-s", "--style", default="", help="Style prefix to prepend")
    args = parser.parse_args()
    generate(args.prompt, args.output, args.aspect_ratio, args.style)
