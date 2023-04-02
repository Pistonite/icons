import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type IconsResponse = {
    [group: string]: string[]
};
export const useApiIcons = () => {
    const {isLoading, isError, error, data} = useQuery({
        queryKey: ["icons"],
        queryFn: async () => (await axios.get<IconsResponse>("/icons")).data
    });

    if (isLoading) {
        return {};
    }

    if (isError) {
        console.error(error);
        return {};
    }

    return data;
};

type PalettesResponse = {
    [name: string]: {
        bg: string,
        fg: string,
        mod: string,
    }
};
export const useApiPalettes = () => {
    const {isLoading, isError, error, data} = useQuery({
        queryKey: ["palettes"],
        queryFn: async () => (await axios.get<PalettesResponse>("/palettes")).data
    });

    if (isLoading) {
        return {};
    }

    if (isError) {
        console.error(error);
        return {};
    }

    return data;
};

type ColorsResponse = {
    [name: string]: [string, string]
};
export const useApiColors = () => {
    const {isLoading, isError, error, data} = useQuery({
        queryKey: ["colors"],
        queryFn: async () => (await axios.get<ColorsResponse>("/colors")).data
    });

    if (isLoading) {
        return {};
    }

    if (isError) {
        console.error(error);
        return {};
    }

    return data;
};