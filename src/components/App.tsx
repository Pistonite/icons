import { Callout, Link, SearchBox, TextField, Text, Dropdown, ComboBox, Label, DefaultButton, SelectableOptionMenuItemType, ColorPicker, getColorFromString } from "@fluentui/react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useApiIcons, getIconUrl, ColorDef, ColorName, PaletteName, Palettes, toDisplayName } from "../data";
import { IconButton } from "./IconButton";
import { ColorPickerButton } from "./ColorPickerButton";
import { Section } from "./Section";

const DEFAULT_BACKGROUND = getColorFromString("#001a00")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

const useIconSearch = () => {
    const allIcons = useApiIcons();
    const [searchText, setSearchText] = useState("");
    const [_, startTransition] = useTransition();
    const [icons, setIcons] = useState<string[]>([]);

    useEffect(() => {
        startTransition(() => {
            if (!searchText) {
                setIcons(allIcons);
                return;
            }
            setIcons(allIcons.filter((icon) => icon.includes(searchText)));
        });
    }, [allIcons, searchText]);

    return {
        searchText,
        setSearchText,
        icons
    };
};

const PaletteOptions = [
    ...Object.keys(Palettes).map((palette) => ({
        key: palette,
        text: toDisplayName(palette)
    })),
    {
        key: "divider",
        text: "-",
        itemType: SelectableOptionMenuItemType.Divider
    },
    {
        key: "Custom",
        text: "Custom"
    }
];

