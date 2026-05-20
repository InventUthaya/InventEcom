import { jwtDecode } from "jwt-decode";
import { ILocalStorageModel, ITokenModel } from "../../models/LocalStorage.Model";
import { findBrowser } from './Helper';
import http from "shared/src/services/http";

export const isTokenExpired = () => {
    if (findBrowser()) {
        let token: ILocalStorageModel = JSON.parse(localStorage.getItem("token") as any);
        let result: any;
        if (token?.Token) {
            let date: Date = getTokenExpirationDate(token?.Token);
            result = !(date.valueOf() > new Date().valueOf());

            if (result || result === undefined) {
                let hours = getDifferenceInHours(date.valueOf(), new Date().valueOf());
                // let data = ProcessToken(hours <= 8, token?.Token);
                return hours >= 8 ? false : true; // logout after 8
            }
            else {
                return false;
            }
        }
        return false;
    }
}

export const ProcessToken = (isRefresh: boolean, token: any) => {
    if (findBrowser()) {

        if (isRefresh === true) {
            refreshToken(token).then((res: any) => {
                localStorage.setItem("token", JSON.stringify(res.data));
            });
        }
        else {
            localStorage.removeItem("token");
            window.location.reload();
            // To do
        }
    }
}

// function getDecodedAccessToken(token: string): any {
//     try {
//         let tokendata: ITokenModel = jwt_decode(token);
//         return tokendata;
//     }
//     catch (Error) {
//         return null;
//     }
// }

function getTokenExpirationDate(token: string): Date {
    if (findBrowser()) {
        let decoded: ITokenModel = jwtDecode(token);
        if (decoded === undefined) return new Date();
        let date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }
    return new Date()
}

export const getPersonDetail = () => {
    if (findBrowser()) {
        try {
            let token: string = localStorage.getItem("token") as string;
            let tokendata: ITokenModel = jwtDecode(token);
            return tokendata;
        }
        catch (Error) {
            return null;
        }
    }
}

function getDifferenceInHours(date1: number, date2: number) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60);
}

function refreshToken(token: any) {
    return http.post(`/auth/refreshToken/${token}`).catch((err: Error) => {
        throw err?.message;
    });
}