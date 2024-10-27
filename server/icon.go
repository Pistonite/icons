package main

import (
	"bufio"
	"bytes"
	"fmt"
	"image"
	"image/png"
	"os"
)

// size of the output icon (64x64 pixels)
const SIZE = 64

// pixel type
const (
	// transparent pixel
	PX_TRANSPARENT = 0
	// frame outline pixel
	PX_FRAME_OUTLINE = 1
	// frame fill pixel
	PX_FRAME_FILL = 2
	// center outline pixel
	PX_CENTER_OUTLINE = 3
	// center fill pixel
	PX_CENTER_FILL = 4
	// modifier outline pixel
	PX_MOD_OUTLINE = 5
	// modifier fill pixel
	PX_MOD_FILL = 6
)

// icon data
type Icon struct {
	data [SIZE][SIZE]byte
}

// add an overlay to the icon
func (self *Icon) AddOverlay(overlay *Icon) {
	for x := range SIZE {
		for y := range SIZE {
			overlayPixel := overlay.data[x][y]
			if overlayPixel == PX_TRANSPARENT {
				continue
			}
			self.data[x][y] = overlayPixel
		}
	}
}

// color the icon with the palette, and encode it as png
func (self *Icon) EncodeWithPalette(palette *Palette) ([]byte, error) {
	img := image.NewRGBA(image.Rect(0, 0, SIZE, SIZE))
	for x := range SIZE {
		for y := range SIZE {
			pxType := self.data[x][y]
			if pxType == PX_TRANSPARENT {
				continue
			}
			img.Set(x, y, palette.ColorFor(pxType))
		}
	}

	var buf bytes.Buffer

	err := png.Encode(&buf, img)
	if err != nil {
		return nil, fmt.Errorf("error encoding icon: %s", err.Error())
	}
	return buf.Bytes(), nil
}

// load an icon from path
func LoadIcon(path string) (*Icon, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("error loading icon %s: %s", path, err.Error())
	}
	defer file.Close()

	reader := bufio.NewReader(file)
	img, format, err := image.Decode(reader)
	if err != nil {
		return nil, fmt.Errorf("error decoding icon %s: %s", path, err.Error())
	}

	if format != "png" {
		return nil, fmt.Errorf("unexpected format for icon %s: expected png, got %s", path, format)
	}

	bounds := img.Bounds()
	if bounds.Min.X != 0 || bounds.Min.Y != 0 || bounds.Max.X != SIZE || bounds.Max.Y != SIZE {
		return nil, fmt.Errorf("unexpected bounds for icon: %s: (%d, %d, %d, %d)", path, bounds.Min.X, bounds.Min.Y, bounds.Max.X, bounds.Max.Y)
	}

	var data [SIZE][SIZE]byte
	for x := range SIZE {
		for y := range SIZE {
			r, g, b, a := img.At(x, y).RGBA()
			if a == 0 {
				continue
			}
			r >>= 8
			g >>= 8
			b >>= 8
			color := (r << 16) | (g << 8) | b
			switch color {
			case 0x008000:
				data[x][y] = PX_FRAME_OUTLINE
			case 0xd93600:
				data[x][y] = PX_FRAME_FILL
			case 0x000000:
				data[x][y] = PX_CENTER_OUTLINE
			case 0x808080:
				data[x][y] = PX_CENTER_FILL
			case 0x0000ff:
				data[x][y] = PX_MOD_OUTLINE
			case 0xfdfdfd:
				data[x][y] = PX_MOD_FILL
			}
		}
	}

	return &Icon{data}, nil
}
