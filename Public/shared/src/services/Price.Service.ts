import http from "./http";

class PriceServices {
    private serviceName = '/Price';
    private MasterserviceName = '/master';
    private readonly staticPriceList = [
        { PriceName: "Under 10,000" },
        { PriceName: "Above 10,000" },
        { PriceName: "Above 20,000" },
        { PriceName: "Above 30,000" },
        { PriceName: "Above 40,000+" },
    ];

    getShopByPrice() {
        return http.get(`${this.serviceName}/GetShopByPriceList`, {
        }).catch((err: Error) => {
            console.error("Falling back to static price list:", err);
            return { status: 200, data: this.staticPriceList };
        })
    }


    getBrandName() {
        return http.get(`${this.MasterserviceName}/brandlist`, {
        }).catch((err: Error) => {
            console.error("Falling back to empty brand list:", err);
            return { status: 200, data: [] };
        })
    }
    getQuality() {
        return http.get(`${this.MasterserviceName}/qualityList`, {
        }).catch((err: Error) => {
            console.error("Falling back to empty quality list:", err);
            return { status: 200, data: [] };
        })
    }
}



export default new PriceServices();