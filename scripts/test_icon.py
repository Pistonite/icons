# Test one combination of colors/images
from PIL import Image
from colorize import combine
from palette import open_palette
from os import path, mkdir

def test(argv):
	if len(argv)<7:
		print("Arguments: icon frame frame_palette center center_palette")
		exit(1)

	if not path.exists("test"):
		mkdir("test")

	icon = argv[2]
	frame = argv[3]
	frame_palette = argv[4]
	center = argv[5]
	center_palette = argv[6]
	frame_image = Image.open(path.join("src","icons",icon,"frame",frame+".png"))
	center_image = Image.open(path.join("src","icons",icon,"center",center+".png"))
	frame_colors = open_palette(path.join("src", "palette",frame_palette+".png"))
	center_colors = open_palette(path.join("src", "palette",center_palette+".png"))
	image = combine(frame_image, frame_colors, center_image, center_colors)
	output = path.join("test", icon+"_"+frame+"_"+center+"_"+frame_palette+"_"+center_palette+".png")
	image.save(output)