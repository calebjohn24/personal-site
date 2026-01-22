# Scripts

Utility scripts for the personal site.

## generate_og_image.py

Generates Open Graph images for blog posts with a terminal theme aesthetic.

### Usage

```bash
python3 scripts/generate_og_image.py <output_dir> <title> [subtitle] [tagline]
```

### Parameters

- `output_dir` - Directory where the og-image.png will be saved (e.g., `blog/b2cc`)
- `title` - Main title text (large green text)
- `subtitle` - (Optional) Subtitle text (smaller green text)
- `tagline` - (Optional) Bottom tagline with prompt (gray text)

### Example

```bash
# Generate OG image for B2CC blog post
python3 scripts/generate_og_image.py blog/b2cc "B2CC" "Claude Code is Your Customer" "API-first design for AI agents"
```

### Output

- Creates a 1200x630px PNG image (standard OG image size)
- Terminal-style with dark background and green text
- Includes macOS-style window buttons (red, yellow, green)
- Terminal prompt ($) and optional cursor
