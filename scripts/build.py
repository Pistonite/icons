# Build the icons from source
from PIL import Image
from colorize import colorize
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
	named_images = open_named_images(icon_dir.path)

	save_dir = path.join("build",icon_dir.name)
	fg_dir_format = "fg_{fg_name}"
	bg_dir_format = "bg_{bg_name}"


	if not path.exists(save_dir):
		makedirs(save_dir)

	for image_name, image in named_images:
		for bg_name, bg_palette in named_palettes:
			bg_dir = bg_dir_format.format(bg_name = bg_name)
			for fg_name, fg_palette in named_palettes:
				fg_dir = fg_dir_format.format(fg_name = fg_name)
				print("Building:",icon_dir.name,fg_dir,bg_dir,image_name)
				colorized_image = colorize(image, bg_palette, fg_palette)
				dir = path.join(save_dir,fg_dir, bg_dir)

				if not path.exists(dir):
					makedirs(dir)
				colorized_image.save(path.join(dir, image_name+".png"))


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