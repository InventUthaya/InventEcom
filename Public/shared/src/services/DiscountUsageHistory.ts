import http from "./http";

class DiscountUsageHistoryServices {
    private serviceName = '/DiscountUsageHistory';

    removePromoCodeByOrderId(OrderId: any, discountId: any) {
        return http.get(`${this.serviceName}/Remove?orderId=${OrderId}&discountId=${discountId}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }


}

export default new DiscountUsageHistoryServices();