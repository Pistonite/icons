#!/usr/bin/env python3
# Build the icons from source
from PIL import Image
from palette import read_palettes, get_groups, transform_pixel
from iconio import read_icons, read_modifiers, export_icon
from os import scandir, path, makedirs

def build():
	palettes, template = read_palettes()
	icons = read_icons()
	modifiers = read_modifiers()
	# Build each palette
	for palette_name in palettes:
		build_palette(palettes[palette_name], template, icons, modifiers, palette_name)

def build_palette(palette, template, icons, modifiers, palette_name):
	# Build the palette for each group
	if get_groups(palette) == None:
		groups = icons.keys()
	else:
		groups = get_groups(palette)

	for group_name in groups:
		build_palette_for_group(palette, template, icons[group_name], modifiers, palette_name, group_name)

def build_palette_for_group(palette, template, group_icons, modifiers, palette_name, group_name):
	# Build for each icon in group
	for icon_name in group_icons:
		build_images(palette, template, group_icons[icon_name], modifiers, palette_name, group_name, icon_name)

def build_images(palette, template, template_icon, modifiers, palette_name, group_name, icon_name):
	colorized_icon = Image.new('RGBA',(template_icon.width, template_icon.height))
	
	for x in range(template_icon.width):
		for y in range(template_icon.height):
			pixel = template_icon.getpixel((x,y))
			transformed_pixel = transform_pixel(pixel, template, palette)
			colorized_icon.putpixel((x,y), transformed_pixel)

	# No modifier version
	export_icon(colorized_icon, group_name, palette_name, icon_name, "")
	
	# Check if there are modifiers available
	modifier_group = str(template_icon.width)
	if modifier_group in modifiers.keys():
		group_modifiers = modifiers[modifier_group]
		for modifier_name in group_modifiers:
			modifier_icon = group_modifiers[modifier_name]
			colorized_icon_with_modifier = Image.new('RGBA',(template_icon.width, template_icon.height))
			# Color the modifier and apply it to the image
			for x in range(template_icon.width):
				for y in range(template_icon.height):
					pixel = colorized_icon.getpixel((x,y))
					modifier_pixel = modifier_icon.getpixel((x,y))
					if modifier_pixel == (0, 0, 0, 0):
						colorized_icon_with_modifier.putpixel((x,y), pixel)
					else:
						transformed_pixel = transform_pixel(modifier_pixel, template, palette)
						colorized_icon_with_modifier.putpixel((x,y), transformed_pixel)
			export_icon(colorized_icon_with_modifier, group_name, palette_name, icon_name, modifier_name)
	
build()