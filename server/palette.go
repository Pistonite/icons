package main

import (
	"image/color"
	"fmt"
	"strconv"
)

// palette data
type Palette struct {
    colors [6]color.Color
}

// create a new palette from string parts
//
// The string should 6 RGB strings,
// each string should be 6 digits without the 0x prefix
func NewPalette(parts []string) (*Palette, error) {
    if len(parts) != 6 {
        return nil, fmt.Errorf("invalid palette, need 6 colors")
    }
    var colors [6]color.Color
    for i, part := range parts {
        rgb, err := strconv.ParseInt(part, 16, 32)
        if err != nil {
            return nil, fmt.Errorf("invalid color: %s: %s", part, err.Error())
        }
        var r uint8 = uint8((rgb >> 16) & 0xff)
        var g uint8 = uint8((rgb >> 8) & 0xff)
        var b uint8 = uint8(rgb & 0xff)
        colors[i] = color.RGBA{
            R: r,
            G: g,
            B: b,
            A: 0xff,
        }
    }
    return &Palette { colors }, nil
}

func (self *Palette) ColorFor(pxType byte) color.Color {
    return self.colors[pxType-1]
}
