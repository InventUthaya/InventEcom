import { AxiosRequestConfig } from "axios";
import { PRIVATE_KEY_PEM, PUBLIC_KEY_PEM } from "../components/helper/constants";
import { decryptPayload, encryptPayload } from "../components/helper/helperfunctions";
import createHttpInstance from "./http-common";

class Services {
    patch(arg0: string, arg1: string, arg2: { isActive: boolean; }, arg3: string) {
        throw new Error('Method not implemented.');
    }
    put(arg0: string, arg1: string, payload: { fullName: string; phone: string; isActive: boolean; userLogin: { userID: any; password?: string; email: string; }; userAddress: { addressLine1: string; addressLine2: string; city: string; state: string; postalCode: string; country: string; userId: any; isActive: boolean; }; roleMapping: { roleId: number; userId: any; isActive: boolean; }; }, arg3: string): any {
        throw new Error('Method not implemented.');
    }

    async get(controllerName: string, URL: string, queryString?: "noParam" | string, value?: any) {
        const http = await createHttpInstance();
        if (queryString === "noParam") {
            return http.get(`${controllerName}/${URL}`).catch((err: Error) => {
                throw err;
            });
        }
        return http.get(`${controllerName}/${URL}?${queryString}=${value}`).catch((err: Error) => {
            throw err;
        });
    }

    async postWithSinglyQueryParam(controllerName: string, URL: string, queryString?: string, value?: any) {
        const http = await createHttpInstance();
        return http.post(`${controllerName}/${URL}?${queryString}=${value}`).catch((err: Error) => {
            throw err;
        });
    }

    async postWithDoubleQueryParam(controllerName: string, URL: string, queryString1?: string, value1?: any, queryString2?: string, value2?: any) {
        const http = await createHttpInstance();
        return http.post(`${controllerName}/${URL}?${queryString1}=${value1}&${queryString2}=${value2}`).catch((err: Error) => {
            throw err;
        });
    }

    async getWithDoubleQueryParam(controllerName: string, URL: string, queryString1?: string, value1?: any, queryString2?: string, value2?: any) {
        const http = await createHttpInstance();
        return http.get(`${controllerName}/${URL}?${queryString1}=${value1}&${queryString2}=${value2}`).catch((err: Error) => {
            throw err;
        });
    }


    async getDecryptedJWEData(controllerName: string, URL: string, queryString?: "noParam" | string, value?: any) {
        const http = await createHttpInstance();
        if (queryString === "noParam") {
            const response = http.get(`${controllerName}/${URL}`).catch((err: Error) => {
                throw err;
            });
            const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
            return decryptedData;
        }
        const response = http.get(`${controllerName}/${URL}?${queryString}=${value}`).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }


    async getWithSingleParam(controllerName: string, URL: string, value?: any) {
        const http = await createHttpInstance();
        return http.get(`${controllerName}/${URL}/${value}`).catch((err: Error) => {
            throw err;
        });
    }

