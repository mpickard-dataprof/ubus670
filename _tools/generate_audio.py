#!/usr/bin/env python3
"""Generate customer feedback audio files for UBUS 670 Day 4 Lab.

Supports two engines:
  - ElevenLabs (default): Best quality, emotion via audio tags. Requires API key.
  - Edge TTS (fallback):  Free, no API key, decent neural voices.

Usage:
    # ElevenLabs (requires ELEVENLABS_API_KEY):
    python3 generate_audio.py -o "../Week 2/Day 4/web/audio/"

    # Edge TTS fallback (free, no key):
    python3 generate_audio.py --engine edge -o "../Week 2/Day 4/web/audio/"

Requires: pip install elevenlabs   (for ElevenLabs)
          pip install edge-tts     (for Edge TTS)
"""

import argparse
import asyncio
import os
import sys
from pathlib import Path


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


# ── Beacon customer feedback scripts ──────────────────────────────────
# These reference Beacon's competitors (Luxe Home & Style, MarketSquare)
# to maintain cohesion with the competitor ad images in Part 1.

FEEDBACK_SCRIPTS = [
    {
        "name": "customer1_enthusiastic",
        # ElevenLabs config
        "elevenlabs_voice_id": "XrExE9yKIg1WjnnlVkGX",  # Matilda — warm, young, American
        "elevenlabs_settings": {
            "stability": 0.0,       # Creative — most expressive for enthusiasm
            "similarity_boost": 0.75,
            "style": 0.2,
        },
        "elevenlabs_text": (
            "[excited] I absolutely love Beacon's quality. The spring jackets "
            "last year were amazing — I still wear mine. [laughs] But honestly? "
            "The prices have gone up a lot. I used to shop there every month, "
            "now it's more like every few months. My friend started going to "
            "MarketSquare instead because they have similar styles for way less. "
            "[sighs] I wish Beacon had more affordable basics so I didn't have "
            "to choose."
        ),
        # Edge TTS config
        "edge_voice": "en-US-AriaNeural",
        "edge_rate": "+10%",
        "edge_volume": "+5%",
        "edge_text": (
            "I absolutely love Beacon's quality. The spring jackets last year "
            "were amazing — I still wear mine. But honestly? The prices have "
            "gone up a lot. I used to shop there every month, now it's more "
            "like every few months. My friend started going to MarketSquare "
            "instead because they have similar styles for way less. I wish "
            "Beacon had more affordable basics so I didn't have to choose."
        ),
    },
    {
        "name": "customer2_neutral",
        "elevenlabs_voice_id": "nPczCjzI2devNBz1zQrb",  # Brian — deep, middle-aged, American
        "elevenlabs_settings": {
            "stability": 1.0,       # Robust — steady, neutral delivery
            "similarity_boost": 0.80,
            "style": 0.0,
        },
        "elevenlabs_text": (
            "[calm] The store layout is nice, clean, well-organized. I find "
            "what I need quickly. The staff is friendly. [matter-of-fact] But "
            "I noticed they don't have much of an online presence compared to "
            "competitors. I do a lot of shopping online now and their website "
            "feels outdated. Luxe Home and Style has this gorgeous website "
            "where you can see whole room setups — Beacon doesn't do anything "
            "like that. If I can't browse online first, I just end up going "
            "somewhere else."
        ),
        "edge_voice": "en-US-GuyNeural",
        "edge_rate": "+0%",
        "edge_volume": "+0%",
        "edge_text": (
            "The store layout is nice, clean, well-organized. I find what I "
            "need quickly. The staff is friendly. But I noticed they don't "
            "have much of an online presence compared to competitors. I do a "
            "lot of shopping online now and their website feels outdated. "
            "Luxe Home and Style has this gorgeous website where you can see "
            "whole room setups — Beacon doesn't do anything like that. If I "
            "can't browse online first, I just end up going somewhere else."
        ),
    },
    {
        "name": "customer3_frustrated",
        "elevenlabs_voice_id": "pFZP5JQG7iQjIQuC4Bku",  # Lily — raspy, middle-aged, British
        "elevenlabs_settings": {
            "stability": 0.0,       # Creative — allows emotional frustration
            "similarity_boost": 0.70,
            "style": 0.3,
        },
        "elevenlabs_text": (
            "[frustrated] I tried to return something last week and it was "
            "such a hassle. The return policy is confusing — at MarketSquare "
            "you just walk in and they handle it, no questions asked. "
            "[sighs] I love Beacon's products though, especially the "
            "accessories line. The scarves and bags are really unique, way "
            "better quality than what you'd find at MarketSquare. I just wish "
            "the customer service matched the product quality. [disappointed] "
            "And honestly, Luxe Home and Style has better seasonal displays — "
            "Beacon's spring section felt like an afterthought this year."
        ),
        "edge_voice": "en-US-JennyNeural",
        "edge_rate": "-10%",
        "edge_volume": "+5%",
        "edge_text": (
            "I tried to return something last week and it was such a hassle. "
            "The return policy is confusing — at MarketSquare you just walk "
            "in and they handle it, no questions asked. I love Beacon's "
            "products though, especially the accessories line. The scarves "
            "and bags are really unique, way better quality than what you'd "
            "find at MarketSquare. I just wish the customer service matched "
            "the product quality. And honestly, Luxe Home and Style has "
            "better seasonal displays — Beacon's spring section felt like "
            "an afterthought this year."
        ),
    },
]


