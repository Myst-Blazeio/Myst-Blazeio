import os
from PIL import Image, ImageDraw

def add_rounded_corners(input_path, output_path, radius):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return

    print(f"Processing {input_path}...")
    with Image.open(input_path) as im:
        frames = []
        durations = []
        
        # Create mask
        width, height = im.size
        mask = Image.new('L', (width, height), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, width, height), radius, fill=255)
        
        try:
            while True:
                # Convert frame to RGBA
                frame = im.convert('RGBA')
                
                # Apply mask to alpha channel
                new_frame = Image.new('RGBA', (width, height), (0, 0, 0, 0))
                new_frame.paste(frame, (0, 0), mask=mask)
                
                frames.append(new_frame)
                durations.append(im.info.get('duration', 40)) 
                
                if im.n_frames == 1:
                    break
                im.seek(im.tell() + 1)
        except EOFError:
            pass

        if frames:
            # Save the new GIF
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                duration=durations,
                loop=im.info.get('loop', 0),
                disposal=2,
                transparency=0
            )
            print(f"Rounded GIF saved to: {output_path}")

# Construct paths relative to the script location or use absolute paths correctly
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(script_dir))
input_gif = os.path.join(project_root, "assets", "images", "banner.gif")
output_gif = os.path.join(project_root, "assets", "images", "banner.gif") # Overwrite

add_rounded_corners(input_gif, output_gif, 40) # Increased radius for visible curve
