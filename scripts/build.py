# Build the icons from source
from PIL import Image
from palette import read_palettes, get_groups, colorize
from iconio import read_icons, export_icon
from os import scandir, path, makedirs

def build(argv):
	palettes, template = read_palettes()
	print(palettes)
	print(template)
	icons = read_icons()
	# Build each palette
	for palette_name in palettes:
		build_palette(palette_name, palettes[palette_name], template, icons)

def build_palette(palette_name, palette, template, icons):
	# Build the palette for each group
	for group in get_groups(palette):
		build_palette_for_group(palette_name, palette, template, group, icons[group])

def build_palette_for_group(palette_name, palette, template, group, group_icons):
	# Build for each icon in group
	for icon_name in group_icons:
		colorized_image = colorize(group_icons[icon_name], template, palette)
		export_icon(colorized_image, group, icon_name, palette_name, "")
	
