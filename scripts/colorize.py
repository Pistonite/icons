# Colorize the template images
from PIL import Image
from palette import open_palette

EMPTY_COLOR, MAJOR_COLOR, MINOR_COLOR, ERASE_COLOR = open_palette("src/palette/template.png")

def combine(frame_image, frame_colorset, center_image, center_colorset):
	frame_colorized = colorize(frame_image, frame_colorset)
	center_colorized = colorize(center_image, center_colorset)
	overlay(frame_colorized, center_colorized)
	return frame_colorized
	
def colorize(image, colorset):
	colorized_image = Image.new('RGBA',(image.width, image.height))
	major = colorset[0]
	minor = colorset[1]
	for x in range(image.width):
		for y in range(image.height):
			pixel = image.getpixel((x,y))
			if pixel == MAJOR_COLOR:
				colorized_image.putpixel((x,y), major)
			elif pixel == MINOR_COLOR:
				colorized_image.putpixel((x,y), minor)
			else:
				colorized_image.putpixel((x,y), pixel)
	return colorized_image

def overlay(frame_image, center_image):
	for x in range(frame_image.width):
		for y in range(frame_image.height):
			pixel = center_image.getpixel((x,y))
			if pixel == ERASE_COLOR:
				frame_image.putpixel((x,y), EMPTY_COLOR)
			elif not is_empty_color(pixel):
				frame_image.putpixel((x,y), pixel)
	
def is_empty_color(pixel):
	return pixel == EMPTY_COLOR or pixel[3]==0


