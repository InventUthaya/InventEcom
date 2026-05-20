export interface ICancellationModel {
    Name: string,
    DisplayName: string,
    EnumName: string,
    DisplayInList: boolean,
    RowOrder: number,
    Id: number,
    EncryptedId: string,
    Created: any,
    CreatedBy: number,
    Active: boolean,
    Modified: any,
    ModifiedBy: number,
    SecondLanguage: string,
    IsValid: boolean,
    ValidationErrors: {
        Items: []
    }
}

export interface ICancelOrderPayload {
    EncryptedId: any,
    EncryptedCustomerId: any,
    EncryptedCancellationTypeId: string,
    Comments: string,
}