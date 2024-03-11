import { IColor, getColorFromString } from "@fluentui/react";

const defineColor = (
    outlineHexString: string,
    fillHexString: string,
): ColorDef => {
    return {
        outline: getColorFromString(`#${outlineHexString}`) as IColor,
        fill: getColorFromString(`#${fillHexString}`) as IColor,
    };
};

export const toDisplayName = (name: string): string => {
    return name.replace(/([A-Z])/g, " $1").trim();
};

export type ColorDef = {
    outline: IColor;
    fill: IColor;
};

export const Colors = {
    StandardBlue: defineColor("69a2d5", "c1fefe"),
    StandardOrange: defineColor("8c5e28", "ffffb5"),
    StandardGreen: defineColor("568c28", "c8e6af"),
    StandardPink: defineColor("d57b69", "fec1d3"),
    StandardPurple: defineColor("613b75", "b96cf5"),
    StandardGray: defineColor("333333", "eeeeee"),
    MalicePurple: defineColor("f24c99", "ffc0fa"),
    DeepOrange: defineColor("8c5e28", "ff9900"),
    MedohGreen: defineColor("568c28", "fdfdfd"),
    NaborisOrange: defineColor("8c5e28", "fdfdfd"),
    RutaBlue: defineColor("69a2d5", "fdfdfd"),
    RudaniaRed: defineColor("d57b69", "fdfdfd"),
    LightGold: defineColor("cfa240", "ffd700"),
    DarkGold: defineColor("cfa240", "000000"),
    UltraRed: defineColor("633830", "f0673a"),
    FuseBlue: defineColor("2a767d", "59ffff"),
} as const;

export type ColorName = keyof typeof Colors;

export type PaletteDef = {
    frame: ColorName | ColorDef;
    center: ColorName | ColorDef;
    modifier: ColorName | ColorDef;
};

export const Palettes = {
    StandardBlue: {
        frame: "StandardBlue",
        center: "StandardBlue",
        modifier: "StandardBlue",
    },
    StandardOrange: {
        frame: "StandardOrange",
        center: "StandardOrange",
        modifier: "StandardOrange",
    },
    Incomplete: {
        frame: "StandardBlue",
        center: "StandardOrange",
        modifier: "StandardOrange",
    },
    StandardGreen: {
        frame: "StandardGreen",
        center: "StandardGreen",
        modifier: "StandardGreen",
    },
    StandardPink: {
        frame: "StandardPink",
        center: "StandardPink",
        modifier: "StandardPink",
    },
    StandardPurple: {
        frame: "StandardPurple",
        center: "StandardPurple",
        modifier: "StandardPurple",
    },
    StandardGray: {
        frame: "StandardGray",
        center: "StandardGray",
        modifier: "StandardGray",
    },
    Malice: {
        frame: "MalicePurple",
        center: "MalicePurple",
        modifier: "MalicePurple",
    },
    MasterCycle: {
        frame: "DeepOrange",
        center: "DeepOrange",
        modifier: "DeepOrange",
    },
    Medoh: {
        frame: "StandardGreen",
        center: "MedohGreen",
        modifier: "MedohGreen",
    },
    Ruta: {
        frame: "StandardBlue",
        center: "RutaBlue",
        modifier: "RutaBlue",
    },
    Naboris: {
        frame: "StandardOrange",
        center: "NaborisOrange",
        modifier: "NaborisOrange",
    },
    Rudania: {
        frame: "StandardPink",
        center: "RudaniaRed",
        modifier: "RudaniaRed",
    },
    Gold: {
        frame: "LightGold",
        center: "NaborisOrange",
        modifier: "NaborisOrange",
    },
    DarkGold: {
        frame: "DarkGold",
        center: "DarkGold",
        modifier: "DarkGold",
    },
    UltraRed: {
        frame: "UltraRed",
        center: "UltraRed",
        modifier: "UltraRed",
    },
    FuseBlue: {
        frame: "FuseBlue",
        center: "FuseBlue",
        modifier: "FuseBlue",
    },
} as const;

export type PaletteName = keyof typeof Palettes;
