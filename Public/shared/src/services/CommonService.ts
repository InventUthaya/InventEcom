import http from "./http";

type Param = "id" | "scheduleDate" | "dateTime" | "ScheduleDate" | "startDate" | "statusEnumname" | "fileType" | "endDate" | "notificationId" | "countryId" | "stateId" | "roleId"|"currentDate";
type ContentType = "application/json-patch+json" | "application/json" | "multipart/form-data" | "blob";
type responseType = "blob" | 'arraybuffer'

class CommonService {
    get(ControllerName: string, ModelName: string, ContentType?: ContentType, responseType?: responseType) {
        return http.get(`/${ControllerName}/${ModelName}`, {
            headers: { 'Content-Type': `${ContentType}`, 'responseType': `${responseType}` }
        }).catch((err: Error) => {
            throw err?.message
        });
    }

    getWithQueryParam(ControllerName: string, ModelName: string, Param: Param, value: any) {
        return http.get(`/${ControllerName}/${ModelName}?${Param}=${value}`).catch((err: Error) => {
            throw err?.message
        });
    }

    getWithSingleParam(ControllerName: string, ModelName: string, value: any) {
        return http.get(`/${ControllerName}/${ModelName}?id=${value}`).catch((err: Error) => {
            throw err?.message
        });
    }

    getWithDoubleParam(ControllerName: string, ModelName: string, Param: Param, value1: any, Param2: Param, value2: any) {
        return http.get(`/${ControllerName}/${ModelName}?${Param}=${value1}&${Param2}=${value2}`).catch((err: Error) => {
            throw err?.message
        });
    }

    getWithTripleParam(ControllerName: string, ModelName: string, Param: Param, value: any, Param2: Param, value2: any, Param3: Param, value3: any) {
        return http.get(`/${ControllerName}/${ModelName}?${Param}=${value}&${Param2}=${value2}&${Param3}=${value3}`).catch((err: Error) => {
            throw err?.message
        });
    }

    post(ControllerName: string, ModelName: string, data: any) {
        return http.post(`/${ControllerName}/${ModelName}`, data).catch((err: Error) => {
            throw err?.message
        });
    }

    postWithSingleParam(ControllerName: string, ModelName: string, value1: any,) {
        return http.post(`/${ControllerName}/${ModelName}/${value1}`).catch((err: Error) => {
            throw err?.message
        });
    }

    postWithQueryParam(ControllerName: string, ModelName: string, Param: Param, value: any, contentType: ContentType) {
        return http.post(`/${ControllerName}/${ModelName}?${Param}=${value}`, {
            headers: { 'Content-Type': `${contentType}` }
        }).catch((err: Error) => {
            throw err?.message
        });
    }

    postWithDoubleParam(ControllerName: string, ModelName: string, Param: Param, value1: any, Param2: Param, value2: any) {
        return http.post(`/${ControllerName}/${ModelName}?${Param}=${value1}&${Param2}=${value2}`).catch((err: Error) => {
            throw err?.message
        });
    }

    postWithFormData(ControllerName: string, ModelName: string, data: any) {
        return http.post(`/${ControllerName}/${ModelName}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).catch((err: Error) => {
            throw err?.message
        });
    }


    postWithFormDataWithQueryParam(ControllerName: string, ModelName: string, data: any, Param: Param, value: any, contentType: ContentType) {
        return http.post(`/${ControllerName}/${ModelName}?${Param}=${value}`, data, {
            headers: { 'Content-Type': `${contentType}` }
        }).catch((err: Error) => {
            throw err?.message
        });
    }

    postWithFormDataWithDoubleQueryParam(ControllerName: string, ModelName: string, Param1: Param, Param2: Param, value1: any, value2: any) {
        return http.post(`/${ControllerName}/${ModelName}?${Param1}=${value1}&${Param2}=${value2}`, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).catch((err: Error) => {
            throw err?.message
        });
    }

    postWithToken(ControllerName: string, ModelName: string, data: any, token: any) {
        return http.post(`/${ControllerName}/${ModelName}`, data, {
            headers: {
                "XSRF-TOKEN": token,
            }
        }).catch((err: Error) => {
            throw err?.message
        });
    }

    deleteWithQueryParam(ControllerName: string, ModelName: string, Param: Param, value: any) {
        return http.delete(`/${ControllerName}/${ModelName}?${Param}=${value}`).catch((err: Error) => {
            throw err?.message
        });
    }
}
export default new CommonService();