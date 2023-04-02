import { DefaultButton, IButtonProps } from "@fluentui/react/lib/Button";
import React from "react";

type IconButtonProps = {
    iconGroup: string;
    icon: string;
} & IButtonProps;

export const IconButton: React.FC<IconButtonProps> = ({iconGroup, icon, ...restProps}) => {
    return (
        <DefaultButton styles={{
            root: {
                height: 60,
                margin: 4,
            }
        }}
        {...restProps}
        >
            <img src={`/img/${iconGroup}.${icon}.incomplete.none.png`} width={48}/>
        </DefaultButton>
    );
};