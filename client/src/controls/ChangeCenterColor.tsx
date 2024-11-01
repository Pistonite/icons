import { Field } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

import {
    useStore,
    isCenterColorCustom,
    getCenterColorName,
    getCenterOutlineColor,
    getCenterFillColor,
    setCustomCenterOutlineColor,
    setCustomCenterFillColor,
    selectCenterColor,
    getIconUrl,
} from "data/store.ts";
import { ColorPickerButton } from "components/ColorPickerButton.tsx";

export const ChangeCenterColor: React.FC = () => {
    const { t } = useTranslation();

    const customCenterColor = useStore(isCenterColorCustom);
    const centerColorName = useStore(getCenterColorName);
    const centerOutlineColor = useStore(getCenterOutlineColor);
    const centerFillColor = useStore(getCenterFillColor);
    const previewBackground = useStore((store) => store.previewBackground);
    const url = useStore(getIconUrl);

    return (
        <Field label={t("ui.choose_center_color")}>
            <ColorPickerButton
                isCustom={customCenterColor}
                selectedOutlineColor={centerOutlineColor}
                selectedFillColor={centerFillColor}
                selectedColorName={centerColorName}
                setOutlineColor={setCustomCenterOutlineColor}
                setFillColor={setCustomCenterFillColor}
                setColorName={selectCenterColor}
                previewBackground={previewBackground}
                previewUrl={url}
            />
        </Field>
    );
};
