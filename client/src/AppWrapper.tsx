import {
    FluentProvider,
    makeStaticStyles,
    webDarkTheme,
    webLightTheme,
} from "@fluentui/react-components";
import { useDark } from "@pistonite/pure-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";

const useStaticStyles = makeStaticStyles({
    body: {
        margin: 0,
        padding: 0,
    },
    "*": {
        boxSizing: "border-box",
        minHeight: 0,
        minWidth: 0,
    },
    ".react-colorful": {
        paddingTop: "16px",
        paddingBottom: "8px",
    },
});

const queryClient = new QueryClient();

export const AppWrapper: React.FC = () => {
    useStaticStyles();

    const isDark = useDark();

    return (
        <QueryClientProvider client={queryClient}>
            <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
                <App />
            </FluentProvider>
        </QueryClientProvider>
    );
};
