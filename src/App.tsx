import { Callout, Link, SearchBox, TextField, Text, Dropdown, ComboBox, Label, DefaultButton, SelectableOptionMenuItemType, ColorPicker, getColorFromString } from "@fluentui/react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { IconButton } from "./IconButton";
import { useApiColors, useApiIcons, useApiPalettes } from "./api";
import { ColorPickerButton } from "./ColorPickerButton";
import { Section } from "./Section";
import { proxyUrl } from "./proxy";

const DEFAULT_BACKGROUND = getColorFromString("#001a00")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

type Icon = {
  group: string;
  icon: string;
}

const useIconSearch = () => {
    const allIcons = useApiIcons();
    const [searchText, setSearchText] = useState("");
    const [_, startTransition] = useTransition();
    const [icons, setIcons] = useState<Icon[]>([]);

    useEffect(() => {
        startTransition(() => {
            const newIcons = [];
            for (const group in allIcons) {
                newIcons.push(...allIcons[group].map((icon) => {
                    return (searchText === "" || group.includes(searchText) || icon.includes(searchText)) && {
                        group, icon
                    };
                }).filter(Boolean));
            }
            setIcons(newIcons as Icon[]);
        });
    }, [allIcons, searchText]);

    return {
        searchText,
        setSearchText,
        icons
    };
};

function App() {
    const { searchText, setSearchText, icons } = useIconSearch();

    const [selectedIcon, setSelectedIcon] = useState<Icon>({
        group: "shrine",
        icon: "shrine"
    });

    const [selectedModifier, setSelectedModifier] = useState("none");

    const palettes = useApiPalettes();
    const paletteOptions = useMemo(() => {
        const options = [];
        for (const palette in palettes) {
            options.push({
                key: palette,
                text: palette
            });
        }
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
    }, [palettes]);

    const [selectedPalette, setSelectedPalette] = useState("std_blue");

    const [bgColor, setBgColor] = useState<string | [string, string]>("std_blue");
    const [fgColor, setFgColor] = useState<string | [string, string]>("std_blue");
    const [modColor, setModColor] = useState<string | [string, string]>("std_blue");

    useEffect(() => {
        if (selectedPalette !== "custom") {
            const palette = palettes[selectedPalette];
            if (!palette){
                return;
            }
            setBgColor(palette.bg);
            setFgColor(palette.fg);
            setModColor(palette.mod);
        }
    }, [selectedPalette, palettes]);

    const [previewBackground, setPreviewBackground] = useState(DEFAULT_BACKGROUND);

    const colors = useApiColors();

    const [imageSrc, imageUrl] = useMemo(() => {
        const icon = `${selectedIcon.group}.${selectedIcon.icon}`;
        if (selectedPalette !== "custom") {
            const src = `/img/${icon}.${selectedPalette}.${selectedModifier}.png`;
            return [src, window.location.origin + src];
        }

        if (typeof bgColor === "string" && typeof fgColor === "string" && typeof modColor === "string") {
            const src = `/palette/${icon}.${bgColor}.${fgColor}.${modColor}.${selectedModifier}.png`;
            return [proxyUrl(src), "https://icons.pistonite.org" + src];
        }

        const getColorPart = (color: string | [string, string]) => {
            if (typeof color === "string") {
                if (color in colors) {
                    color = colors[color];
                }else{
                    color = ["000000", "000000"];
                }
            }
            return `${color[0].padStart(6, "0")}.${color[1].padStart(6, "0")}`;
        };

        const src = `/color/${icon}.${getColorPart(bgColor)}.${getColorPart(fgColor)}.${getColorPart(modColor)}.${selectedModifier}.png`;
        return [proxyUrl(src), "https://icons.pistonite.org" + src];
    }, [colors, selectedIcon, selectedPalette, selectedModifier, bgColor, fgColor, modColor]);

    const [isCopyCalloutOpen, setIsCopyCalloutOpen] = useState(false);

    return (
        <div>
            <Section>
                <Text as="h1" block variant="xLarge">
                    Piston Icons
                </Text>
                <Text block>
                    Piston Icons is a versatile icon set inspired by the Breath of the Wild trilogy.
                    It was originally created to be used with LiveSplit for speedrunners, and was later also used in Celer (the route engine for BotW).
                    The icons are available in a variety of colors and modifiers. You can use a built-in palette, or create your own custom colors with this tool.
                </Text>
                <Text block styles={{root: {marginTop: 4}}}>
                    This project is open source on <Link href="https://github.com/iTNTPiston/piston-icons" target="_blank" rel="noreferrer">GitHub</Link>
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
                        icons.map(({group, icon}) => 
                            <IconButton
                                iconGroup={group}
                                icon={icon}
                                key={`${group}.${icon}`}
                                title={`${group}.${icon}`}
                                onClick={() => setSelectedIcon({group, icon})}
                                checked={selectedIcon.group === group && selectedIcon.icon === icon}
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
                            options={paletteOptions}
                            styles={{
                                root: {
                                    maxWidth: 300,
                                    marginBottom: 4
                                }
                            }}
                            onChange={(_, option) => {
                                if (option){
                                    setSelectedPalette(option.key.toString());
                                }
                            }}

                        />
      
                        <ColorPickerButton
                            text="Change Outer Color"
                            color={bgColor}
                            setColor={color => {
                                setBgColor(color);
                                setSelectedPalette("custom");
                            }}
                        />
                        <ColorPickerButton
                            text="Change Inner Color"
                            color={fgColor}
                            setColor={color => {
                                setFgColor(color);
                                setSelectedPalette("custom");
                            }}
                        />
                        <ColorPickerButton
                            text="Change Modifier Color"
                            color={modColor}
                            setColor={color => {
                                setModColor(color);
                                setSelectedPalette("custom");
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
                            <img src={imageSrc} width={80}/>
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

export default App;
