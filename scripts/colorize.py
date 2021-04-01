# Colorize the template images
from PIL import Image
from palette import open_palette

BG_MAJOR_TEMPLATE, BG_MINOR_TEMPLATE, FG_MAJOR_TEMPLATE, FG_MINOR_TEMPLATE = open_palette("src/palette/template.png")

def colorize(image, bg_palette, fg_palette):
	colorized_image = Image.new('RGBA',(image.width, image.height))
	bg_major = bg_palette[0]
	bg_minor = bg_palette[1]
	fg_major = fg_palette[0]
	fg_minor = fg_palette[1]
	for x in range(image.width):
		for y in range(image.height):
			pixel = image.getpixel((x,y))
			if pixel == BG_MAJOR_TEMPLATE:
				colorized_image.putpixel((x,y), bg_major)
			elif pixel == BG_MINOR_TEMPLATE:
				colorized_image.putpixel((x,y), bg_minor)
			elif pixel == FG_MAJOR_TEMPLATE:
				colorized_image.putpixel((x,y), fg_major)
			elif pixel == FG_MINOR_TEMPLATE:
				colorized_image.putpixel((x,y), fg_minor)
			else:
				colorized_image.putpixel((x,y), pixel)
	return colorized_image