export const App: React.FC = () => {
    const { searchText, setSearchText, icons } = useIconSearch();
    const [selectedIcon, setSelectedIcon] = useState("shrine.shrine");
    const [selectedModifier, setSelectedModifier] = useState("none");
    const [selectedPalette, setSelectedPalette] = useState<PaletteName | "Custom">("StandardBlue");
    const [frameColor, setFrameColor] = useState<ColorName | ColorDef>("StandardBlue");
    const [centerColor, setCenterColor] = useState<ColorName | ColorDef>("StandardBlue");
    const [modColor, setModColor] = useState<ColorName | ColorDef>("StandardBlue");

    useEffect(() => {
        if (selectedPalette !== "Custom") {
            const palette = Palettes[selectedPalette];
            if (!palette){
                return;
            }
            setFrameColor(palette.frame);
            setCenterColor(palette.center);
            setModColor(palette.modifier);
        }
    }, [selectedPalette]);

    const [previewBackground, setPreviewBackground] = useState(DEFAULT_BACKGROUND);

    const imageUrl = useMemo(() => {
        const palette = {
            frame: frameColor,
            center: centerColor,
            modifier: modColor,
        };

        return getIconUrl(selectedIcon, selectedModifier, palette);
    }, [selectedIcon, selectedModifier, frameColor, centerColor, modColor]);

    const [isCopyCalloutOpen, setIsCopyCalloutOpen] = useState(false);

    return (
        <div>
            <Section>
                <Text as="h1" block variant="xLarge">
                    Pistonite Icons
                </Text>
                <Text block>
                    Pistonite Icons is a versatile icon set inspired by the Breath of the Wild trilogy.
                    It was originally created to be used with LiveSplit for speedrunners, and was later also used in Celer (the route engine for BotW).
                    The icons are available in a variety of colors and modifiers. You can use a built-in palette, or create your own custom colors with this tool.
                </Text>
                <Text block styles={{root: {marginTop: 4}}}>
                    This project is open source on <Link href="https://github.com/Pistonite/icons" target="_blank" rel="noreferrer">GitHub</Link>
                </Text>
            </Section>
        
            <Section>
                <Label>Choose an Icon</Label>
                <SearchBox
                    placeholder="Search"
                    value={searchText}
                    onChange={e => setSearchText(e?.target.value ?? "")}
                    styles={{
                        root: {
                            marginBottom: 4
                        }
                    }}
                />
                <div style={{overflowY: "auto", maxHeight: 300}}>
                    {
                        icons.map((icon) => 
                            <IconButton
                                iconPath={icon}
                                key={icon}
                                title={icon}
                                onClick={() => setSelectedIcon(icon)}
                                checked={selectedIcon === icon}
                            />
                        )
                    }
                </div>
            </Section>

            <div style={{display: "flex"}}>
                <div style={{flexBasis: 300, flexShrink: 0}}>
                    <Section>
                        <Dropdown
                            selectedKey={selectedModifier}
                            label="Select a Modifier"
                            options={[
                                { key: "none", text: "None" },
                                {
                                    key: "plus", text: "Plus",
                                
                                },{
                                    key: "minus", text: "Minus",
                                },{
                                    key: "square", text: "Square",
                                },{
                                    key: "circle", text: "Circle",
                                },{
                                    key: "triangle", text: "Triangle",
                                }
                            ]}
                            styles={{
                                root: {
                                    maxWidth: 300,
                                    marginBottom: 4,
                                }
                            }}
                            onChange={(_, option) => {
                                if (option){
                                    setSelectedModifier(option.key.toString());
                                }
                            }}
                        />
                        <ComboBox
                            label="Select a Palette"
                            selectedKey={selectedPalette}
                            options={PaletteOptions}
                            styles={{
                                root: {
                                    maxWidth: 300,
                                    marginBottom: 4
                                }
                            }}
                            onChange={(_, option) => {
                                if (option){
                                    setSelectedPalette(option.key.toString() as PaletteName | "Custom");
                                }
                            }}

                        />
      
                        <ColorPickerButton
                            text="Change Frame Color"
                            color={frameColor}
                            setColor={color => {
                                setFrameColor(color);
                                setSelectedPalette("Custom");
                            }}
                        />
                        <ColorPickerButton
                            text="Change Center Color"
                            color={centerColor}
                            setColor={color => {
                                setCenterColor(color);
                                setSelectedPalette("Custom");
                            }}
                        />
                        <ColorPickerButton
                            text="Change Modifier Color"
                            color={modColor}
                            setColor={color => {
                                setModColor(color);
                                setSelectedPalette("Custom");
                            }}
                        />
                    </Section>
                </div>
                <div style={{flexBasis: 300, flexShrink: 0}}>
                    <Section>

                        <Label>Preview Background</Label>
                        <Text block styles={{root: {marginBottom: 4}}}>The background is only in the preview and not in the downloaded icon.</Text>
                        <ColorPicker
                            color={previewBackground}
                            onChange={(_, color) => {
                                setPreviewBackground(color);
                            }}/>
                    </Section>
                </div>
                <div style={{overflow:"hidden", wordWrap: "break-word"}}>
                    <Section>
                        <Label>Preview</Label>
                        <div style={{
                            backgroundColor: `rgba(${previewBackground.r}, ${previewBackground.g}, ${previewBackground.b}, ${(previewBackground.a ?? 100) / 100.0})`,
                            width: 80,
                            height: 80,
                            padding: 10,
                            marginBottom: 4
                        }}>
                            <img src={imageUrl} width={80}/>
                        </div>
                        <div>
                            <Label>Download</Label>
                            <Text block styles={{root: {marginBottom: 4}}}>You can download the icon by right-clicking on it and select "Save image as".</Text>
                            <Text block styles={{root: {marginBottom: 4}}}>You can also use this icon by copying its URL below.</Text>

                        </div>
                        
                        <div>
                            <TextField label="URL" readOnly value={imageUrl} />
                            <DefaultButton
                                id="copy-button"
                                primary
                                styles={{root: {marginTop: 4}}}
                                onClick={()=>{
                                    setIsCopyCalloutOpen(true);
                                    window.navigator.clipboard.writeText(imageUrl);
                                }}
                            >
                            Copy URL
                            </DefaultButton>
                            {
                                isCopyCalloutOpen && 
                            <Callout
                                target="#copy-button"
                                onDismiss={() => setIsCopyCalloutOpen(false)}
                                role="dialog"
                            >
                                <Section>
                                    <Text block variant="medium">URL copied!</Text>
                                </Section>
                                
                            </Callout>
                            }
                            
                        </div>
                    </Section>
                    
                </div>
            </div>
        </div>
    );
}

