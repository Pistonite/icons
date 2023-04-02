"""
Icon Service
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import os
import io
import yaml
import numpy as np
import sys
import json



# Constants
PALETTE_CONFIG = "service/palettes.yaml"
CACHE_DAYS = 1
CACHE_SECONDS = CACHE_DAYS * 24 * 60 * 60
HEADERS = {
    "Cache-Control": f"public, max-age={CACHE_SECONDS}",
    "Expires": f"{CACHE_SECONDS}"
}

PIXEL_TRANSPARENT = 0
PIXEL_BG_OUTLINE =  1
PIXEL_BG_FILL =     2
PIXEL_FG_OUTLINE =  3
PIXEL_FG_FILL =     4
PIXEL_MOD_OUTLINE = 5
PIXEL_MOD_FILL =    6
PIXEL_TYPE_COUNT =  7

# Color & Palette
def color_hex_to_tuple(color_hex):
    """Converts a hex color (ffffff) to a tuple of RGB values"""
    r = int(color_hex[0:2], 16)
    g = int(color_hex[2:4], 16)
    b = int(color_hex[4:6], 16)
    return (r, g, b)


def create_palette(
    bg_outline_hex,
    bg_fill_hex,
    fg_outline_hex,
    fg_fill_hex,
    mod_outline_hex,
    mod_fill_hex
):
    """Creates a palette from hex colors"""
    return [
        (0, 0, 0, 0),
        color_hex_to_tuple(bg_outline_hex),
        color_hex_to_tuple(bg_fill_hex),
        color_hex_to_tuple(fg_outline_hex),
        color_hex_to_tuple(fg_fill_hex),
        color_hex_to_tuple(mod_outline_hex),
        color_hex_to_tuple(mod_fill_hex),
    ]


# Icon IO
class Icon:
    data: np.ndarray
    size: int
    def __init__(self, data, size):
        self.data = data
        self.size = size

    def add_overlay(self, other):
        size = min(self.size, other.size)
        for x in range(size):
            for y in range(size):
                if other.data[x][y] != PIXEL_TRANSPARENT:
                    self.data[x][y] = other.data[x][y]

    def copy(self):
        return Icon(self.data.copy(), self.size)
    
    def load(image_path, template_palette):
        image = Image.open(image_path)
        size = min(image.width, image.height)
        data = np.zeros((size, size), dtype=np.uint8)
        for x in range(size):
            for y in range(size):
                r,g,b,a = image.getpixel((x,y))
                if a == 0:
                    continue
                
                pixel = (r,g,b)
                # 0 is always transparent, so we start at 1
                for i in range(1, PIXEL_TYPE_COUNT):
                    if pixel == template_palette[i]:
                        data[x][y] = i
                        break
        return Icon(data, size)
    
    def colorize(self, palette):
        image = Image.new('RGBA',(self.size, self.size))
        for x in range(self.size):
            for y in range(self.size):
                pixel = self.data[x][y]
                image.putpixel((x,y), palette[pixel])
        return image

def read_icon_dir(icons_dir, template_palette):
    icons = {}
    names = {}
    for group in os.listdir(icons_dir):
        group_path = os.path.join(icons_dir, group)
        if os.path.isdir(group_path):
            group_icons, group_names = read_icon_group(group_path, template_palette)
            icons[group] = group_icons
            names[group] = group_names
    return icons, names

# Returns dictionary icon_name -> image
def read_icon_group(group_path, template_palette):
    images = {}
    names = []
    for sub_path in os.listdir(group_path):
        image_path = os.path.join(group_path, sub_path)
        if os.path.isfile(image_path):
            icon_id = os.path.splitext(sub_path)[0]
            image = Icon.load(image_path, template_palette)
            images[icon_id] = image
            names.append(icon_id)
    return images, names


class IconService:
    # Colors (name -> (outline_hex, fill_hex)
    colors = {}
    # Palettes (name -> {bg, fg, mod})
    palette_colors = {}
    # Palette Values (name -> palette)
    palettes = {}
    template_palette = None
    # Icons (group -> (name -> image))
    template_icons = {}
    # Icon Names (group -> [name])
    icon_names = {}
    template_modifiers = {}
    

    def load(self):
        # Load palette config
        self.load_palette_config()
        
        # Load template icons
        self.template_icons, self.icon_names = read_icon_dir(os.path.join("srcimg", "icons"), self.template_palette)
        self.template_modifiers, _ = read_icon_dir(os.path.join("srcimg", "modifiers"), self.template_palette)

    def load_palette_config(self):
        with open(PALETTE_CONFIG, "r", encoding="utf-8") as f:
            config = yaml.load(f, yaml.Loader)
        # Parse Colors
        config_colors: dict = config["colors"]
        for color_name, color_data in config_colors.items():
            self.colors[color_name] = (color_data["outline"], color_data["fill"])
        # Parse Palettes
        config_palettes: dict = config["palettes"]
        for palette_name, palette_data in config_palettes.items():
            bg_color = self.colors[palette_data["bg"]]
            fg_color = self.colors[palette_data["fg"]]
            mod_color = self.colors[palette_data["mod"]]
            self.palettes[palette_name] = create_palette(bg_color[0], bg_color[1], fg_color[0], fg_color[1], mod_color[0], mod_color[1])
            self.palette_colors[palette_name] = palette_data
        # Parse Template Palette
        config_template_palette: dict = config["template"]
        self.template_palette = create_palette(
            config_template_palette["bg"]["outline"],
            config_template_palette["bg"]["fill"],
            config_template_palette["fg"]["outline"],
            config_template_palette["fg"]["fill"],
            config_template_palette["mod"]["outline"],
            config_template_palette["mod"]["fill"],
        )
    
    def get_icon_with_predefined_color(
        self,
        icon_group,
        icon_id,
        bg_color_id,
        fg_color_id,
        mod_color_id,
        modifier_id
    ):
        if not bg_color_id in self.colors:
            return None
        if not fg_color_id in self.colors:
            return None
        if not mod_color_id in self.colors:
            return None
        return self.get_icon(
            icon_group,
            icon_id,
            self.colors[bg_color_id][0],
            self.colors[bg_color_id][1],
            self.colors[fg_color_id][0],
            self.colors[fg_color_id][1],
            self.colors[mod_color_id][0],
            self.colors[mod_color_id][1],
            modifier_id
        )

    def get_icon(
        self,
        icon_group,
        icon_id,
        bg_outline_hex,
        bg_fill_hex,
        fg_outline_hex,
        fg_fill_hex,
        mod_outline_hex,
        mod_fill_hex,
        modifier_id
    ):
        if not icon_group in self.template_icons:
            return None
        if not icon_id in self.template_icons[icon_group]:
            return None
        icon = self.template_icons[icon_group][icon_id].copy()

        if modifier_id != "none":
            size_key = str(icon.size)
            if not size_key in self.template_modifiers:
                return None
            if not modifier_id in self.template_modifiers[size_key]:
                return None
            icon.add_overlay(self.template_modifiers[size_key][modifier_id])
        color = create_palette(bg_outline_hex, bg_fill_hex, fg_outline_hex, fg_fill_hex, mod_outline_hex, mod_fill_hex)
        return icon.colorize(color)

# Build Script
# This will build static assets and store them in build/img/{icon_group}.{icon_id}.{palette_id}.{modifier_id}.png
# This should come before `npm run build`
def build_icon(task):
    icon_group, icon_id, palette_id, palette, template_palette, modifier_id = task
    
    icon_path = os.path.join("srcimg", "icons", icon_group, icon_id + ".png")
    icon = Icon.load(icon_path, template_palette)
    if modifier_id != "none":
        modifier_path = os.path.join("srcimg", "modifiers", str(icon.size), modifier_id + ".png")
        icon.add_overlay(Icon.load(modifier_path, template_palette))
                    
    image = icon.colorize(palette)
    output_dir = os.path.join("public", "img", )
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join("public", "img", f"{icon_group}.{icon_id}.{palette_id}.{modifier_id}.png")
    image.save(output_path)
    print(output_path)

if __name__ == "__main__":
    import multiprocessing
    if not sys.argv[0].endswith(("service/main.py", "service\\main.py")):
        print("Please run this script from the root directory of the project.")
        sys.exit(1)
    service = IconService()
    service.load()
    
    os.makedirs(os.path.join("public", "img"), exist_ok=True)
    modifiers = [ "none" ] + [ os.path.splitext(x)[0] for x in os.listdir(os.path.join("srcimg", "modifiers", "64")) ]
    tasks = []
    for icon_group in service.template_icons:
        for icon_id in service.template_icons[icon_group]:
            icon_template = service.template_icons[icon_group][icon_id]
            size_key = str(icon_template.size)
            for modifier_id in modifiers:
                if modifier_id != "none":
                    if size_key not in service.template_modifiers:
                        break # no need to check the rest of the modifiers
                for palette_id, palette in service.palettes.items():
                    tasks.append((icon_group, icon_id, palette_id, palette, service.template_palette, modifier_id))
                    
    with multiprocessing.Pool() as pool:
        for _ in pool.imap_unordered(build_icon, tasks):
            pass
    
    sys.exit(0)

# Web Server

app = FastAPI()

if os.environ.get("LOCAL_DEV", False):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
    )

service = IconService()
# Initialization
@app.on_event("startup")
def init_app():
    service.load()

def image_response(image):
    if not image:
        raise HTTPException(status_code=404, detail="Not Found")
    # save image to a bytes buffer
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')

    # return image as StreamingResponse
    return StreamingResponse(io.BytesIO(img_byte_arr.getvalue()), media_type="image/png", headers=HEADERS)

@app.get("/palette/{icon_group}.{icon_id}.{bg_color_id}.{fg_color_id}.{mod_color_id}.{modifier_id}.png")
async def get_image_with_custom_palette(
    icon_group: str,
    icon_id: str,
    bg_color_id: str,
    fg_color_id: str,
    mod_color_id: str,
    modifier_id: str
):
    return image_response(service.get_icon_with_predefined_color(
        icon_group.lower(),
        icon_id.lower(),
        bg_color_id.lower(),
        fg_color_id.lower(),
        mod_color_id.lower(),
        modifier_id.lower()
    ))

@app.get("/color/{icon_group}.{icon_id}.{bg_outline_hex}.{bg_fill_hex}.{fg_outline_hex}.{fg_fill_hex}.{mod_outline_hex}.{mod_fill_hex}.{modifier_id}.png")
async def get_image_with_custom_color(
    icon_group: str,
    icon_id: str,
    bg_outline_hex: str,
    bg_fill_hex: str,
    fg_outline_hex: str,
    fg_fill_hex: str,
    mod_outline_hex: str,
    mod_fill_hex: str,
    modifier_id: str
):
    return image_response(service.get_icon(
        icon_group.lower(),
        icon_id.lower(),
        bg_outline_hex.lower(),
        bg_fill_hex.lower(),
        fg_outline_hex.lower(),
        fg_fill_hex.lower(),
        mod_outline_hex.lower(),
        mod_fill_hex.lower(),
        modifier_id.lower()
    ))

@app.get("/icons")
async def get_icons():
    return Response(content=json.dumps(service.icon_names), headers=HEADERS)

@app.get("/palettes")
async def get_icons():
    return Response(content=json.dumps(service.palette_colors), headers=HEADERS)

@app.get("/colors")
async def get_icons():
    return Response(content=json.dumps(service.colors), headers=HEADERS)

app.mount("/", StaticFiles(directory="build", html=True), name="static")
