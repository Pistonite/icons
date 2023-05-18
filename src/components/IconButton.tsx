import { DefaultButton, IButtonProps } from "@fluentui/react/lib/Button";
import React from "react";
import { getIconUrl, Palettes } from "../data";

type IconButtonProps = {
    iconPath: string;
} & IButtonProps;

export const IconButton: React.FC<IconButtonProps> = ({iconPath, ...restProps}) => {
    return (
        <DefaultButton styles={{
            root: {
                height: 60,
                margin: 4,
            }
        }}
        {...restProps}
        >
            <img src={getIconUrl(iconPath, "none", Palettes.StandardGray)} width={48}/>
        </DefaultButton>
    );
};