import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { initDark } from "@pistonite/pure/pref";

import { AppWrapper } from "./AppWrapper.tsx";

import { initI18n } from "data/i18n";

initDark({
    persist: true,
});
initI18n();

createRoot(document.getElementById("root") as HTMLDivElement).render(
    <StrictMode>
        <AppWrapper />
    </StrictMode>,
);
