export interface IReferralCodeModel {
    Id?: number,
    Created?: any,
    CreatedBy?: number,
    Active?: boolean,
    Modified?: any,
    ModifiedBy?: number,
    IsValid?: boolean,
    ValidationErrors?: {},
    Name?: string,
    DisplayName?: string,
    EnumName?: string,
    RowOrder?: number,
    Code?: string,
    UrlData?: string,
    Amount?: number
}