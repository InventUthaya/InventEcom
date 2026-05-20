export interface IContactUsModel {
    id: number,
    validationErrors: {},
    Username: string,
    MobileNumber: string,
    SecondaryMobile?:string,
    Email: string,
    description?: string,
    Subject: string,
    PasswordFormatId: any;
    IsTaxExempt: boolean;
    AffiliateId: any;
    Deleted:boolean;
}