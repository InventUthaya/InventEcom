import http from "./http";
import { properHeader } from "../components/helper/Helper";

class MostVisitedProductsServices {
    private serviceName = '/MostVisitedProducts';

    HandleAddorUpdate(data: any, LanguageCode?: any, CountryCode?: any) {
        return http.post(`${this.serviceName}/HandleAddorUpdate`, data, {
            headers: {
                "LanguageCode": properHeader(LanguageCode, "LanguageCode"),
                "CountryCode": properHeader(CountryCode, "CountryCode")
            },
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetMostVisitedProducts(LanguageCode?: any, CountryCode?: any) {
        return http.get(`${this.serviceName}/GetMostVisitedProducts`, {
            headers: {
                "LanguageCode": properHeader(LanguageCode, "LanguageCode"),
                "CountryCode": properHeader(CountryCode, "CountryCode")
            },
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    IsMostVisitedProductDisplayEnabled(LanguageCode?: any, CountryCode?: any) {
        return http.get(`${this.serviceName}/IsMostVisitedProductDisplayEnabled`, {
            headers: {
                "LanguageCode": properHeader(LanguageCode, "LanguageCode"),
                "CountryCode": properHeader(CountryCode, "CountryCode")
            },
        }).catch((err: Error) => {
            throw err?.message;
        })
    }
}

export default new MostVisitedProductsServices();