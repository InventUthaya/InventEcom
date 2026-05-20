import http from "./http";
import { isTokenExpired } from 'shared/src/components/helper/TokenHelper';
import { findedLocation, getCacheControl, properHeader } from "shared/src/components/helper/Helper";
import { IBlogModel } from "../models/Blog.Model";

class BlogServices {
    private serviceName = '/Blog';

    GetAllBlogs(data: IBlogModel, LanguageCode: any, CountryCode: any) {
        return http.post(`${this.serviceName}/GetAllBlogs`, data, {
            headers: {
                "LanguageCode": properHeader(LanguageCode, "LanguageCode"),
                "CountryCode": properHeader(CountryCode, "CountryCode")
            },
        }).catch((err: Error) => {
            throw err?.message;
        })
    }

    GetBlogDetailByBlogId(urltitle: any, LanguageCode: any, CountryCode: any) {
        return http.post(`${this.serviceName}/GetBlogDetailByUrlTitle/${urltitle}`, {}, {
            headers: {
                "LanguageCode": properHeader(LanguageCode, "LanguageCode"),
                "CountryCode": properHeader(CountryCode, "CountryCode")
            },
        }).catch((err: Error) => {
            throw err?.message;
        })
    }
}

export default new BlogServices();