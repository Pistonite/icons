import { Dropdown, Field, Option } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

import { selectModifier, useStore } from "data/store.ts";
import { useFetchMetadata } from "data/api.ts";

export const ChooseModifier: React.FC = () => {
    const { modifiers } = useFetchMetadata();
    const selectedModifier = useStore(store => store.selectedModifier);
    const { t } = useTranslation();
                return (<Field
                    label={t("ui.choose_modifier")}
                >
                    <Dropdown
                        value={t(`modifier.${selectedModifier}`)}
                        selectedOptions={[selectedModifier]}
                        onOptionSelect={(_, {selectedOptions}) => {
                            selectModifier(selectedOptions[0] || "none");
                        }}
                    >
                        <Option key="none" value="none">{t("modifier.none")}</Option>
                        {
                            modifiers.map((mod) => (
                                <Option key={mod} value={mod}>
                                    {t(`modifier.${mod}`)}
                                </Option>
                            ))
                        }
                    </Dropdown>
                </Field>);
}
