import { Capacitor } from "@capacitor/core";
import cookie from "cookie"
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ILocalStorageModel, ITokenModel } from "shared/src/models/LocalStorage.Model";
var CryptoJS = require("crypto-js");

export const AES_EncryptionKey = "DOFYECOMMERCEKEY";

type IPlatformDetail = {
    PlatformType: any
    Platform: any
    PlatformVersion: any
    PlatformOS: any
}

export const IsLogginUser = () => {
    if (typeof window !== "undefined") {
        const validUser = getAuthToken().token;
        if (validUser) {
            return window.location.href = "/";
        }
    }
}

export const authUser = () => {
    if (typeof window !== "undefined") {
        const validUser = getAuthToken().token;
        if (!validUser) {
            return window.location.href = "/";
        }
    }
}

export const GetDefaultHome = (data: any, pathRef: any) => {
    let router = useRouter()

    if (findWindow()) {
        if (data === 0 || data === null || data === undefined || !data) router.push(`/${getUserLanguage()}${getUserLocationForParam("")}/${pathRef}`);

    }
}

export const GetHome = (data: any) => {
    let router = useRouter()

    if (findWindow()) {
        if (data === 0) router.push(`/${getUserLanguage()}${getUserLocationForParam("")}`);
        ;
    }
}

export const getAuthToken = () => {
    if (findWindow()) {
        let token: { token: any } = JSON.parse(localStorage.getItem("token") as any);
        return token ? token : {} as { token: any }
    }
    return {} as { token: any }
}

export const GetPlatformDetail = () => {
    if (findWindow()) {
        let platformDetail: IPlatformDetail = findWindow() && JSON.parse(localStorage.getItem("platform") as any);
        return platformDetail ? platformDetail : {} as IPlatformDetail
    }
    return {} as IPlatformDetail
}


export const getLocalStorage = () => {
    if (findBrowser()) {
        try {
            let token: string = localStorage.getItem("token") as string;
            let tokendata: ITokenModel = jwtDecode(token);
            return tokendata;
        }
        catch (Error) {
            return {} as ITokenModel
        }
    }
}

export const getEncryptedPersonId = () => {
    if (findBrowser()) {
        try {
            let personId = getLocalStorage()?.PersonId;
            let encryptedPersonId = aes_encryption(personId) as any;
            return encryptedPersonId;
        }
        catch (Error) {
            return null;
        }
    }
}
const keyValue = CryptoJS.enc.Utf8.parse(AES_EncryptionKey);

