#!/usr/bin/env python3
"""
Generate Open Graph images for blog posts with terminal theme
Usage: python3 generate_og_image.py <output_dir> <title> [subtitle] [tagline]
Example: python3 generate_og_image.py blog/b2cc "B2CC" "Claude Code is Your Customer" "API-first design for AI agents"
"""

from PIL import Image, ImageDraw, ImageFont
import sys
import os

# OG image standard size
WIDTH = 1200
HEIGHT = 630

# Terminal color scheme
BG_COLOR = '#1a1a1a'  # Dark background
TEXT_COLOR = '#00ff00'  # Green terminal text
ACCENT_COLOR = '#00cc00'  # Slightly darker green
GRAY_COLOR = '#666666'  # Gray for secondary text

def wrap_text(text, font, max_width):
    """Wrap text to fit within max_width"""
    words = text.split()
    lines = []
    current_line = []

    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = font.getbbox(test_line)
        width = bbox[2] - bbox[0]

        if width <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                lines.append(word)

    if current_line:
        lines.append(' '.join(current_line))

    return lines

def generate_og_image(output_dir, title, subtitle="", tagline=""):
    """Generate an OG image with terminal styling"""

    # Create image
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Try to use a monospace font, fallback to default
    try:
        # Try common monospace fonts on macOS
        title_font = ImageFont.truetype('/System/Library/Fonts/Monaco.ttf', 120)
        subtitle_font = ImageFont.truetype('/System/Library/Fonts/Monaco.ttf', 48)
        body_font = ImageFont.truetype('/System/Library/Fonts/Monaco.ttf', 32)
    except:
        try:
            title_font = ImageFont.truetype('/System/Library/Fonts/Courier.dfont', 120)
            subtitle_font = ImageFont.truetype('/System/Library/Fonts/Courier.dfont', 48)
            body_font = ImageFont.truetype('/System/Library/Fonts/Courier.dfont', 32)
        except:
            # Fallback to default font
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            body_font = ImageFont.load_default()

    # Draw decorative lines (terminal window style)
    line_color = GRAY_COLOR
    draw.rectangle([0, 0, WIDTH, 5], fill=line_color)  # Top border
    draw.rectangle([0, HEIGHT-5, WIDTH, HEIGHT], fill=line_color)  # Bottom border

    # Add small circles (terminal window buttons) in top left
    circle_y = 25
    for i, color in enumerate(['#ff5f56', '#ffbd2e', '#27c93f']):
        circle_x = 40 + (i * 50)
        draw.ellipse([circle_x-15, circle_y-15, circle_x+15, circle_y+15], fill=color)

    # Draw terminal prompt
    prompt_y = 80
    draw.text((80, prompt_y), '$', fill=TEXT_COLOR, font=subtitle_font)

    # Draw title
    title_y = 180
    draw.text((80, title_y), title, fill=TEXT_COLOR, font=title_font)

    # Draw subtitle if provided
    if subtitle:
        subtitle_y = 330
        max_width = WIDTH - 160  # Leave margin on both sides
        subtitle_lines = wrap_text(subtitle, subtitle_font, max_width)

        for i, line in enumerate(subtitle_lines):
            line_y = subtitle_y + (i * 60)  # 60px line spacing
            draw.text((80, line_y), line, fill=ACCENT_COLOR, font=subtitle_font)

    # Draw tagline if provided
    if tagline:
        bottom_y = 480
        draw.text((80, bottom_y), f'> {tagline}', fill=GRAY_COLOR, font=body_font)

        # Draw cursor/blink
        cursor_x = 80 + draw.textlength(f'> {tagline}', font=body_font)
        draw.rectangle([cursor_x + 10, bottom_y, cursor_x + 30, bottom_y + 32], fill=TEXT_COLOR)

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Save the image
    output_path = os.path.join(output_dir, 'og-image.png')
    img.save(output_path, 'PNG', quality=95)
    print(f'✓ OG image saved to {output_path}')

    return output_path

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    output_dir = sys.argv[1]
    title = sys.argv[2]
    subtitle = sys.argv[3] if len(sys.argv) > 3 else ""
    tagline = sys.argv[4] if len(sys.argv) > 4 else ""

    generate_og_image(output_dir, title, subtitle, tagline)
