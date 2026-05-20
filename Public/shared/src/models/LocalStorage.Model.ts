export interface ILocalStorageModel {
    Token: any,
    PersonId: any,
    name: string,
}

export interface ITokenModel {
    Email: string,
    MobileNumber: string,
    name: string,
    Password: string,
    PersonId: string,
    aud: string,
    exp: number,
    iss: string
}