export const aes_encryption = (id: any) => {
    let encryptedId = CryptoJS.AES?.encrypt((id)?.toString(), keyValue, { keySize: 192 / 8, iv: keyValue, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
    let modifiedEncryptedValue = encryptedId.replaceAll("/", "_").replaceAll("+", "-");
    return modifiedEncryptedValue;
}


export const aes_decryption = (encryptedId: any) => {
    var bytes = CryptoJS.AES?.decrypt(encryptedId, keyValue, { keySize: 192 / 8, iv: keyValue, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    var decryptedId = bytes.toString(CryptoJS.enc.Utf8);
    let modifiedDecryptedValue = decryptedId.replaceAll("_", "/").replaceAll("-", "+");
    return modifiedDecryptedValue;
}

export const encryptData = (data: any) => {
    let jsonData = JSON.stringify(data.token.Token);
    let ciphertext = CryptoJS.AES.encrypt(jsonData, AES_EncryptionKey).toString();
    localStorage.setItem('token', ciphertext);
    return ciphertext;
};

export const decryptData = (ciphertext: any) => {
    let bytes = CryptoJS.AES.decrypt(ciphertext.toString(), AES_EncryptionKey);
    let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    let data: ILocalStorageModel = JSON.parse(decryptedData);
    return data
};

export const getUserLocation = () => {
    if (findWindow()) {
            let location = JSON.parse(localStorage.getItem("userLocation_ar") as any);
            return location
        // let location = JSON.parse(localStorage.getItem("userLocation") as any);
        // return location
    }
}

export const ExistingLocation = (): "in_en" | "ae_en" | "ae_ar" => {
    if (findWindow()) {
        let existingLocation = localStorage.getItem("Ln") as "in_en" | "ae_en" | "ae_ar";
        if (existingLocation) {
            return existingLocation;
        }

        else {
            localStorage.setItem("Ln", 'in_en');
            return "in_en";
        }
    }
    return "in_en";
}

export const getUserLocationForParam = (locationParam: any) => {
    if (findWindow()) {
        let location: string = JSON.parse(localStorage.getItem("userLocation") as any);
        if (location == null) {
            if (locationParam == "") {
                if (getUserLanguage() == "in_en") {
                    return "/india"

                }
                return "/uae"
            }
            if (locationParam == "in_en") {
                return "/india"

            }
            return "/uae"
        }
        return '/' + location?.replaceAll(' ', '');
    }
}

export const toAmount = (amount: any) => {
    return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const onKeyDown = (e: any) => {
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '+', '-', '.', '!', '@', '#', '$', '%',
        '^', '&', '*', '(', ')', '`', '~', '>', '<', ',', '.', '?', '/', '[', ']', '{', '}', '|', '=', '_', '/', '₹', ';', ':', "'", '"', " "].includes(e.key.toLowerCase()) && e.preventDefault();
}

export const onKeyDownForSearch = (e: any, wordLength: any) => {
    return wordLength >= 1 ? ['+', '-', '.', '!', '@', '#', '$', '%',
        '^', '&', '*', '(', ')', '`', '~', '>', '<', ',', '.', '?', '/', '[', ']', '{', '}', '|', '=', '_', '/', '₹', ';', ':', "'", '"'] : ['+', '-', '.', '!', '@', '#', '$', '%',
            '^', '&', '*', '(', ')', '`', '~', '>', '<', ',', '.', '?', '/', '[', ']', '{', '}', '|', '=', '_', '/', '₹', ';', ':', "'", '"', " "].includes(e.key.toLowerCase()) && e.preventDefault();
}

export const restrictInput = (e: any, maxLength: number) => {
    if (e.target.value.length > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
    }
}

export const roundUpNearest10 = (num: number) => {
    return Math.ceil(num / 10) * 10;
}

export const isValidUser = (userId: number) => {
    if (findWindow()) {
        let encryptedUserId = aes_encryption(userId);
        const loginUser = getLocalStorage()?.PersonId;

        if (loginUser !== encryptedUserId) {
            return window.location.href = `/${getUserLanguage()}${getUserLocationForParam("")}/`;
        }
    }
}

export const findPostiveNumber = (num: number) => (num < 0) ? "color-danger" : "color-success";

export function handleKeyEnter(e: any, keyWord: string, length: number, callBack: any) {
    const { key } = e;
    if (key === 'Enter' && keyWord.length === length) callBack();
}

export const getUserLanguage = (): "in_en" | "ae_en" | "ae_ar" => {
    // resetLocation();
    if (typeof window !== "undefined") {

        let existingLocation = localStorage.getItem("Ln") as "in_en" | "ae_en" | "ae_ar" ;
        let ae_en = window.location.origin.includes('ae');

        if (Capacitor.isNativePlatform()) {
            if (existingLocation === 'ae_en') {
                localStorage.setItem("Ln", 'ae_en');
                return "ae_en";
            }

            if (existingLocation === "ae_ar") {
                localStorage.setItem("Ln", 'ae_en');
                // localStorage.setItem("Ln", 'ae_ar');
                return "ae_en";
                // return "ae_ar";
            }

            if (existingLocation) {
                return existingLocation;
            }

            else {
                localStorage.setItem("Ln", 'in_en');
                return "in_en";
            }
        }
        else {
            if (!ae_en) {
                localStorage.setItem("Ln", 'in_en');
                return "in_en";
            }
            if (ae_en && existingLocation === "ae_en") {
                localStorage.setItem("Ln", 'ae_en');
                return "ae_en";
            }

            if (ae_en && existingLocation === "ae_ar") {
                localStorage.setItem("Ln", 'ae_en');
                // localStorage.setItem("Ln", 'ae_ar');
                // return "ae_ar";
                return "ae_en";
            }

            if (ae_en) {
                localStorage.setItem("Ln", 'ae_en');
                return "ae_en";
            }

            if (existingLocation) {
                return existingLocation;
            }

            else {
                localStorage.setItem("Ln", 'in_en');
                return "in_en";
            }
        }
    }
    return "ae_en";
}

export const SSRDetection = (context: { query: { ln: "in_en" | "ae_en" | "ae_ar"; }; req: { headers: { host: string | string[]; }; }; }, type: "lan" | "dir"): any => {
    let isUAE = context.req.headers.host.includes('ae');
    let language = context.query.ln;

    if (type === "lan") {
        if (isUAE) {
            return language ? language : "ae_en";
        }
        else {
            return "in_en"
        }
    }
    if (type === "dir") {
        if (isUAE && language == "ae_ar") {
            return "rtl";
        }
        else {
            return "ltr"
        }
    }
    return "";
}

export const RTLDirection = () => {
    if (typeof window !== "undefined") {
        let htmlElements = document.querySelectorAll('.rtl');
        if (getUserLanguage() == "ae_ar") {
            htmlElements.forEach(element => (
                element?.setAttribute("dir", "rtl")
            ));
        }
        else {
            htmlElements.forEach(element => (
                element?.removeAttribute("dir")
            ));
        }
    }
}

export const Direction = (): "rtl" | "ltr" => {
    if (getUserLanguage() == "ae_ar") {
        return "rtl";
    }
    else {
        return "ltr";
    }
}

export const isRTL = () => {
    if (getUserLanguage() == "ae_ar") {
        return true;
    }
    else {
        return false;
    }
}

export const findedLocation = (): { LanguageCode: string, CountryCode: string } => {
    if (getUserLanguage() == "ae_ar") {
        return { LanguageCode: "ar", CountryCode: "ae" }
    }
    if (getUserLanguage() == "ae_en") {
        return { LanguageCode: "en", CountryCode: "ae" }
    }
    else {
        return { LanguageCode: "en", CountryCode: "in" }
    }
}

export const isIn = () => {
    if (getUserLanguage() == "in_en") {
        return true;
    }
    else {
        return false;
    }
}

export const resetLocation = () => {
    if (findWindow()) {
        let currentPath = window.location.pathname.split('/')[1];
        let existingLocation = localStorage.getItem("Ln");

        if (existingLocation && currentPath && (currentPath.slice(0, 2) != existingLocation?.slice(0, 2))) {
            localStorageClearHandler();
        }
    }
}

export const currencyByCountry = (amount: any) => {
    return `₹ ${amount}`;
}

export function removeItem(sKey: string | number | boolean, sPath?: string, sDomain?: string) {
    document.cookie = encodeURIComponent(sKey) +
        "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
        (sDomain ? "; domain=" + sDomain : "") +
        (sPath ? "; path=" + sPath : "");
}

export const localStorageClearHandler = () => {
    if (findWindow()) {
        removeItem('token', "/");
        removeItem('personId', "/");
        localStorage.setItem("isTokenSend", 'no')
        let existingPermission = localStorage.getItem('permission') as string;
        let existingLocation = localStorage.getItem("Ln") as string;
        let existingRTToken = localStorage.getItem('RT') as string;
        localStorage.clear();
        localStorage.setItem('Ln', existingLocation);
        localStorage.setItem('permission', existingPermission);
        localStorage.setItem('RT', existingRTToken);

    }
}

export const countrycodenumber = (val: any) => (val ? isIn() ? `+91-${val}` : `+91-${val}` : "");

export const findBrowser = () => {
    if (typeof window !== "undefined" || typeof document !== "undefined") {
        return true;
    }
    else {
        return false;
    }
}

export const findWindow = () => {
    if (typeof window !== "undefined") {
        return true;
    }
    else {
        return false;
    }
}

export const findDocument = () => {
    if (typeof document !== "undefined") {
        return true;
    }
    else {
        return false;
    }
}

export const androidDevice = () => {
    if (typeof document !== "undefined") {
        return Capacitor.getPlatform() == "android"
    }
    else {
        return false;
    }
}

export const IOSDevice = () => {
    if (typeof document !== "undefined") {
        return Capacitor.getPlatform() == "ios"
    }
    else {
        return false;
    }
}

export const capacitorDevice = () => {
    if (androidDevice() || IOSDevice()) {
        return false;
    }
    else {
        return true;
    }
}

export const getCookie = (cname: string) => {
    if (findWindow()) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c?.charAt(0) == ' ') {
                c = c?.substring(1);
            }
            if (c.indexOf(name) == 0) {
                let data = c?.substring(name.length, c.length);
                return JSON.parse(data);
            }
        }
        return "";
    }
}

export const getCookiesFromServer = (req: any) => {
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export const properHeader = (val: string, type: "LanguageCode" | "CountryCode") => {
    if (val == "" && type === "LanguageCode") {
        return findedLocation().LanguageCode;
    }
    if (val == "" && type === "CountryCode") {
        return findedLocation().CountryCode;
    }
    return val;
}

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState<number | any>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []); 
    return windowSize;
}


