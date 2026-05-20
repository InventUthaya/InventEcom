import { importSPKI, CompactEncrypt, importPKCS8, compactDecrypt } from "jose";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import FileSaver from "file-saver";
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { Directory, Filesystem, WriteFileResult } from "@capacitor/filesystem";
import { FileOpener, FileOpenerOptions } from "@capacitor-community/file-opener";
import { Capacitor } from "@capacitor/core";

export type dataTableDataTypes = 'boolean' | 'Amount' | 'int' | 'date' | 'datetime' | 'stringWith15char' | 'stringWith40Char' | 'utcdatetime' | 'utcdate' | 'licensedboolean' | 'mappedRm' | 'string' | 'datewithtimeago' | null;

export interface ITokenModel{
    Id: string,
    EmployeeCode: string,
    Name: string,
    Email: string,
    RoleId: string,
    exp: number,
}

export async function encryptPayload(payload: object, publicKeyPem: string): Promise<string> {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Payload must be a non-null object');
    }
    if (!publicKeyPem || typeof publicKeyPem !== 'string') {
        throw new Error('Public key PEM must be a non-empty string');
    }

    try {
        const publicKey = await importSPKI(publicKeyPem, 'RSA-OAEP-256');
        const payloadJson = JSON.stringify(payload);

        const jwe = await new CompactEncrypt(new TextEncoder().encode(payloadJson))
            .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
            .encrypt(publicKey);

        return jwe;
    } catch (error: any) {
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

export async function decryptPayload(jwe: string, privateKeyPem: string): Promise<object> {
    if (!jwe || typeof jwe !== 'string') {
        throw new Error('JWE string must be a non-empty string');
    }
    if (!privateKeyPem || typeof privateKeyPem !== 'string') {
        throw new Error('Private key PEM must be a non-empty string');
    }

    try {
        const privateKey = await importPKCS8(privateKeyPem, 'RSA-OAEP-256');
        const { plaintext, protectedHeader } = await compactDecrypt(jwe, privateKey);

        // Validate header algorithms
        if (protectedHeader.alg !== 'RSA-OAEP-256' || protectedHeader.enc !== 'A256GCM') {
            throw new Error('Invalid JWE header: expected RSA-OAEP-256 and A256GCM');
        }

        const decrypted = new TextDecoder().decode(plaintext);
        return JSON.parse(decrypted);
    } catch (error: any) {
        throw new Error(`Decryption failed: ${error.message}`);
    }
}

export const formatTableCell = (value: any, datatype: dataTableDataTypes | undefined) => {
    // if (datatype === 'boolean') {
    //     if (value === null) {
    //         return "-"
    //     } else {
    //         return value == true ? 'Active' : 'InActive';
    //     }
    // }
    if (datatype === "Amount") {
        return value !== null && value !== undefined ? `₹ ${value}` : "-";
    }

    if (datatype === "int") {
        return value !== null && value !== undefined ? value : "-";
    }

    if (datatype === "date") {
        return value && (moment(value).isValid() || moment(value, "DD-MM-YYYY").isValid())
            ? moment(value, ["DD-MM-YYYY", moment.ISO_8601]).format("DD-MM-YYYY")
            : "-";
    }

    if (datatype === "datetime") {
        return value && moment(value).isValid()
            ? moment(value).format("DD-MM-YYYY HH:mm")
            : "-";
    }

    if (datatype === "stringWith15char") {
        return typeof value === "string"
            ? value.length > 15
                ? `${value.slice(0, 15)}...`
                : value
            : "-";
    }

    if (datatype === "stringWith40Char") {
        return typeof value === "string"
            ? value.length > 40
                ? `${value.slice(0, 40)}...`
                : value
            : "-";
    }

    if (datatype === "utcdatetime") {
        return value && moment.utc(value).isValid()
            ? moment.utc(value).local().format("MM-DD-YYYY HH:mm")
            : "-";
    }

    if (datatype === "utcdate") {
        return value && moment.utc(value).isValid()
            ? moment.utc(value).local().format("MM-DD-YYYY")
            : "-";
    }

    if (datatype === "licensedboolean") {
        return value === true ? "Yes" : "No";
    }

    if (datatype === "mappedRm") {
        return value ?? "Un-Assigned";
    }

    return value !== null && value !== undefined ? value : "-";
};

export const restrictInput = (e: any, maxLength: number) => {
    if (e.target.value.length > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
    }
}

// export const getTokenData = () => {
//     try {
//         let token: string = CustomGetSessionStorage("token") as any;
//         let tokendata: TokenData = jwtDecode(token);
//         return tokendata;
//     }
//     catch (Error) {
//         return {} as TokenData
//     }
// }

export function createFormData<T>(obj: T, formData: FormData = new FormData(), prefix: string = ''): FormData {
    if (obj === null || obj === undefined) {
        return formData;
    }

    if (obj instanceof File) {
        formData.append(prefix, obj);
        return formData;
    }

    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            const arrayPrefix = `${prefix}[${index}]`;
            createFormData(item, formData, arrayPrefix);
        });
        return formData;
    }

    if (typeof obj === 'object' && !(obj instanceof Date)) {
        Object.entries(obj).forEach(([key, value]) => {
            if (value === undefined || value === null) {
                return;
            }

            const newPrefix = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'boolean' || typeof value === 'number') {
                formData.append(newPrefix, value.toString());
                return;
            }

            if (value instanceof File) {
                formData.append(newPrefix, value);
                return;
            }

            createFormData(value, formData, newPrefix);
        });
        return formData;
    }

    formData.append(prefix, obj.toString());
    return formData;
}

