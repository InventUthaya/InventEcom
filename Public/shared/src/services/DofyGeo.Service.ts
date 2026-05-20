import http from "./http";
import { properHeader } from "../components/helper/Helper";

class DofyGeoServices {
    private serviceName = '/DofyGeo';

    getPincodeAvailability(pincode: any) {
        return http.get(`${this.serviceName}/GetPincodeAvailability?pincode=${pincode}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getImageSlider() {
        return http.get(`${this.serviceName}/getImageSlider`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetCityList(LanguageCode: any, CountryCode: any) {
        return http.get(`${this.serviceName}/GetCityList`, {
            headers: {
                "LanguageCode": properHeader(LanguageCode, "LanguageCode"),
                "CountryCode": properHeader(CountryCode, "CountryCode")
            }
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetStateList(serviceTypeId: any, LanguageCode?: any, CountryCode?: any) {
        return http.get(`${this.serviceName}/GetStateList?serviceTypeId=${serviceTypeId}`, {
            headers: {
                "LanguageCode": properHeader(LanguageCode, "LanguageCode"),
                "CountryCode": properHeader(CountryCode, "CountryCode")
            }
        }).catch((err: Error) => {
            throw err?.message;
        })
    }
    GetCityByStateList(serviceTypeId: any, StateId?: any, LanguageCode?: any, CountryCode?: any ) {
        return http.get(`${this.serviceName}/GetCityList?serviceTypeId=${serviceTypeId}&StateId=${StateId}`, {
            headers: {
                "LanguageCode": properHeader(LanguageCode, "LanguageCode"),
                "CountryCode": properHeader(CountryCode, "CountryCode")
            }
        }).catch((err: Error) => {
            throw err?.message;
        })
    }
    GetDofyGeoListBysearch(stateId?: any, searchText?: any, LanguageCode?: any, CountryCode?: any) {
        if (stateId) {
            return http.post(`${this.serviceName}/GetDofyGeoListBySearchText?searchText=${searchText}&parent=${stateId}`, {
            }).catch((err: Error) => {
                throw err?.message;
            })
        } else {
            return http.post(`${this.serviceName}/GetDofyGeoListBySearchText?searchText=${searchText}`, {
            }).catch((err: Error) => {
                throw err?.message;
            })
        }
    }
}

export default new DofyGeoServices();