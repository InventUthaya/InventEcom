import { IFindLocation } from "shared/src/models/PublicRequest.Model";
import http from "./http";
class CantFindServices {

    private serviceName = '/PublicRequest';

    createLocationRequest(data: IFindLocation) {
        return http.post(`${this.serviceName}/LocationRequest`, data).catch((err: Error) => {
            throw err?.message;
        })
    }
}

export default new CantFindServices();