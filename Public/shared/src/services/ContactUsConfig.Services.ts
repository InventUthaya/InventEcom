import http from "./http";

class ContactUsConfigServices {
    private serviceName = '/ContactUsConfig';

    GetContactUsConfigList() {
        return http.get(`${this.serviceName}/GetContactUsConfigList`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }
}

export default new ContactUsConfigServices();