    async getDecryptedJWEDataWithSingleParam(controllerName: string, URL: string, value?: any) {
        const http = await createHttpInstance();
        const response = http.get(`${controllerName}/${URL}/${value}`).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async getWithDoubleParam(controllerName: string, URL: string, value?: any, value1?: any) {
        const http = await createHttpInstance();
        return http.get(`${controllerName}/${URL}/${value}/${value1}`).catch((err: Error) => {
            throw err;
        });
    }

    async getDecryptedJWEDataWithDoubleParam(controllerName: string, URL: string, value?: any, value1?: any) {
        const http = await createHttpInstance();
        const response = http.get(`${controllerName}/${URL}/${value}/${value1}`).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async postWithEntity(ControllerName: string, ModelName: string, data1: any) {
        const http = await createHttpInstance();
        return http.post(`/${ControllerName}/${ModelName}/${data1}`).catch((err: Error) => {
            throw err?.message
        });
    }


    async postWithSingleEntityWithData(ControllerName: string, ModelName: string, pathParam: any, requestData: any) {
        const http = await createHttpInstance();
        return http.post(`/${ControllerName}/${ModelName}/${pathParam}`, requestData).catch((err: Error) => {
            throw err?.message
        });
    }


    async postWithDoubleEntity(ControllerName: string, ModelName: string, data1: any, data2: any) {
        const http = await createHttpInstance();
        return http.post(`/${ControllerName}/${ModelName}/${data1}/${data2}`).catch((err: Error) => {
            throw err?.message
        });
    }

    async postDecryptedJWEDataWithDoubleEntity(ControllerName: string, ModelName: string, data1: any, data2: any) {
        const http = await createHttpInstance();
        const response = http.post(`/${ControllerName}/${ModelName}/${data1}/${data2}`).catch((err: Error) => {
            throw err?.message
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async getWithTripleParam(controllerName: string, URL: string, value?: any, value1?: any, value2?: any) {
        const http = await createHttpInstance();
        return http.get(`${controllerName}/${URL}/${value}/${value1}/${value2}`).catch((err: Error) => {
            throw err;
        });
    }

    async getDecryptedJWEDataWithTripleParam(controllerName: string, URL: string, value?: any, value1?: any, value2?: any) {
        const http = await createHttpInstance();
        const response = http.get(`${controllerName}/${URL}/${value}/${value1}/${value2}`).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async post(controllerName: string, URL: string, data: any, config?: AxiosRequestConfig) {
        const http = await createHttpInstance();
        return http.post(`${controllerName}/${URL}`, data, config).catch((err: Error) => {
            throw err;
        });
    }

    async postEncryptedData(controllerName: string, URL: string, data: any) {
        const http = await createHttpInstance();
        const encryptedData = await encryptPayload(data, PUBLIC_KEY_PEM);
        const response = http.post(`${controllerName}/${URL}`, encryptedData).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async postWithFormData(controllerName: string, URL: string, data: any) {
        const http = await createHttpInstance();
        return http.post(`${controllerName}/${URL}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).catch((err: Error) => {
            throw err;
        });
    }

    async postWithEncryptedFormData(controllerName: string, URL: string, data: any) {
        const http = await createHttpInstance();
        const encryptedData = await encryptPayload(data, PUBLIC_KEY_PEM);
        const response = http.post(`${controllerName}/${URL}`, encryptedData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async getWithSingleEntity(ControllerName: string, ModelName: string, value1: any,) {
        const http = await createHttpInstance();
        return http.get(`/${ControllerName}/${ModelName}/${value1}`).catch((err: Error) => {
            throw err;
        });
    }

    async getDecryptedJWEDataWithSingleEntity(ControllerName: string, ModelName: string, value1: any,) {
        const http = await createHttpInstance();
        const response = http.get(`/${ControllerName}/${ModelName}/${value1}`).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async getWithQueryDoubleParam(controllerName: string, URL: string, queryString: string, value?: any, queryStringName1?: string, value1?: any) {
        const http = await createHttpInstance();
        return http.get(`${controllerName}/${URL}?${queryString}=${value}&${queryStringName1}=${value1}`).catch((err: Error) => {
            throw err;
        });
    }

    async getDecryptedJWEDataWithQueryDoubleParam(controllerName: string, URL: string, queryString: string, value?: number, queryStringName1?: string, value1?: any) {
        const http = await createHttpInstance();
        const response = http.get(`${controllerName}/${URL}?${queryString}=${value}&${queryStringName1}=${value1}`).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async getWithQueryTripleParam(controllerName: string, URL: string, queryString: string, value?: any, queryStringName1?: string, value1?: any, queryStringName2?: string, value2?: any) {
        const http = await createHttpInstance();
        return http.get(`${controllerName}/${URL}?${queryString}=${value}&${queryStringName1}=${value1}&${queryStringName2}=${value2}`).catch((err: Error) => {
            throw err;
        });
    }

    async getDecryptedJWEDataWithQueryTripleParam(controllerName: string, URL: string, queryString: string, value?: any, queryStringName1?: string, value1?: any, queryStringName2?: string, value2?: any) {
        const http = await createHttpInstance();
        const response = http.get(`${controllerName}/${URL}?${queryString}=${value}&${queryStringName1}=${value1}&${queryStringName2}=${value2}`).catch((err: Error) => {
            throw err;
        });
        const decryptedData = await decryptPayload((await response).data, PRIVATE_KEY_PEM);
        return decryptedData;
    }

    async getArrayNumber(controllerName: string, URL: string, queryString: string, value: Array<number>) {
        const http = await createHttpInstance();

        let customParam = '';
        let i = 0

        if (value?.length > 0) {
            for (let res of value) {
                i++;
                if (i === value.length) {
                    customParam += queryString + "=" + res;
                }
                else {
                    customParam += queryString + "=" + res + "&";
                }
            }
        }

        return http.get(`${controllerName}/${URL}?${customParam}`).catch((err: Error) => {
            throw err;
        });
    }

    async getWithParams(controllerName: string, url: string, params: any) {
        const http = await createHttpInstance();

        const filteredParams = Object.fromEntries(
            Object.entries(params)
                .filter(([_, v]) => v !== null && v !== "")
                .map(([key, value]) => [key, String(value)]) 
        );

        const queryString = new URLSearchParams(filteredParams).toString();

        return http.get(`${controllerName}/${url}?${queryString}`);
    }

    async loadConfig() {
        let timeoutMinutes = 0;
        let warningMinutes = 0;

        try {
            const response = await fetch("/config.json");
            const config = await response.json();
            timeoutMinutes = config.AutoLogout.TimeoutMinutes;
            warningMinutes = config.AutoLogout.WarningMinutes;
        } catch (err) {
            throw err;
        }

        return { timeoutMinutes, warningMinutes };
    }

    async postWithTripleParam(controllerName: string, URL: string, value?: any, value1?: any, value2?: any, data?: any) {
        const http = await createHttpInstance();
        return http.post(`${controllerName}/${URL}/${value}/${value1}/${value2}`, data).catch((err: Error) => {
            throw err;
        });
    }

}

export default new Services();