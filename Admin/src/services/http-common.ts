import axios from "axios";

let apiBaseURL = "";
let baseAPISecureKey = "";
let isConfigLoaded = false;

// Load config from /public/config.json (client-side only)
const loadConfig = async () => {
    if (isConfigLoaded) return;
    try {
        const response = await fetch("/config.json");
        const config = await response.json();
        apiBaseURL = config.API_BASE_URL;
        baseAPISecureKey = config.BASE_API_SECURE_KEY;
        isConfigLoaded = true;
    } catch (error) {
        console.error("Failed to load config:", error);
    }
};

// Must be called on client side (e.g. in a useEffect or handler)
const CreateHttpInstance = async () => {
    if (typeof window === "undefined") {
        throw new Error("CreateHttpInstance can only be used on the client side");
    }

    await loadConfig();

    const token = sessionStorage.getItem("token");
    const userAPIKey = token ? `Bearer ${token}` : baseAPISecureKey;

    const api = axios.create({
        baseURL: apiBaseURL,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
        },
    });

    api.interceptors.request.use(
        (config) => {
            config.headers["Authorization"] = userAPIKey;
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            // You can handle errors globally here
            return Promise.reject(error);
        }
    );

    return api;
};

export default CreateHttpInstance;
