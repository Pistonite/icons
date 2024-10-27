import { create } from "zustand";

import { type PaletteName, type ColorName, Colors, Palettes } from "./color.ts";
import { createSelector } from "reselect";

export type Store = {
    // name of the currently selected icon
    selectedIcon: string;
    // name of the currently selected modifier
    selectedModifier: string;

    // currently selected palette name
    selectedPalette: PaletteName;

    // selected colors - undefined means custom
    // overrides selectedPalette
    selectedFrameColor: ColorName | undefined;
    selectedCenterColor: ColorName | undefined;
    selectedModifierColor: ColorName | undefined;

    // custom colors - empty means not set
    // overrides selectedPalette and selectedColor
    customFrameOutlineColor: string;
    customFrameFillColor: string;
    customCenterOutlineColor: string;
    customCenterFillColor: string;
    customModifierOutlineColor: string;
    customModifierFillColor: string;

    previewBackground: string;
};

export const useStore = create<Store>()(() => ({
    selectedIcon: "shrine.shrine",
    selectedModifier: "none",
    selectedPalette: "StandardBlue",

    selectedFrameColor: undefined,
    selectedCenterColor: undefined,
    selectedModifierColor: undefined,

    customFrameOutlineColor: "",
    customFrameFillColor: "",
    customCenterOutlineColor: "",
    customCenterFillColor: "",
    customModifierOutlineColor: "",
    customModifierFillColor: "",

    previewBackground: "#001a00",
}));

export const selectIcon = (icon: string) => {
    useStore.setState({ selectedIcon: icon });
};

export const selectModifier = (modifier: string) => {
    useStore.setState({ selectedModifier: modifier });
};

export const selectPalette = (palette: PaletteName) => {
    useStore.setState({
        selectedPalette: palette,
        selectedFrameColor: undefined,
        selectedCenterColor: undefined,
        selectedModifierColor: undefined,
        customFrameOutlineColor: "",
        customFrameFillColor: "",
        customCenterOutlineColor: "",
        customCenterFillColor: "",
        customModifierOutlineColor: "",
        customModifierFillColor: "",
    });
};

export const selectFrameColor = (color: ColorName) => {
    useStore.setState({
        selectedFrameColor: color,
        customFrameOutlineColor: "",
        customFrameFillColor: "",
    });
};

export const selectCenterColor = (color: ColorName) => {
    useStore.setState({
        selectedCenterColor: color,
        customCenterOutlineColor: "",
        customCenterFillColor: "",
    });
};

export const selectModifierColor = (color: ColorName) => {
    useStore.setState({
        selectedModifierColor: color,
        customModifierOutlineColor: "",
        customModifierFillColor: "",
    });
};

export const setCustomFrameOutlineColor = (color: string) => {
    useStore.setState({ customFrameOutlineColor: color });
};
export const setCustomFrameFillColor = (color: string) => {
    useStore.setState({ customFrameFillColor: color });
};
export const setCustomCenterOutlineColor = (color: string) => {
    useStore.setState({ customCenterOutlineColor: color });
};
export const setCustomCenterFillColor = (color: string) => {
    useStore.setState({ customCenterFillColor: color });
};
export const setCustomModifierOutlineColor = (color: string) => {
    useStore.setState({ customModifierOutlineColor: color });
};
export const setCustomModifierFillColor = (color: string) => {
    useStore.setState({ customModifierFillColor: color });
};

export const setPreviewBackground = (color: string) => {
    useStore.setState({ previewBackground: color });
};

const processColorOverride = (
    mode: "outline" | "fill",
    part: "frame" | "center" | "modifier",
) => {
    return (
        custom2: string,
        custom: ColorName | undefined,
        palette: PaletteName,
    ): string => {
        if (custom2) {
            return custom2.toLowerCase();
        }

        if (custom) {
            return Colors[custom][mode];
        }

        return Colors[Palettes[palette][part]][mode];
    };
};

const processColorOverrideName = (part: "frame" | "center" | "modifier") => {
    return (
        customOutline: string,
        customFill: string,
        custom: ColorName | undefined,
        palette: PaletteName,
    ): string => {
        if (customOutline || customFill) {
            return "Custom";
        }

        if (custom) {
            return custom;
        }

        return Palettes[palette][part];
    };
};