# ── ElevenLabs engine ─────────────────────────────────────────────────

def generate_elevenlabs(output_dir):
    """Generate audio using ElevenLabs v3 with audio tags for emotion."""
    try:
        from elevenlabs import ElevenLabs, VoiceSettings
    except ImportError:
        print("Error: elevenlabs not installed. Run: pip install elevenlabs")
        sys.exit(1)

    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not set.")
        print("Get a free key at https://elevenlabs.io/app/settings/api-keys")
        sys.exit(1)

    client = ElevenLabs(api_key=api_key)
    os.makedirs(output_dir, exist_ok=True)

    for script in FEEDBACK_SCRIPTS:
        output_path = os.path.join(output_dir, f"{script['name']}.mp3")
        voice_id = script["elevenlabs_voice_id"]
        settings = script["elevenlabs_settings"]

        print(f"Generating {script['name']} (ElevenLabs {voice_id})...")

        audio_generator = client.text_to_speech.convert(
            voice_id=voice_id,
            text=script["elevenlabs_text"],
            model_id="eleven_v3",
            output_format="mp3_44100_128",
            voice_settings=VoiceSettings(
                stability=settings["stability"],
                similarity_boost=settings["similarity_boost"],
                style=settings["style"],
                use_speaker_boost=True,
            ),
        )

        with open(output_path, "wb") as f:
            for chunk in audio_generator:
                f.write(chunk)

        print(f"  Saved: {output_path}")

    print(f"\nDone! {len(FEEDBACK_SCRIPTS)} audio files in {output_dir}/")


# ── Edge TTS engine (fallback) ────────────────────────────────────────

async def _generate_edge(output_dir):
    """Generate audio using Edge TTS (free, no API key)."""
    try:
        import edge_tts
    except ImportError:
        print("Error: edge-tts not installed. Run: pip install edge-tts")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    for script in FEEDBACK_SCRIPTS:
        output_path = os.path.join(output_dir, f"{script['name']}.mp3")
        print(f"Generating {script['name']} (Edge TTS {script['edge_voice']})...")

        communicate = edge_tts.Communicate(
            text=script["edge_text"],
            voice=script["edge_voice"],
            rate=script["edge_rate"],
            volume=script["edge_volume"],
        )
        await communicate.save(output_path)
        print(f"  Saved: {output_path}")

    print(f"\nDone! {len(FEEDBACK_SCRIPTS)} audio files in {output_dir}/")


def generate_edge(output_dir):
    """Wrapper to run async Edge TTS."""
    asyncio.run(_generate_edge(output_dir))


# ── CLI ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate customer feedback audio for UBUS 670 Day 4 Lab."
    )
    parser.add_argument(
        "-o", "--output-dir", default=".",
        help="Output directory for audio files (default: current dir)"
    )
    parser.add_argument(
        "--engine", choices=["elevenlabs", "edge"], default="elevenlabs",
        help="TTS engine: 'elevenlabs' (default, best quality) or 'edge' (free fallback)"
    )

    args = parser.parse_args()

    if args.engine == "elevenlabs":
        generate_elevenlabs(args.output_dir)
    else:
        generate_edge(args.output_dir)
