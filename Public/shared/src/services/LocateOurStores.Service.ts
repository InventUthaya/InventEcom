import { findedLocation, properHeader } from "shared/src/components/helper/Helper";
import http from "./http";
import { ILocateOurStoresModel } from "../models/LocateOurStores";

class LocateOurStoresServices {
    private serviceName = '/LocateOurStores';

    GetLocateOurStoresList(data: ILocateOurStoresModel, LanguageCode: any, CountryCode: any) {
        return http.post(`${this.serviceName}/GetLocateOurStoresList`, data, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetLocateOurStores() {
        return http
            .get(`${this.serviceName}/GetList`)
            .catch((err: Error) => {
                throw err?.message;
            });
    }
}

export default new LocateOurStoresServices();