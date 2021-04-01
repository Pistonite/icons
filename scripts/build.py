# Build the icons from source
from PIL import Image
from colorize import combine
from palette import open_palette
from os import scandir, path, makedirs

TEMPLATE_PALETTE = "template.png"

def build(argv):
	named_palettes = read_named_palettes()
	icons_directories = scandir(path.join("src","icons"))
	for icon_dir in icons_directories:
		if not icon_dir.is_dir:
			print("Error:", icon_dir, "is not an icon directory")
			exit(1)
		build_icon_dir(icon_dir, named_palettes)
	
	
def build_icon_dir(icon_dir, named_palettes):
	center_named_images = open_named_images(path.join(icon_dir.path, "center"))
	frame_named_images = open_named_images(path.join(icon_dir.path, "frame"))
	save_dir = path.join("build",icon_dir.name)
	center_color_dir_format = "center_{center_color_name}"
	frame_color_dir_format = "frame_{frame_color_name}"
	name_format = "{center_name}_{frame_name}.png"

	if not path.exists(save_dir):
		makedirs(save_dir)

	for center_name, center_image in center_named_images:
		for frame_name, frame_image in frame_named_images:
			for frame_color_name, frame_colorset in named_palettes:
				for center_color_name, center_colorset in named_palettes:
					image = combine(frame_image, frame_colorset, center_image, center_colorset)

					name = name_format.format(
						center_name = center_name,
						frame_name = frame_name,
					)
					center_dir = center_color_dir_format.format(center_color_name = center_color_name)
					frame_dir = frame_color_dir_format.format(frame_color_name = frame_color_name)
					print("Building:",icon_dir.name,center_dir,frame_dir,name)
					dir = path.join(save_dir,center_dir, frame_dir)
					if not path.exists(dir):
						makedirs(dir)
					image.save(path.join(dir, name))


def open_named_images(dir):
	files = scandir(dir)
	named_images = []
	for file in files:
		if file.is_file:
			image = Image.open(file.path)
			named_images.append((remove_extension(file.name), image))
	return named_images
		
def read_named_palettes():
	palette_files = scandir("src/palette")
	palettes = []
	for palette_file in palette_files:
		if palette_file.name != TEMPLATE_PALETTE:
			palette = open_palette(palette_file.path)
			palettes.append((remove_extension(palette_file.name), palette))
	return palettes

def remove_extension(filename):
	return path.splitext(filename)[0]