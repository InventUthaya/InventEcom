import http from "./http";

class MasterServices {
    private serviceName = '/master';

    GetAllProductTag() {
        return http.get(`${this.serviceName}/GetAllProductTag`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetAllCancellationType() {
        return http.get(`${this.serviceName}/GetAllCancellationType`).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetBannerList() {
        return http.post(`${this.serviceName}/GetBannerList`, {
        }).catch((err: Error) => {
            throw err?.message;
        });
    }
}

export default new MasterServices();