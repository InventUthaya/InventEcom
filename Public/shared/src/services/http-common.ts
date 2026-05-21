import axios from "axios";
import { findedLocation, getAuthToken } from "../components/helper/Helper";

const CreateHttpInstance = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PUBLIC_API,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "LanguageCode": findedLocation().LanguageCode,
      "CountryCode": findedLocation().CountryCode,
    },
  });

  let activeRequests = 0;

  api.interceptors.request.use(
    (config) => {
      activeRequests++;
      if (activeRequests === 1 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('api_load_start'));
      }
      const  token  = getAuthToken();
      config.headers["Authorization"] = token ? `Bearer ${token}` : (process.env.NEXT_PUBLIC_PUBLIC_API_KEY ?? '');
      return config;
    },
    (error) => {
      activeRequests--;
      if (activeRequests === 0 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('api_load_end'));
      }
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      activeRequests--;
      if (activeRequests === 0 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('api_load_end'));
      }
      return response;
    },
    (error) => {
      activeRequests--;
      if (activeRequests === 0 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('api_load_end'));
      }
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default CreateHttpInstance;
