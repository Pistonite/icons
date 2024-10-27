import { CompoundButton, makeStyles } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

export type SelectIconButtonProps = {
    iconName: string;
    url: string;
    setIconName: (iconName: string) => void;
    selected: boolean;
};

const useStyles = makeStyles({
    button: {
        // flexDirection: "column",
        width: "200px",
        justifyContent: "start",
        margin: "4px",
    },
});

export const SelectIconButton: React.FC<SelectIconButtonProps> = ({
    iconName,
    url,
    setIconName,
    selected,
}) => {
    const { t } = useTranslation();
    const category = iconName.split(".", 1)[0];
    const styles = useStyles();
    return (
        <CompoundButton
            className={styles.button}
            secondaryContent={t(`icon.${category}`)}
            icon={
                <div>
                    <img src={url} width={48} height={48} />
                </div>
            }
            onClick={() => setIconName(iconName)}
            appearance={selected ? "primary" : "secondary"}
        >
            {t(`icon.${iconName}`)}
        </CompoundButton>
    );
};
