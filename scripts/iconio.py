# Read the source icons
from PIL import Image
from os import scandir, path, makedirs

def read_icons():
	return read_icon_dir("icons")

def read_modifiers():
	return read_icon_dir("modifiers")

def read_icon_dir(directory):
	# Create empty dictionary
	icons = {}
	icons_dir = path.join("src", directory)
	groups = scandir(icons_dir)
	for group in groups:
		if group.is_dir:
			group_images = read_icon_group(group.path, group.name)
			icons[group.name] = group_images
	return icons

# Returns dictionary icon_name => image
def read_icon_group(group_path, group_name):
	images = {}
	files = scandir(group_path)
	for file in files:
		if file.is_file:
			print("Reading", group_name, "/", file.name)
			image = Image.open(file.path)
			images[remove_extension(file.name)] = image
	return images

def remove_extension(filename):
	return path.splitext(filename)[0]

def export_icon(image, group, palette, icon, modifier):
	print("Exporting", palette, ":", group, "/", icon, "(", modifier, ")")
	icon_name = icon + "_" + palette + "_" + modifier + ".png"
	icon_dir = path.join("build", group, icon)
    
	if not path.exists(icon_dir):
		makedirs(icon_dir)

	icon_path = path.join("build", group, icon, icon_name)
	image.save(icon_path)

