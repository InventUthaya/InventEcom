import http from "./http";
import { AddCartModel } from "../models/Cart.Model";

class CartServices {
    private serviceName = '/order';

    getAllCart(customerId: any) {
        return http.post(`${this.serviceName}/GetShoppingCartDetails?customerId=${customerId}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    addCartItem(data: AddCartModel) {
        return http.post(`${this.serviceName}/CreateShoppingCartItem`, data).catch((err: Error) => {
            throw err?.message;
        })
    }

    deleteCartItem(itemId: any) {
        return http.post(`${this.serviceName}/Remove?cartId=${itemId}`)
            .catch((err: Error) => {
                throw err?.message;
            });
    }
}

export default new CartServices();