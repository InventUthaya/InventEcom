import { IContactUsModel } from "../models/ContactUs.Model";
import http from "./http";

class ContactUsServices {
    private serviceName = '/User';

    create(data: IContactUsModel) {
        return http.post(`${this.serviceName}/SubmitCustomer`, data).catch((err: Error) => {
            throw err?.message;
        })
    }

    getAddress() {
        return http.get(`${this.serviceName}/GetAddress`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getPersonbyId(id: any) {
        return http.get(`${this.serviceName}/GetPerson?loginId=${id}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getSellButtonConfig() {
        return http.get(`${this.serviceName}/GetSellButtonConfig`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }
}

export default new ContactUsServices();