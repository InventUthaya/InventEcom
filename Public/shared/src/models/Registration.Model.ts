export interface IRegistrationModel {
    Username?: string,
    PhoneNumber?:string,
    Email?: string,
    Password?: string,
    ConfirmPassword?: string,
    id?: number;
    published?: boolean;
    validationErrors?: object;
    mobileNumber?: string;
    subject?: string;
    customerGuid?: any;
    passwordFormatId?: number;
    passwordSalt?: string;
    adminComment?: string;
    isTaxExempt?: boolean;
    affiliateId?: number;
    deleted?: boolean;
    isSystemAccount?: boolean;
    systemName?: string;
    lastIpAddress?: string;
    createdOnUtc?: string;
    lastLoginDateUtc?: string;
    lastActivityDateUtc?: string;
    salutation?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    company?: string;
    customerNumber?: string;
    birthDate?: string;
    gender?: string;
    vatNumberStatusId?: number;
    timeZoneId?: string;
    taxDisplayTypeId?: number;
    lastForumVisit?: string;
    lastUserAgent?: string;
    lastUserDeviceType?: string;
    billingAddress_Id?: number | null;
    shippingAddress_Id?: number | null;
    ivKey?: string;
    active?: boolean;
}

export interface UserModel{
    Username?: string,
    Email?: string,
    customerGuid?: any;
    Password?: string,
    passwordFormatId?: number;
    passwordSalt?: string;
    adminComment?: string;
    isTaxExempt?: boolean;
    affiliateId?: number;
    deleted?: boolean;
    isSystemAccount?: boolean;
    systemName?: string;
    lastIpAddress?: string;
    createdOnUtc?: string;
    lastLoginDateUtc?: string;
    lastActivityDateUtc?: string;
    salutation?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    company?: string;
    CustomerNumber?: string;
    birthDate?: string;
    gender?: string;
    vatNumberStatusId?: number;
    timeZoneId?: string;
}