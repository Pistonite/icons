import { useQuery } from "@tanstack/react-query";

export type Metadata = {
    icons: string[],
    modifiers: string[]
}

export const useFetchMetadata = () => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ["meta"],
        queryFn: async () => (await fetch("/meta")).json() as Promise<Metadata>,
    });

    if (isLoading || !data || isError) {
        return { icons: [], modifiers: [] };
    }

    return data;
};
