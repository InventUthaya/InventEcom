import http from "./http";

class ProductServices {
    private serviceName = '/products';

    GetAllProductBySearch(searchText: string) {
        return http.get(`${this.serviceName}/GetAllProductBySearch`, {
            params: {
                searchText: searchText
            }
        }).catch((err: Error) => {
            throw err?.message;
        })
    }
    GetAllProducts() {
        return http.get(`${this.serviceName}/GetAllProducts`)
            .catch((err: Error) => {
                throw err?.message;
            });
    }

    GetProductDetailbyId(productId: any, attribute?: string) {
        const url = attribute
            ? `${this.serviceName}/GetProductById?productId=${productId}&attribute=${encodeURIComponent(attribute)}`
            : `${this.serviceName}/GetProductById?productId=${productId}`;

        return http.post(url, {}).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetProductDetailbyIdForAdmin(productId: any, attribute?: string) {
        const url = attribute
            ? `${this.serviceName}/GetProductByIdForAdmin?productId=${productId}&attribute=${encodeURIComponent(attribute)}`
            : `${this.serviceName}/GetProductById?productId=${productId}`;

        return http.post(url, {}).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetProductbyId(productId: any) {
        return http.get(`${this.serviceName}/GetProductById?productId=${productId}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getRelatedProduct(productName: any) {
        return http.post(`${this.serviceName}/GetRelatedProduct?productName=${productName}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getRelatedProductById(productId: any) {
        return http.get(`${this.serviceName}/GetRelatedProductById?productId=${productId}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getProductTagByProductId(productTagId: any) {
        return http.post(`${this.serviceName}/GetProductTagByProductId?productTagId=${productTagId}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getProductByPrice(price: any, categoryId: any) {
        let url = `${this.serviceName}/GetProductByPrice?price=${price}`;
        if (categoryId) {
            url += `&categoryId=${categoryId}`;
        }
        return http.post(url, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getProductByQuality(categoryId: any, Quality: any) {
        return http.post(`${this.serviceName}/GetQualityByProduct?categoryId=${categoryId}&productQuality=${Quality}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getProductSpecification(value: any) {
        return http.post(`${this.serviceName}/GetSpecificationFilter?productSpecification=${value}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getDiscountAppliedProducts() {
        return http.post(`${this.serviceName}/GetDiscountAppliedProducts`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getSpecificaionDetails() {
        return http.post(`${this.serviceName}/GetSpecificationDetails`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    // getCategoryBrandByFilter(filters: Record<string, string[]>) {
    //     let url = `${this.serviceName}/GetSpecificationFilter`;

    //     const queryParams = Object.entries(filters)
    //         .map(([key, values]) => `${key}=${values.join(",")}`)
    //         .join("&");

    //     if (queryParams) {
    //         url += `?${queryParams}`;
    //     }

    //     return http.post(url)
    //         .catch((err: Error) => {
    //             throw err?.message;
    //         });
    // }
    getCategoryBrandByFilter(filters: Record<string, string[]>) {
        let url = `${this.serviceName}/GetSpecificationFilter`;

        const queryParams = Object.entries(filters)
            .filter(([_, values]) => values && values.length > 0 && values.every(v => v))
            .map(([key, values]) => `${key}=${values.join(",")}`)
            .join("&");

        if (queryParams) {
            url += `?${queryParams}`;
        }

        return http.post(url)
            .catch((err: Error) => {
                throw err?.message;
            });
    }

    // getCategoryByFilter(categoryid: any) {
    //     return http.post(`${this.serviceName}/GetSpecificationFilter?CategoryId=${categoryid}`, {
    //     }).catch((err: Error) => {
    //         throw err?.message;
    //     });
    // }
    getCategoryByFilter(categoryid: any) {
        let url = `${this.serviceName}/GetSpecificationFilter`;

        if (categoryid) {
            url += `?CategoryId=${categoryid}`;
        }

        return http.post(url)
            .catch((err: Error) => {
                throw err?.message;
            });
    }

    getHomePageCategoryByFilter(clientLocalTime?: string) {
        return http.post(`${this.serviceName}/GetHomePageFilter`, clientLocalTime)
            .catch((err: Error) => {
                throw err?.message;
            });
    }

    getAllProductForFilter() {
        let url = `${this.serviceName}/GetSpecificationFilter`;
        return http.post(url)
            .catch((err: Error) => {
                throw err?.message;
            });
    }

}

export default new ProductServices();