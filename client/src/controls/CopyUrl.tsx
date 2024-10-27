import {
    Button,
    Field,
    Input,
    makeStyles,
    Popover,
    PopoverSurface,
    PopoverTrigger,
} from "@fluentui/react-components";
import { CheckmarkCircle20Regular, Copy16Filled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

import { getIconUrl, useStore } from "data/store.ts";

const useStyles = makeStyles({
    container: {
        display: "flex",
        gap: "10px",
    },
    inputContainer: {
        flex: 1,
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
    },
    popup: {
        display: "flex",
        gap: "4px",
    },
});

export const CopyUrl: React.FC = () => {
    const { t } = useTranslation();
    const url = useStore(getIconUrl);
    const styles = useStyles();
    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <Field label={t("ui.url")}>
                    <Input value={url} />
                </Field>
            </div>
            <div className={styles.buttonContainer}>
                <Popover withArrow>
                    <PopoverTrigger>
                        <Button
                            appearance="primary"
                            icon={<Copy16Filled />}
                            onClick={() => {
                                navigator.clipboard.writeText(url);
                            }}
                        >
                            {t("ui.copy")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverSurface>
                        <div className={styles.popup}>
                            <CheckmarkCircle20Regular />
                            {t("ui.copied")}
                        </div>
                    </PopoverSurface>
                </Popover>
            </div>
        </div>
    );
};
