import http from "./http";
import { properHeader } from "../components/helper/Helper";

class MostVisitedProductsCustomerMappingServices {
    private serviceName = '/MostVisitedProductsCustomerMapping';

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
}

export default new MostVisitedProductsCustomerMappingServices();