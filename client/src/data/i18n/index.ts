import {
    convertToSupportedLocale,
    detectLocale,
    initLocale,
} from "@pistonite/pure/pref";
import i18next, { type BackendModule } from "i18next";
import { initReactI18next } from "react-i18next";

const backend: BackendModule = {
    type: "backend",
    init: () => {},
    read: async (language: string, namespace: string) => {
        if (namespace !== "translation") {
            return undefined;
        }

        const locale = convertToSupportedLocale(language) || "en";
        return (await import(`./strings/${locale}.yaml`)).default;
    },
};

export const SupportedLanguages = ["en" as const, "zh" as const];

export const initI18n = async () => {
    initLocale({
        supported: SupportedLanguages,
        default: "en",
        persist: true,
    });
    await i18next.use(detectLocale).use(backend).use(initReactI18next).init();

    document.title = i18next.t("title");
};

// TODO: add to pure/pref
const localizedLanguageNames = new Map();
export const getLocalizedLanguageName = (language: string): string => {
    if (language === "zh" || language === "zh-CN") {
        return "\u7b80\u4f53\u4e2d\u6587";
    }
    if (language === "zh-TW") {
        return "\u7e41\u9ad4\u4e2d\u6587";
    }
    if (localizedLanguageNames.has(language)) {
        return localizedLanguageNames.get(language);
    }
    const languageWithoutLocale = language.split("-")[0];
    const localized = new Intl.DisplayNames([language], {
        type: "language",
    }).of(languageWithoutLocale);
    localizedLanguageNames.set(language, localized);
    return localized || language;
};