export const getFrameOutlineColor = createSelector(
    [
        (store: Store) => store.customFrameOutlineColor,
        (store: Store) => store.selectedFrameColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverride("outline", "frame"),
);

export const getFrameFillColor = createSelector(
    [
        (store: Store) => store.customFrameFillColor,
        (store: Store) => store.selectedFrameColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverride("fill", "frame"),
);

export const isFrameColorCustom = createSelector(
    [
        (store: Store) => store.customFrameOutlineColor,
        (store: Store) => store.customFrameFillColor,
    ],
    (customOutline, customFill) => !!(customOutline || customFill),
);

export const getFrameColorName = createSelector(
    [
        (store: Store) => store.customFrameOutlineColor,
        (store: Store) => store.customFrameFillColor,
        (store: Store) => store.selectedFrameColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverrideName("frame"),
);

export const getCenterOutlineColor = createSelector(
    [
        (store: Store) => store.customCenterOutlineColor,
        (store: Store) => store.selectedCenterColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverride("outline", "center"),
);

export const getCenterFillColor = createSelector(
    [
        (store: Store) => store.customCenterFillColor,
        (store: Store) => store.selectedCenterColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverride("fill", "center"),
);

export const getCenterColorName = createSelector(
    [
        (store: Store) => store.customCenterOutlineColor,
        (store: Store) => store.customCenterFillColor,
        (store: Store) => store.selectedCenterColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverrideName("center"),
);

export const isCenterColorCustom = createSelector(
    [
        (store: Store) => store.customCenterOutlineColor,
        (store: Store) => store.customCenterFillColor,
    ],
    (customOutline, customFill) => !!(customOutline || customFill),
);

export const getModifierOutlineColor = createSelector(
    [
        (store: Store) => store.customModifierOutlineColor,
        (store: Store) => store.selectedModifierColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverride("outline", "modifier"),
);

export const getModifierFillColor = createSelector(
    [
        (store: Store) => store.customModifierFillColor,
        (store: Store) => store.selectedModifierColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverride("fill", "modifier"),
);

export const getModifierColorName = createSelector(
    [
        (store: Store) => store.customModifierOutlineColor,
        (store: Store) => store.customModifierFillColor,
        (store: Store) => store.selectedModifierColor,
        (store: Store) => store.selectedPalette,
    ],
    processColorOverrideName("modifier"),
);

export const isModifierColorCustom = createSelector(
    [
        (store: Store) => store.customModifierOutlineColor,
        (store: Store) => store.customModifierFillColor,
    ],
    (customOutline, customFill) => !!(customOutline || customFill),
);

export const isPaletteCustom = createSelector(
    [
        isFrameColorCustom,
        isCenterColorCustom,
        isModifierColorCustom,
        (store: Store) => store.selectedFrameColor,
        (store: Store) => store.selectedCenterColor,
        (store: Store) => store.selectedModifierColor,
    ],
    (frameCustom, centerCustom, modifierCustom, frame, center, modifier) => {
        return (
            frameCustom ||
            centerCustom ||
            modifierCustom ||
            !!(frame || center || modifier)
        );
    },
);

const createIconUrl = (
    icon: string,
    modifier: string,
    fo: string,
    ff: string,
    co: string,
    cf: string,
    mo: string,
    mf: string,
) => {
    // remove #
    fo = fo.substring(1);
    ff = ff.substring(1);
    co = co.substring(1);
    cf = cf.substring(1);
    mo = mo.substring(1);
    mf = mf.substring(1);

    const base = globalThis.location.origin;

    return `${base}/icon/${icon}.${modifier}.${fo}.${ff}.${co}.${cf}.${mo}.${mf}.png`;
};

export const getIconUrl = createSelector(
    [
        (store: Store) => store.selectedIcon,
        (store: Store) => store.selectedModifier,
        getFrameOutlineColor,
        getFrameFillColor,
        getCenterOutlineColor,
        getCenterFillColor,
        getModifierOutlineColor,
        getModifierFillColor,
    ],
    createIconUrl,
);

export const getIconUrlCreator = createSelector(
    [
        (store: Store) => store.selectedModifier,
    ],
    (modifier) => {
        const palette = Palettes.Incomplete;
        const fo = Colors[palette.frame].outline;
        const ff = Colors[palette.frame].fill;
        const co = Colors[palette.center].outline;
        const cf = Colors[palette.center].fill;
        const mo = Colors[palette.modifier].outline;
        const mf = Colors[palette.modifier].fill;
        return (icon: string) =>
            createIconUrl(icon, modifier, fo, ff, co, cf, mo, mf);
    },
);
