import { Button } from "@fluentui/react-components";
import { useDark } from "@pistonite/pure-react";

export const GotoGitHub: React.FC = () => {
    const dark = useDark();
    return (
        <Button
            as="a"
            appearance="subtle"
            icon={
                <img
                    src={dark ? "/github-mark-white.svg" : "/github-mark.svg"}
                />
            }
            href="https://github.com/Pistonite/icons"
            target="_blank"
        />
    );
};
