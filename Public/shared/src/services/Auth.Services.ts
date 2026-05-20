import http from "./http";
import { IRegistrationModel } from "../models/Registration.Model";
import { isTokenExpired } from "../components/helper/TokenHelper";
import { IloginModel } from "../models/Login.Model";

class AuthServices {
    private serviceName = '/auth';

    authenticate(data: IRegistrationModel) {
        return http.post(`${this.serviceName}/CreateUser`, data).catch((err) => {
            throw err?.message;
        });
    }

    otpauthenticate(PhoneNumber: any, Otp: any) {
        return http.post(`${this.serviceName}/authenticate/${PhoneNumber}/${Otp}`).catch((err: Error) => {
            throw err?.message
        });
    }

    signIn(PhoneNumber: any) {
        return http.post(`${this.serviceName}/signIn/${PhoneNumber}`).catch((err) => {
            throw err?.message;
        });
    }

    DeleteAccount(Id: any) {
        isTokenExpired();
        return http.get(`${this.serviceName}/DeleteAccount/?id=${Id}`).catch((err: Error) => {
            throw err?.message
        });
    }
}

export default new AuthServices();