import http from "./http";

class TrackOderServices {
    private serviceName = '/order';

    GetOrderByCustomerId(customerId: any, filterType?: any) {
        const encodedFilter = filterType ? encodeURIComponent(filterType) : '';
        return http.post(`${this.serviceName}/GetOrderByCustomerId?customerId=${encodeURIComponent(customerId)}&filterType=${encodedFilter}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    DownloadOrdersList(orderId: number) {
        return http.get(`${this.serviceName}/GenerateInvoice?orderId=${orderId}`, {
         }).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetOrderById(OrderId: any) {
        return http.post(`${this.serviceName}/GetOrderDetails?orderId=${OrderId}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

}

export default new TrackOderServices();