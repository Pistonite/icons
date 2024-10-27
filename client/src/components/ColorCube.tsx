import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export type ColorCubeProps = {
    color: string;
};

const useStyles = makeStyles({
    cube: {
        display: "inline-block",
        ...shorthands.border("1px", "solid", tokens.colorNeutralForeground1),
        width: "16px",
        height: "16px",
    },
});

export const ColorCube: React.FC<ColorCubeProps> = ({ color }) => {
    const styles = useStyles();
    return (
        <span
            aria-hidden
            className={styles.cube}
            style={{ backgroundColor: color }}
        >
            &nbsp;
        </span>
    );
};
