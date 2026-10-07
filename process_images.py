import os
from PIL import Image

src_dir = r"C:\Users\rjik\.gemini\antigravity\brain\ef2d2c5b-1cb5-4224-a312-f45384d42d82\.user_uploaded"
out_dir = r"C:\Users\rjik\.gemini\antigravity\scratch\samarland-store\assets\clean"
os.makedirs(out_dir, exist_ok=True)

# List of images and custom crops to remove all TikTok UI, text overlays, captions, icons
# Coordinates format: (left_ratio, top_ratio, right_ratio, bottom_ratio)
crops = {
    # Shirts pyramid display: crop top search/status (0.11), right icons (0.86), bottom captions (0.76)
    "media_1791409080091.png": {
        "out": "shirts_display.jpg",
        "box": (0.02, 0.11, 0.86, 0.73)
    },
    # Shoes & Boots display: crop top search/status (0.11), right icons (0.86), bottom captions (0.73)
    "media_1791409099636.png": {
        "out": "shoes_boots.jpg",
        "box": (0.02, 0.11, 0.86, 0.72)
    },
    # Overcoat display
    "media_1791407674075.png": {
        "out": "overcoat.jpg",
        "box": (0.05, 0.13, 0.86, 0.72)
    },
    # Belts display
    "media_1791407733429.png": {
        "out": "belts.jpg",
        "box": (0.02, 0.12, 0.86, 0.78)
    },
    # Neon wall & boutique interior
    "media_1791407720224.png": {
        "out": "neon_interior.jpg",
        "box": (0.02, 0.12, 0.86, 0.78)
    },
    # Storefront facade
    "media_1791407704191.png": {
        "out": "storefront.jpg",
        "box": (0.02, 0.12, 0.86, 0.75)
    },
    # Logo Wall
    "media_1791407772377.png": {
        "out": "logo_wall.jpg",
        "box": (0.04, 0.15, 0.96, 0.68)
    }
}

for filename, config in crops.items():
    file_path = os.path.join(src_dir, filename)
    if os.path.exists(file_path):
        img = Image.open(file_path)
        w, h = img.size
        l, t, r, b = config["box"]
        crop_box = (int(l * w), int(t * h), int(r * w), int(b * h))
        cropped = img.crop(crop_box)
        
        # Convert RGBA to RGB for JPEG
        if cropped.mode in ("RGBA", "P"):
            cropped = cropped.convert("RGB")
            
        out_path = os.path.join(out_dir, config["out"])
        cropped.save(out_path, "JPEG", quality=92)
        print(f"Processed: {filename} -> {config['out']} ({cropped.size})")

print("All images cropped cleanly with zero UI/words!")
