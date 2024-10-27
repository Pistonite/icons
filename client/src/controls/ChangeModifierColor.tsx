import { Field } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

import { getModifierColorName, getModifierFillColor, getModifierOutlineColor, isModifierColorCustom, selectModifierColor, setCustomModifierFillColor, setCustomModifierOutlineColor, useStore } from "data/store.ts";
import { ColorPickerButton } from "components/ColorPickerButton.tsx";

export const ChangeModifierColor: React.FC = () => {
    const {t} = useTranslation();

    const customModifierColor = useStore(isModifierColorCustom);
    const modifierColorName = useStore(getModifierColorName);
    const modifierOutlineColor = useStore(getModifierOutlineColor);
    const modifierFillColor = useStore(getModifierFillColor);

    return (
        <Field
            label={t("ui.choose_modifier_color")}
        >
            <ColorPickerButton
                isCustom={customModifierColor}
                selectedOutlineColor={modifierOutlineColor}
                selectedFillColor={modifierFillColor}
                selectedColorName={modifierColorName}
                setOutlineColor={setCustomModifierOutlineColor}
                setFillColor={setCustomModifierFillColor}
                setColorName={selectModifierColor}
            />
        </Field>
    );
}
