import http from "./http";

class DiscountServices {
    private serviceName = '/PromoCode';

    getPromoCodeByPersonId(promoCode: any, PersonId: any) {
        return http.post(`${this.serviceName}/GetAvailablePromoCode?customerId=${PersonId}&promoCode=${promoCode}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }
}

export default new DiscountServices();