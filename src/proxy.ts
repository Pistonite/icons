import axios from "axios";

const LOCAL_SERVER = "http://localhost:8000";

export const setupProxy = () => {
    if (window.location.hostname === "localhost") {
        axios.defaults.baseURL = LOCAL_SERVER;
    }
};

export const proxyUrl = (url: string) => {
    if (window.location.hostname === "localhost") {
        return `${LOCAL_SERVER}${url}`;
    }
    return url;
};

