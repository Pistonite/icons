import { Stack } from "@fluentui/react";
import React, { PropsWithChildren } from "react";

export const Section: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <Stack
            styles={{
                root: {
                    margin: "16px",
                },
            }}
        >
            {children}
        </Stack>
    );
};