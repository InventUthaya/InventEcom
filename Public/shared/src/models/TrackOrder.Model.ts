export interface ITrackOrderItemModel {
    OrderId: number,
    EncryptedOrderId: any,
    CustomerId: number,
    BillingAddressId: number,
    OrderNumber: string,
    ProductName: string,
    OrderDate: string,
    MRP: any,
    SellingPrice: any,
    Price: number,
    OrderStatusId: number,
    FullName: string,
    Address1: string,
    PhoneNumber: string,
    FaxNumber: string,
    City: string,
    ZipPostalCode: string,
    StateProvinceId: number,
    StateName: string,
    CountryId: number,
    CountryName: string,
    FormattedMediaFileName: string,
    DiscountPricePercentage:string;
    ImagesPath?:string;
}

export interface ITrackOrderModel {
    RecordsCount: number,
    PageSize: number,
    Count: number,
    PageNumber: number,
    PageCount: number,
    IsFirstPage: boolean,
    HasPreviousPage: boolean,
    HasNextPage: boolean,
    IsLastPage: boolean,
    Items:ITrackOrderItemModel,
    ImagesPath?:string;
}