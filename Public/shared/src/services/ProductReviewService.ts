import http from "./http";

class ProductReviewServices {
    private serviceName = '/review';

GetProductReviews(productId: any) {
    const url = `${this.serviceName}/GetProductReviews/${productId}`;

    return http
      .post(url, {})
      .catch((err: Error) => {
        throw err?.message;
      });
  }

}
export default new ProductReviewServices();