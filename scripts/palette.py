from PIL import Image

def open_palette(path):
	palette = Image.open(path)
	color1 = palette.getpixel((0,0))
	color2 = palette.getpixel((palette.width/2, 0))
	color3 = palette.getpixel((0, palette.width/2))
	color4 = palette.getpixel((palette.width/2, palette.width/2))
	return (color1, color2, color3, color4)