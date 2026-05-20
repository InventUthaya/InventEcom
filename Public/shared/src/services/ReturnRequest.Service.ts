import http from "./http";
import { ReturnRequestModel } from "../models/ReturnRequest.Model";

class ReturnRequestServices {
    private serviceName = '/ReturnRequest';

    updateReturnRequest(data: ReturnRequestModel) {
        return http.post(`${this.serviceName}/CreateReturn`, data).catch((err: Error) => {
            throw err?.message;
        })
    }
}

export default new ReturnRequestServices();