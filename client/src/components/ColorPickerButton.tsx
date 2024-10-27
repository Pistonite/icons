import {
    Button,
    Dropdown,
    Field,
    Popover,
    PopoverSurface,
    PopoverTrigger,
    useRestoreFocusTarget,
    Option,
    Input,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

import { type ColorName, ColorNames, Colors } from "data/color.ts";

import { ColorCube } from "./ColorCube.tsx";
import { useColorPickerStyles } from "./useColorPickerStyles.ts";
import { PreviewIcon } from "./PreviewIcon.tsx";

export type ColorPickerButtonProps = {
    isCustom: boolean;
    selectedOutlineColor: string;
    selectedFillColor: string;
    selectedColorName: string;
    setOutlineColor: (color: string) => void;
    setFillColor: (color: string) => void;
    setColorName: (color: ColorName) => void;
    previewBackground: string;
    previewUrl: string;
};

export const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
    isCustom,
    selectedOutlineColor,
    selectedFillColor,
    selectedColorName,
    setOutlineColor,
    setFillColor,
    setColorName,
    previewBackground,
    previewUrl,
}) => {
    const styles = useColorPickerStyles();
    const { t } = useTranslation();
    const restoreFocusAttributes = useRestoreFocusTarget();
    return (
        <Popover withArrow trapFocus positioning="below">
            <PopoverTrigger disableButtonEnhancement>
                <Button className={styles.button} {...restoreFocusAttributes}>
                    <ColorCube color={selectedOutlineColor} />
                    <ColorCube color={selectedFillColor} />
                    {t(`color.${selectedColorName}`)}
                </Button>
            </PopoverTrigger>
            <PopoverSurface tabIndex={-1}>
                <Field label={t("ui.select_color")}>
                    <Dropdown
                        value={t(`color.${selectedColorName}`)}
                        selectedOptions={isCustom ? [] : [selectedColorName]}
                        onOptionSelect={(_, { selectedOptions }) => {
                            setColorName(
                                (selectedOptions[0] as ColorName) ||
                                    "StandardBlue",
                            );
                        }}
                    >
                        {ColorNames.map((name) => {
                            const color = Colors[name];
                            return (
                                <Option
                                    text={t(`color.${name}`)}
                                    key={name}
                                    value={name}
                                >
                                    <ColorCube color={color.outline} />
                                    <ColorCube color={color.fill} />
                                    {t(`color.${name}`)}
                                </Option>
                            );
                        })}
                    </Dropdown>
                </Field>
                <div className={styles.colorPickerContainer}>
                    <Field label={t("ui.outline_color")}>
                        <HexColorPicker
                            color={selectedOutlineColor}
                            onChange={setOutlineColor}
                        />
                        <ColorInput
                            color={selectedOutlineColor}
                            setColor={setOutlineColor}
                        />
                    </Field>
                    <Field label={t("ui.fill_color")}>
                        <HexColorPicker
                            color={selectedFillColor}
                            onChange={setFillColor}
                        />
                        <ColorInput
                            color={selectedFillColor}
                            setColor={setFillColor}
                        />
                    </Field>
                </div>
                <PreviewIcon background={previewBackground} url={previewUrl} />
            </PopoverSurface>
        </Popover>
    );
};

export type ColorInputProps = {
    color: string;
    setColor: (color: string) => void;
};

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

export const ColorInput: React.FC<ColorInputProps> = ({ color, setColor }) => {
    const [value, setValue] = useState(color);
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (value !== color) {
            setValue(color);
        }
    }, [color]);
    /* eslint-enable react-hooks/exhaustive-deps */
    return (
        <Input
            contentBefore={<ColorCube color={color} />}
            value={value}
            onChange={(_, { value }) => {
                if (!value.startsWith("#")) {
                    value = "#" + value;
                }
                setValue(value);
                if (value.match(HEX_REGEX)) {
                    setColor(value);
                }
            }}
        />
    );
};
