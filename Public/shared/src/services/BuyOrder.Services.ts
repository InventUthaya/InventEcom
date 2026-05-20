import http from "./http";
import { IOrderModel } from "../models/BuyOrder.Model";
import { ICancelOrderPayload } from "../models/Cancellation.Model";

class SellOrderServices {
  private serviceName = "/order";

  Checkout(data: IOrderModel) {
    return http.post(`${this.serviceName}/Checkout`, data).catch((err: Error) => {
      throw err?.message;
    })
  }

  BulkOrder(data: any[]) {
    return http.post(`${this.serviceName}/CreateBulkOrder`, data).catch((err: Error) => {
      throw err?.message;
    })
  }

  UpdateBulkOrder(data: IOrderModel[]) {
    return http.post(`${this.serviceName}/UpdateBulkOrder`, data).catch((err: Error) => {
      throw err?.message;
    })
  }

  cancelOrder(data: any) {
    return http.post(`${this.serviceName}/CancelOrder`, data)
      .catch((err: Error) => {
        throw err?.message;
      })
  }

  CancelOrder(data: ICancelOrderPayload) {
    return http.post(`${this.serviceName}/CancelOrder`, data, {
    }).catch((err: Error) => {
      throw err?.message;
    })
  }

  CancelBulkOrder(orderId: string, PersonId: any) {
    return http.get(`${this.serviceName}/CancelBulkOrder/${orderId}?customerId=${PersonId}`, {
    }).catch((err: Error) => {
      throw err?.message;
    })
  }

  getDetailByOrderId(orderId: any) {
    return http.post(`${this.serviceName}/GetOrderDetails?orderId=${orderId}`, {
    }).catch((err: Error) => {
      throw err?.message;
    })
  }

  DeleteOrderById(orderId: any, PersonId: any) {
    return http.get(`${this.serviceName}/DeleteOrderById/${orderId}?customerId=${PersonId}`, {
    }).catch((err: Error) => {
      throw err?.message;
    })
  }

  getReturnDaysConfig() {
    return http.get(`${this.serviceName}/GetReturnDaysConfig`, {
    }).catch((err: Error) => {
      throw err?.message;
    })
  }

  updateOrder(data: any) {
    return http.post(`${this.serviceName}/UpdateOrder`, data).catch((err: Error) => {
      throw err?.message;
    })
  }


  AddAddress(data: any) {
    return http.post(`${this.serviceName}/AddAddress`, data).catch((err: Error) => {
      throw err?.message;
    })
  }


  GetImage(productId: number, categoryId: number) {
    return http
      .get(`${this.serviceName}/GetImage/${productId}/${categoryId}`)
      .catch((err: Error) => {
        throw err?.message;
      });
  }

  // In your BuyOrderServices file (or wherever you define http)

  submitProductReview(formData: FormData) {
    return http.post(
      `${this.serviceName}/SubmitProductReview`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

}

export default new SellOrderServices();
