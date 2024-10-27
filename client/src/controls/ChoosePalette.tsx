import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

import { isPaletteCustom, selectPalette, useStore } from "data/store.ts";
import {
    Colors,
    type PaletteName,
    PaletteNames,
    Palettes,
} from "data/color.ts";
import { ColorCube } from "components/ColorCube.tsx";

export const ChoosePalette: React.FC = () => {
    const { t } = useTranslation();

    const selectedPalette = useStore((store) => store.selectedPalette);
    const customPalette = useStore(isPaletteCustom);
    const palette = customPalette ? "Custom" : selectedPalette;

    return (
        <Field label={t("ui.choose_palette")}>
            <Dropdown
                value={t(`palette.${palette}`)}
                selectedOptions={customPalette ? [] : [palette]}
                onOptionSelect={(_, { selectedOptions }) => {
                    selectPalette(
                        (selectedOptions[0] as PaletteName) || "StandardBlue",
                    );
                }}
            >
                {PaletteNames.map((name) => {
                    const palette = Palettes[name];
                    return (
                        <Option
                            text={t(`palette.${name}`)}
                            key={name}
                            value={name}
                        >
                            <ColorCube color={Colors[palette.frame].outline} />
                            <ColorCube color={Colors[palette.frame].fill} />
                            <ColorCube color={Colors[palette.center].outline} />
                            <ColorCube color={Colors[palette.center].fill} />
                            <ColorCube
                                color={Colors[palette.modifier].outline}
                            />
                            <ColorCube color={Colors[palette.modifier].fill} />
                            {t(`palette.${name}`)}
                        </Option>
                    );
                })}
            </Dropdown>
        </Field>
    );
};
