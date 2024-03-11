import {
    IColor,
    DefaultButton,
    Label,
    Callout,
    DirectionalHint,
    ComboBox,
    SelectableOptionMenuItemType,
    Stack,
    ColorPicker,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import React, { useEffect, useMemo, useState } from "react";
import { Colors, ColorName, toDisplayName, ColorDef } from "../data";
import { Section } from "./Section";

type ColorPickerButtonProps = {
    color: ColorName | ColorDef;
    setColor: (color: ColorName | ColorDef) => void;
    text: string;
};

const getColorSpriteStyle = (color: IColor) => {
    return {
        margin: "0 4px",
        display: "inline-block",
        width: 50,
        backgroundColor: `#${color.hex}`,
        border: "1px solid #030303",
    };
};

const ColorOptions = [
    ...Object.keys(Colors).map((color) => ({
        key: color,
        text: toDisplayName(color),
    })),
    {
        key: "divider",
        text: "-",
        itemType: SelectableOptionMenuItemType.Divider,
    },
    {
        key: "Custom",
        text: "Custom",
    },
];

export const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
    color,
    text,
    setColor,
}) => {
    const [isCalloutOpen, setIsCalloutOpen] = useState(false);
    const id = useId("color-picker-button");

    const [selectedColorName, selectedOutline, selectedFill] = useMemo(() => {
        if (typeof color === "string") {
            const { outline, fill } = Colors[color];
            return [color, outline, fill] as const;
        }
        return ["Custom", color.outline, color.fill] as const;
    }, [color]);

    // Update internal selection when the color is changed from outside
    // but does not update the color outside when internal selection is changed
    const [selectedColorInternal, setSelectedColorInternal] = useState<
        ColorName | "Custom"
    >(selectedColorName);
    useEffect(() => {
        setSelectedColorInternal(selectedColorName);
    }, [selectedColorName]);

    const [outline, setOutlineInternal] = useState<IColor>(selectedOutline);
    const [fill, setFillInternal] = useState<IColor>(selectedFill);
    useEffect(() => {
        if (selectedColorInternal !== "Custom") {
            const color = Colors[selectedColorInternal];
            setOutlineInternal(color.outline);
            setFillInternal(color.fill);
        }
    }, [selectedColorInternal]);

    return (
        <>
            <Label>{text}</Label>
            <DefaultButton
                id={id}
                styles={{
                    root: {
                        boxSizing: "border-box",
                        width: "100%",
                        marginBottom: 4,
                    },
                }}
                onClick={() => {
                    setSelectedColorInternal(selectedColorName);
                    setOutlineInternal(selectedOutline);
                    setFillInternal(selectedFill);
                    setIsCalloutOpen(true);
                }}
            >
                <span style={getColorSpriteStyle(selectedOutline)}>&nbsp;</span>
                <span style={getColorSpriteStyle(selectedFill)}>&nbsp;</span>
                {toDisplayName(selectedColorName)}
            </DefaultButton>
            {isCalloutOpen && (
                <Callout
                    target={`#${id}`}
                    role="dialog"
                    onDismiss={() => {
                        if (selectedColorInternal !== "Custom") {
                            setColor(selectedColorInternal);
                        } else {
                            setColor({ outline, fill });
                        }
                        setIsCalloutOpen(false);
                    }}
                    setInitialFocus
                    directionalHint={DirectionalHint.rightCenter}
                >
                    <Section>
                        <Stack
                            horizontal
                            styles={{ root: { alignItems: "end" } }}
                        >
                            <ComboBox
                                selectedKey={selectedColorInternal}
                                label="Select a built-in Color or customize it below"
                                options={ColorOptions}
                                styles={{
                                    root: {
                                        maxWidth: 300,
                                        margin: "4px",
                                    },
                                }}
                                onChange={(_, option) => {
                                    if (option) {
                                        setSelectedColorInternal(
                                            option.key.toString() as
                                                | ColorName
                                                | "Custom",
                                        );
                                    }
                                }}
                            />
                            <DefaultButton
                                primary
                                styles={{
                                    root: {
                                        margin: "4px",
                                    },
                                }}
                                onClick={() => {
                                    if (selectedColorInternal !== "Custom") {
                                        setColor(selectedColorInternal);
                                    } else {
                                        setColor({ outline, fill });
                                    }
                                    setIsCalloutOpen(false);
                                }}
                            >
                                Apply
                            </DefaultButton>
                        </Stack>

                        <Stack horizontal>
                            <div>
                                <Label>Outline</Label>
                                <ColorPicker
                                    color={outline}
                                    showPreview
                                    alphaType="none"
                                    onChange={(_, color) => {
                                        setSelectedColorInternal("Custom");
                                        setOutlineInternal(color);
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Fill</Label>
                                <ColorPicker
                                    color={fill}
                                    showPreview
                                    alphaType="none"
                                    onChange={(_, color) => {
                                        setSelectedColorInternal("Custom");
                                        setFillInternal(color);
                                    }}
                                />
                            </div>
                        </Stack>
                    </Section>
                </Callout>
            )}
        </>
    );
};
