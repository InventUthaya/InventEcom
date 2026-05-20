import { IAddressModel } from "shared/src/models/Address.Model";
import http from "./http";
import { isTokenExpired } from 'shared/src/components/helper/TokenHelper';

class UserAddressServices {
    private serviceName = '/userAddress';

    create(data: any) {
        return http.post(`${this.serviceName}/Create`, data).catch((err: Error) => {
            throw err?.message;
        })
    }

    edit(data: any) {
        isTokenExpired();
        return http.post(`${this.serviceName}/edit`, data).catch((err: Error) => {
            throw err?.message;
        })
    }

    remove(id: string, personId: any) {
        isTokenExpired();
        return http.get(`${this.serviceName}/Remove?${id}?personId=${personId}`).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetAddressByCustomerId(personId: any) {
        isTokenExpired();
        return http.post(`${this.serviceName}/GetUserAddressByUserId?userId=${personId}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    UpdateAddressByCustomerId(personId: any, data:IAddressModel) {
        isTokenExpired();
        return http.post(`${this.serviceName}/AddorUpdateUserAddress?personId=${personId}`, data).catch((err: Error) => {
            throw err?.message;
        })
    }
}

export default new UserAddressServices();