export const downloadMobileInvoice = async (file: any, path: any) => {
    Filesystem.writeFile({
        path: path,
        data: file,
        directory: Directory.Documents,
        recursive: true
    }).then((res: WriteFileResult) => {
        showInvoiceNotification(res.uri, path);
    }).catch(e => console.log(e));
};

const openDownloadedFile = async (uri: any) => {
    try {
        const fileOpenerOptions: FileOpenerOptions = {
            filePath: uri,
            openWithDefault: true,
        };
        await FileOpener.open(fileOpenerOptions);

    } catch (e) {
        console.log('Error opening file', e);
    }
};

const showInvoiceNotification = async (uri: any, name: any) => {
    let options: ScheduleOptions = {
        notifications: [
            {
                id: 1,
                title: name,
                body: "Download completed. Click to open!",
                extra: { uri: uri },
                actionTypeId: "open_pdf"
            }
        ]
    };

    try {
        await LocalNotifications.schedule(options);
    } catch (error) {
        console.log(error);
    }

    LocalNotifications.addListener('localNotificationActionPerformed', async (notification) => {
        if (notification.notification.actionTypeId === 'open_pdf') {
            const uri = notification.notification.extra.uri;
            openDownloadedFile(uri);
        }
    });
}


export const isTokenExpired = () => {
    let tokenData = localStorage.getItem("Token") as any;
    if (tokenData) {
        let result: any;
        if (tokenData) {
            let expirationDate: Date = getTokenExpirationDate(tokenData);
            let currentDateUTC: Date = new Date(new Date().toUTCString());
            let expirationDateUTC: Date = new Date(expirationDate.toUTCString());

            result = (currentDateUTC.valueOf() > expirationDateUTC.valueOf());
            if (result) {
                ProcessToken();
            }
            else {
                return false;
            }
        }
    }

    return false;
}
export const ProcessToken = () => {
    localStorage.clear();
    window.location.reload();
}

function getTokenExpirationDate(token: string): Date {
    let decoded: ITokenModel = jwtDecode(token);
    if (decoded === undefined) return new Date();
    let date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
}

export const downloadCSV = (csvData: any, fileName: string) => {
    const decodedData = atob(csvData);
    const blob = new Blob([decodedData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
};

export const downloadPDF = (pdfData: any, fileName: string) => {
    let stringWithQuotes = pdfData;
    let stringWithoutQuotes = stringWithQuotes.replace(/"/g, '');
    const byteArray = Uint8Array.from(atob(stringWithoutQuotes).split('').map(char => char.charCodeAt(0)));
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const file = new File([blob], fileName, { type: 'application/pdf' });
    FileSaver.saveAs(file);
}

export const CustomSetLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
    }
}

export const CustomGetLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
    }
}

export const CustomSetSessionStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, value);
    }
}

export const CustomGetSessionStorage = (key: string) => {
    if (typeof window !== "undefined") {
        return window.sessionStorage.getItem(key);
    }
}

export const isMobile = () => {
    if (Capacitor.isNativePlatform()) {
        return true;
    }
}