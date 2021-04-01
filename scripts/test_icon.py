# Test one combination of colors/images
from PIL import Image
from colorize import colorize
from palette import open_palette
from os import path, mkdir

def test(argv):
	if len(argv)<6:
		print("Arguments: folder icon bg_palette fg_palette")
		exit(1)

	if not path.exists("test"):
		mkdir("test")

	icon = argv[2]
	image_name = argv[3]
	bg_palette_name = argv[4]
	fg_palette_name = argv[5]

	image = Image.open(path.join("src","icons",icon,image_name+".png"))
	bg_palette = open_palette(path.join("src", "palette",bg_palette_name+".png"))
	fg_palette = open_palette(path.join("src", "palette",fg_palette_name+".png"))
	image = colorize(image, bg_palette, fg_palette)
	output = path.join("test", icon+"_"+image_name+"_"+bg_palette_name+"_"+fg_palette_name+".png")
	image.save(output)