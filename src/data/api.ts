import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { PaletteDef, Colors } from "./color";

export const useApiIcons = (): string[] => {
    const {isLoading, isError, error, data} = useQuery({
        queryKey: ["icons"],
        queryFn: async () => (await axios.get<string[]>("/icons")).data
    });

    if (isLoading) {
        return [];
    }

    if (isError) {
        console.error(error);
        return [];
    }

    const data2 = data.map(icon => icon.replace("/", "."));
    data2.sort();
    return data2;
};

const LOCAL_SERVER = "http://localhost:8000";

export const setupProxy = () => {
    if (window.location.hostname === "localhost") {
        axios.defaults.baseURL = LOCAL_SERVER;
    }
};

const proxyUrl = (url: string) => {
    if (window.location.hostname === "localhost") {
        return `${LOCAL_SERVER}${url}`;
    }
    return `${window.location.origin}${url}`;
};

export const getIconUrl = (icon: string, mod: string, palette: PaletteDef) => {
    const frame = typeof palette.frame === "string" ? Colors[palette.frame] : palette.frame;
    const center = typeof palette.center === "string" ? Colors[palette.center] : palette.center;
    const modifier = typeof palette.modifier === "string" ? Colors[palette.modifier] : palette.modifier;
    return proxyUrl(
        `/icon/${icon}.${mod}.${frame.outline.hex}.${frame.fill.hex}.${center.outline.hex}.${center.fill.hex}.${modifier.outline.hex}.${modifier.fill.hex}.png`
    );
}