import os
from PIL import Image, ImageDraw

def add_rounded_corners(input_path, output_path, radius):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return

    print(f"Processing {input_path}...")
    with Image.open(input_path) as im:
        width, height = im.size
        
        # Create mask
        mask = Image.new('L', (width, height), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, width, height), radius, fill=255)
        
        frames = []
        try:
            for i in range(im.n_frames):
                im.seek(i)
                # Ensure we have a clean RGBA frame
                frame = im.convert('RGBA')
                
                # Apply mask: anything outside the mask becomes transparent
                new_frame = Image.new('RGBA', (width, height), (0, 0, 0, 0))
                # Paste the original frame through the mask
                new_frame.paste(frame, (0, 0), mask=mask)
                
                frames.append(new_frame)
        except EOFError:
            pass

        if frames:
            # Save the new GIF
            # Disposal=2 (restore to background) is critical for transparency to work correctly between frames
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                duration=im.info.get('duration', 40),
                loop=im.info.get('loop', 0),
                disposal=2,
                optimize=False
            )
            print(f"Rounded GIF saved to: {output_path}")

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(script_dir))
input_gif = os.path.join(project_root, "assets", "images", "banner.gif")
output_gif = os.path.join(project_root, "assets", "images", "banner.gif")

add_rounded_corners(input_gif, output_gif, 40)
