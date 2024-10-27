import { makeStyles } from "@fluentui/react-components";

import { ChangeModifierColor } from "controls/ChangeModifierColor.tsx";
import { ChangeCenterColor } from "controls/ChangeCenterColor.tsx";
import { ChangeFrameColor } from "controls/ChangeFrameColor.tsx";
import { Preview } from "controls/Preview.tsx";
import { CopyUrl } from "controls/CopyUrl.tsx";
import { ChoosePalette } from "controls/ChoosePalette.tsx";
import { ChooseModifier } from "controls/ChooseModifier.tsx";
import { ChooseIcon } from "controls/ChooseIcon.tsx";
import { ChangeLanguage } from "controls/ChangeLanguage.tsx";
import { ChangeDark } from "controls/ChangeDark.tsx";
import { GotoGitHub } from "controls/GotoGitHub.tsx";

const useStyles = makeStyles({
    rootLayout: {
        display: "flex",
        containerType: "size",
        containerName: "foo",
        height: "100vh",
        width: "100vw",
        flexDirection: "row-reverse",
        "@media screen and (max-width: 680px)": {
            flexDirection: "column",
        },
        padding: "20px",
        gap: "20px",
    },
    searchContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    configContainer: {
        maxWidth: "400px",
        "@media screen and (max-width: 680px)": {
            maxWidth: "100%",
        },
    },
    actionContainer: {
        position: "fixed",
        right: "20px",
        top: "10px",
        display: "flex",
        gap: "8px",
    },
});

const App: React.FC = () => {
    const styles = useStyles();

    return (
        <>
            <div className={styles.actionContainer}>
                <ChangeDark />
                <GotoGitHub />
                <ChangeLanguage />
            </div>
            <div className={styles.rootLayout}>
                <div className={styles.searchContainer}>
                    <ChooseIcon />
                </div>
                <div className={styles.configContainer}>
                    <ChooseModifier />
                    <ChoosePalette />
                    <ChangeFrameColor />
                    <ChangeCenterColor />
                    <ChangeModifierColor />
                    <Preview />
                    <CopyUrl />
                </div>
            </div>
        </>
    );
};

export default App;
