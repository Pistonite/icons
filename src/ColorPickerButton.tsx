import { DefaultButton, Label, Callout, DirectionalHint, ComboBox, SelectableOptionMenuItemType, Stack, getColorFromString, ColorPicker } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import React, { useEffect, useMemo, useState } from "react";
import { Section } from "./Section";
import { useApiColors } from "./api";

type ColorPickerButtonProps = {
    color: string | [string, string],
    setColor: (color: string | [string, string]) => void,
    text: string,
}

const getColorSpriteStyle = (color: string) => {
    return {
        margin: "0 4px",
        display: "inline-block",
        width: 50,
        backgroundColor: `#${color}`,
        border: "1px solid #030303",
    };
};

export const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({color, text, setColor}) => {
    const [isCalloutOpen, setIsCalloutOpen] = useState(false);
    const id = useId("color-picker-button");

    const colors = useApiColors();

    const colorOptions = useMemo(() => {
        const options = [];
        options.push(...Object.keys(colors).map((color) => ({
            key: color,
            text: color
        })));
        options.push({
            key: "divider",
            text: "-",
            itemType: SelectableOptionMenuItemType.Divider
        },
        {
            key: "custom",
            text: "Custom"
        });
        return options;
    }, [colors]);

    const [selectedColor, selectedOutline, selectedFill] = useMemo(() => {
        if (typeof color === "string") {
            if (color in colors) {
                return [color, colors[color][0], colors[color][1]];
            }
        }
        return ["custom", color[0], color[1]];
    }, [color, colors]);

    // Update internal selection when the color is changed from outside
    // but does not update the color outside when internal selection is changed
    const [selectedColorInternal, setSelectedColorInternal] = useState(selectedColor);
    useEffect(() => {
        setSelectedColorInternal(selectedColor);
    }, [selectedColor]);

    const [outline, setOutlineInternal] = useState(selectedOutline);
    const [fill, setFillInternal] = useState(selectedFill);
    useEffect(() => {
        if (selectedColorInternal !== "custom") {
            const color = colors[selectedColorInternal];
            setOutlineInternal(color[0]);
            setFillInternal(color[1]);
        }
    }, [selectedColorInternal, colors]);

    return (
        <>
            <Label>
                {text}
            </Label>
            <DefaultButton id={id} styles={{
                root: {
                    boxSizing: "border-box",
                    width: "100%",
                    marginBottom: 4
                }
            
            }} onClick={()=> {
                setSelectedColorInternal(selectedColor);
                setOutlineInternal(selectedOutline);
                setFillInternal(selectedFill);
                setIsCalloutOpen(true);
            }}>
            
                <span style={getColorSpriteStyle(selectedOutline)} >&nbsp;</span>
                <span style={getColorSpriteStyle(selectedFill)} >&nbsp;</span>
                {selectedColor}
            </DefaultButton>
            {
                isCalloutOpen && 
            <Callout
                target={`#${id}`}
                role="dialog"
                onDismiss={() => {
                    if (selectedColorInternal !== "custom") {
                        setColor(selectedColorInternal);
                    } else {
                        setColor([outline, fill]);
                    }
                    setIsCalloutOpen(false);
                }}
                setInitialFocus
                directionalHint={DirectionalHint.rightCenter}
            >
                <Section>
                    <ComboBox
                        selectedKey={selectedColorInternal}
                        label="Select a built-in Color or customize it below"
                        options={colorOptions}
                        styles={{
                            root: {
                                maxWidth: 300,
                                margin: "4px"
                            }
                        }}
                        onChange={(_, option) => {
                            if (option){
                                setSelectedColorInternal(option.key.toString());
                            }
                        }}

                    />
                    <Stack horizontal>
                        <div>
                            <Label>Outline</Label>
                            <ColorPicker
                                color={getColorFromString(`#${outline}`)! /* eslint-disable-line @typescript-eslint/no-non-null-assertion */}
                                showPreview
                                alphaType="none"
                                onChange={(_, color) => {
                                    setSelectedColorInternal("custom");
                                    setOutlineInternal(color.hex);
                                }}
                            />
                        </div>
                        <div>
                            <Label>Fill</Label>
                            <ColorPicker
                                color={getColorFromString(`#${fill}`)! /* eslint-disable-line @typescript-eslint/no-non-null-assertion */}
                                showPreview
                                alphaType="none"
                                onChange={(_, color) => {
                                    setSelectedColorInternal("custom");
                                    setFillInternal(color.hex);
                                }}
                            />
                        </div>
                    </Stack>
                </Section>
                
            </Callout>
            }
        </>
        
    );
};