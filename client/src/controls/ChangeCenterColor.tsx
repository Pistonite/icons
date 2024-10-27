import { Field } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

import { useStore, isCenterColorCustom, getCenterColorName, getCenterOutlineColor, getCenterFillColor, setCustomCenterOutlineColor, setCustomCenterFillColor, selectCenterColor } from "data/store.ts";
import { ColorPickerButton } from "components/ColorPickerButton.tsx";


export const ChangeCenterColor: React.FC = () => {
    const { t } = useTranslation();

    const customCenterColor = useStore(isCenterColorCustom);
    const centerColorName = useStore(getCenterColorName);
    const centerOutlineColor = useStore(getCenterOutlineColor);
    const centerFillColor = useStore(getCenterFillColor);

    return (
        <Field
            label={t("ui.choose_center_color")}
        >
            <ColorPickerButton
                isCustom={customCenterColor}
                selectedOutlineColor={centerOutlineColor}
                selectedFillColor={centerFillColor}
                selectedColorName={centerColorName}
                setOutlineColor={setCustomCenterOutlineColor}
                setFillColor={setCustomCenterFillColor}
                setColorName={selectCenterColor} />
        </Field>
    );
};

