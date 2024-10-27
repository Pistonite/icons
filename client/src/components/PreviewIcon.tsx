import { Field, makeStyles } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type PreviewIconProps = {
    background: string;
    url: string;
};

const PREVIEW_UPDATE_THROTTLE = 100;

const useStyles = makeStyles({
    iconContainer: {
        width: "100px",
        height: "100px",
        padding: "10px",
    },
});

export const PreviewIcon: React.FC<PreviewIconProps> = ({
    background,
    url,
}) => {
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = useState(url);
    useEffect(() => {
        if (url != previewUrl) {
            const handle = setTimeout(() => {
                setPreviewUrl(url);
            }, PREVIEW_UPDATE_THROTTLE);
            return () => clearTimeout(handle);
        }
    }, [url, previewUrl]);

    const styles = useStyles();

    return (
        <Field label={t("ui.preview")}>
            <div
                className={styles.iconContainer}
                style={{ backgroundColor: background }}
            >
                <img src={previewUrl} width="100%" height="auto" />
            </div>
        </Field>
    );
};
