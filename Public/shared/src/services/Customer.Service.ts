import { IRegistrationModel, UserModel } from "../models/Registration.Model";
import http from "./http";
// import { isTokenExpired } from "../components/helper/TokenHelper";
// import CustomerServices from "./Customer.Services";

class CustomerService {
    private serviceName = '/User';

    customerGetDetails(id: any) {

        return http.get(`${this.serviceName}/GetUserById?userId=${id}`).catch((err) => {
            throw err?.message;
        });
    }

    customerUpdateDetails(id: string, name: string, email: string, CustomerNumber: string) {

        return http.post(`${this.serviceName}/UpdateUser?id=${id}&userName=${name}&Email=${email}&CustomerNumber=${CustomerNumber}`,).catch((err) => {
            throw err?.message;
        });
    }

}

export default new CustomerService();