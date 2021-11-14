# Colorize the template images
from PIL import Image
from palette import transform_pixel

def colorize(template_image, template, palette):
	colorized_image = Image.new('RGBA',(template_image.width, template_image.height))
	for x in range(template_image.width):
		for y in range(template_image.height):
			pixel = template_image.getpixel((x,y))
			transformed_pixel = transform_pixel(pixel, template, palette)
			colorized_image.putpixel((x,y), transformed_pixel)
	return colorized_image

