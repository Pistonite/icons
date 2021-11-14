from PIL import Image
import json

def open_palette(path):
	palette = Image.open(path)
	color1 = palette.getpixel((0,0))
	color2 = palette.getpixel((palette.width/2, 0))
	color3 = palette.getpixel((0, palette.width/2))
	color4 = palette.getpixel((palette.width/2, palette.width/2))
	return (color1, color2, color3, color4)

PALETTE_CONFIG = "src/palettes.json"
KEY_BACKGROUND = "background"
KEY_FOREGROUND = "foreground"
KEY_MODIFIER = "modifier"
KEY_OUTLINE = "outline"
KEY_FILL = "fill"
KEY_GROUPS = "groups"

def read_palettes():
	config_file = open(PALETTE_CONFIG)
	config = json.load(config_file)
	# Parse Colors
	colors = {}
	config_colors = config["colors"]
	for color_name in config_colors:
		colors[color_name] = parse_color(config_colors[color_name])
	
	# Parse Palettes
	palettes = {}
	config_palettes = config["palettes"]
	for palette_name in config_palettes:
		palettes[palette_name] = parse_palette(config_palettes[palette_name], colors)

	# Parse Template
	config_template = config["template"]
	config_template_background = get_background(config_template)
	config_template_foreground = get_foreground(config_template)
	config_template_modifier = get_modifier(config_template)
	template = {
		KEY_BACKGROUND: parse_color(config_template_background),
		KEY_FOREGROUND: parse_color(config_template_foreground),
		KEY_MODIFIER:   parse_color(config_template_modifier)
	}
	
	return (palettes, template)

def parse_color(color):
	return {
		KEY_OUTLINE: str_to_tuple(get_outline(color)),
		KEY_FILL:    str_to_tuple(get_fill(color))
	}

def str_to_tuple(color_str):
	r = int(color_str[0:2], 16)
	g = int(color_str[2:4], 16)
	b = int(color_str[4:6], 16)
	return (r, g, b, 255)

def parse_palette(palette_raw, colors):
	return {
		KEY_BACKGROUND: colors[get_background(palette_raw)],
		KEY_FOREGROUND: colors[get_foreground(palette_raw)],
		KEY_MODIFIER:   colors[get_modifier(palette_raw)],
		KEY_GROUPS:     get_groups(palette_raw)
	}

# Getters
def get_outline(obj):
	return obj[KEY_OUTLINE]
def get_fill(obj):
	return obj[KEY_FILL]
def get_background(obj):
	return obj[KEY_BACKGROUND]
def get_foreground(obj):
	return obj[KEY_FOREGROUND]
def get_modifier(obj):
	return obj[KEY_MODIFIER]
def get_groups(obj):
	return obj[KEY_GROUPS]


def colorize(template_image, template, palette):
	colorized_image = Image.new('RGBA',(template_image.width, template_image.height))
	for x in range(template_image.width):
		for y in range(template_image.height):
			pixel = template_image.getpixel((x,y))
			transformed_pixel = transform_pixel(pixel, template, palette)
			colorized_image.putpixel((x,y), transformed_pixel)
	return colorized_image

def transform_pixel(original_pixel, template, palette):
	if original_pixel == get_outline(get_background(template)):
		return get_outline(get_background(palette))
	elif original_pixel == get_fill(get_background(template)):
		return get_fill(get_background(palette))
	elif original_pixel == get_outline(get_foreground(template)):
		return get_outline(get_foreground(palette))
	elif original_pixel == get_fill(get_foreground(template)):
		return get_fill(get_foreground(palette))
	elif original_pixel == get_outline(get_modifier(template)):
		return get_outline(get_modifier(palette))
	else:
		return original_pixel