export const NoCache = () => {
    if (typeof window !== "undefined") {
        localStorage.setItem("Cache-Control", "no-store, no-cache, must-revalidate");
    }
};

export const NeedCache = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("Cache-Control");
    }
};

export const getCacheControl = () => {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem("Cache-Control");
        return value ? value : "";
    }
    return null;
}

export const getStateName = () => {
    if (typeof window !== "undefined") {
        let stateName = JSON.parse(localStorage.getItem("StateName") as any);
        return stateName ? stateName : null;
    }
    return null;
}

export const getDatalocalization = (value: "in_en" | "ae_en" | "ae_ar" = "in_en"): "in_en" | "ae_en" | "ae_ar" => {
    return value.replace("-", "_") as "in_en" | "ae_en" | "ae_ar";
}

export const getProductIdwithoutLogin = () => {
    if (findBrowser()) {
        try {
            let ProductId = localStorage.getItem("ProductId");
            return ProductId;
        }
        catch (Error) {
            return {}
        }
    }
}

export const EncodeParam = (param: any): any => {
    let encodedId = btoa(param);
    return encodedId;
}

export const DecodeParam = (param: any): any => {
    if (param) {
        let decodedId = atob(param);
        return decodedId;
    }
    else {
        return param;
    }
}

export const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) {
        return "0";
    }

    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    if (isNaN(numericPrice)) {
        return price.toString();
    }

    const roundedPrice = Math.round(numericPrice);
    const formattedPrice = roundedPrice.toString();

    const withCommas = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return withCommas;
};

export const convertStrToArr = (input: any, type: "Condition" | "Variant" | "Color") => {
    const result = input?.match(/{.*?}/g).map((item: any) =>
        Object.fromEntries(item.slice(1, -1).split(',').map((pair: any) => {
            const [key, value] = pair.split(':');
            return [key.trim(), isNaN(value) ? value?.trim() : Number(value)];
        }))
    );

    return result?.filter((item: any) => item.hasOwnProperty(type));
}

export const removeBracketValues = (text: string) => {
    return text?.replace(/\(\d+(?:,\d+)*\)/g, "");
};