import { Field, makeStyles, SearchBox } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useDeferredValue, useMemo, useState } from "react";

import { useFetchMetadata } from "data/api.ts";

import { IconOption } from "./IconOption.tsx";

const useStyles = makeStyles({
    iconList: {
        overflowX: "hidden",
        overflowY: "auto",
        flex: 1,
    }
})

export const ChooseIcon: React.FC = () => {
    const { icons } = useFetchMetadata();

    const { t } = useTranslation();

    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search);
    const filteredIcons = useMemo(() => {
        if (!deferredSearch) {
            return icons;
        }
        return icons.filter((icon) => {
            if (icon.includes(deferredSearch)) {
                return true;
            }
            if (t(`icon.${icon}`).includes(deferredSearch)) {
                return true;
            }
            const category = icon.split(".", 1)[0];
            if (t(`icon.${category}`).includes(deferredSearch)) {
                return true;
            }
            return false;
        })
    }, [deferredSearch, icons, t]);

    const styles = useStyles();
    

    return (
        <>
                <div role="search">
                    <Field
                        label={t("ui.choose_icon")}
                    >
                        <SearchBox 
                        value={search}
                        onChange={(_, {value}) => setSearch(value)}
                        placeholder={t("ui.search")}
                    />
                    </Field>
                </div>
                <div className={styles.iconList}>
                <div>
                        {filteredIcons.map((icon) => (
                        <IconOption key={icon} icon={icon} />
                        ))}
                </div>
                </div>
        </>
    );
}
