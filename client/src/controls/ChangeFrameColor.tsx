import { Field } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

import {
    getFrameColorName,
    getFrameFillColor,
    getFrameOutlineColor,
    isFrameColorCustom,
    selectFrameColor,
    setCustomFrameFillColor,
    setCustomFrameOutlineColor,
    useStore,
} from "data/store.ts";
import { ColorPickerButton } from "components/ColorPickerButton.tsx";

export const ChangeFrameColor: React.FC = () => {
    const { t } = useTranslation();

    const customFrameColor = useStore(isFrameColorCustom);
    const frameColorName = useStore(getFrameColorName);
    const frameOutlineColor = useStore(getFrameOutlineColor);
    const frameFillColor = useStore(getFrameFillColor);

    return (
        <Field label={t("ui.choose_frame_color")}>
            <ColorPickerButton
                isCustom={customFrameColor}
                selectedOutlineColor={frameOutlineColor}
                selectedFillColor={frameFillColor}
                selectedColorName={frameColorName}
                setOutlineColor={setCustomFrameOutlineColor}
                setFillColor={setCustomFrameFillColor}
                setColorName={selectFrameColor}
            />
        </Field>
    );
};
