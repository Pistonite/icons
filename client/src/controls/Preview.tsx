import {
    Body1,
    Button,
    Field,
    makeStyles,
    Popover,
    PopoverSurface,
    PopoverTrigger,
    useRestoreFocusTarget,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { HexColorPicker } from "react-colorful";

import { getIconUrl, setPreviewBackground, useStore } from "data/store.ts";
import { ColorCube } from "components/ColorCube.tsx";
import { useColorPickerStyles } from "components/useColorPickerStyles.ts";
import { ColorInput } from "components/ColorPickerButton.tsx";
import { PreviewIcon } from "components/PreviewIcon";

const useStyles = makeStyles({
    previewContainer: {
        display: "flex",
        gap: "10px",
    },
    previewOptionContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
});

export const Preview: React.FC = () => {
    const { t } = useTranslation();
    const restoreFocusAttributes = useRestoreFocusTarget();

    const previewBackground = useStore((store) => store.previewBackground);
    const url = useStore(getIconUrl);

    const colorPickerStyles = useColorPickerStyles();
    const styles = useStyles();

    return (
        <div className={styles.previewContainer}>
            <div>
                <PreviewIcon background={previewBackground} url={url} />
            </div>
            <div className={styles.previewOptionContainer}>
                <Field
                    label={t("ui.choose_preview_background")}
                    hint={t("ui.choose_preview_background_hint")}
                >
                    <Popover withArrow trapFocus>
                        <PopoverTrigger disableButtonEnhancement>
                            <Button
                                className={colorPickerStyles.button}
                                {...restoreFocusAttributes}
                            >
                                <ColorCube color={previewBackground} />
                                {previewBackground}
                            </Button>
                        </PopoverTrigger>
                        <PopoverSurface tabIndex={-1}>
                            <div
                                className={
                                    colorPickerStyles.colorPickerContainer
                                }
                            >
                                <Field
                                    label={t("ui.choose_preview_background")}
                                >
                                    <HexColorPicker
                                        color={previewBackground}
                                        onChange={setPreviewBackground}
                                    />
                                    <ColorInput
                                        color={previewBackground}
                                        setColor={setPreviewBackground}
                                    />
                                </Field>
                            </div>
                        </PopoverSurface>
                    </Popover>
                </Field>
                <Body1>{t("ui.download_hint")}</Body1>
            </div>
        </div>
    );
};
