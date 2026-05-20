export interface IDashBoardModel {
    ModelVariantId: number,
    EntityTypeId: number,
    Title: string,
    AuthorName: string,
    Content: string,
    DisplayInList: boolean,
    Enabled: boolean,
    ThumbnailPath: any,
    RowOrder: number,
    Id: number,
    Created: any,
    CreatedBy: number,
    Active: boolean,
    Modified: any,
    ModifiedBy: number,
    IsValid: boolean,
    ValidationErrors: {
        Items: []
    }
}