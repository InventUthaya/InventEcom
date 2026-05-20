import http from "./http";

class CategoryServices {
    private serviceName = '/Category';
     private productserviceName = '/products';

    getCategoryList() {
        return http.get(`${this.serviceName}/GetCategoryList`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getAllProductById(productIds: any) {
        return http.post(`${this.serviceName}/GetCategoryByProductId?productId=${productIds}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getAllCategoryByName(CategoryName: any) {
        return http.post(`${this.serviceName}/GetCategoryByProductId?categoryName=${CategoryName}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getAllCategoryByPrice() {
        return http.post(`${this.serviceName}/GetCategoryByProductId`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getParentCategory(parentId: any) {
        return http.get(`${this.serviceName}/GetParentCategoryList?parentId=${parentId}`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    // getShopByPrice() {
    //     return http.get(`${this.serviceName}/GetShopByPriceList`, {
    //     }).catch((err: Error) => {
    //         throw err?.message;
    //     })
    // }
    getAllCategory() {
        return http.get(`${this.serviceName}/GetAllCategory`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getShopByPrice() {
        return http.get(`${this.serviceName}/GetShopByPriceList`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getCategoryBrandByFilter(categoryId: any, productId: any) {
        let url = `${this.serviceName}/GetCategoryByProductId`;

        if (categoryId && productId) {
            url += `?categoryId=${categoryId}&brandId=${productId}`;
        } else if (categoryId) {
            url += `?categoryId=${categoryId}`;
        } else if (productId) {
            url += `?brandId=${productId}`;
        }

        return http.post(url)
            .catch((err: Error) => {
                throw err?.message;
            });
    }

    getBrandList() {
        return http.get(`${this.serviceName}/GetBrandByParentCategoryId`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getAllPhoneBrand() {
        return http.get(`${this.serviceName}/GetAllPhoneBrand`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    // getRamList() {
    //     return http.get(`${this.serviceName}/GetBrandByParentCategoryId`, {
    //     }).catch((err: Error) => {
    //         throw err?.message;
    //     })
    // }

    getHomeCategory() {
        return http.get(`${this.serviceName}/GetHomeCategory`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    getBrandsByCategory(categoryId: any) {
        return http.get(
            `${this.serviceName}/GetBrandByParentCategoryId?categoryId=${categoryId}`
        ).catch((err: Error) => {
            throw err?.message;
        });

    }

    getAllProducts() {
        return http.get(
            `${this.productserviceName}/GetAllProducts`
        ).catch((err: Error) => {
            throw err?.message;
        });
    }

    getCategoryProductsList() {
        return http.get(`${this.productserviceName}/GetAllCategoryProducts`, {
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

}

export default new CategoryServices();