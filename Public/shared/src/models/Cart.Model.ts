export interface IItemModel {
    VATAmount: any;
    DiscountName:string;
    ShoppingCartId: number;
    EncryptedShoppingCartId: string;
    AttributesXml: string;
    ProductId: number;
    ProductName: string;
    Name?: string;
    FullDescription: string | null;
    ShortDescription: string;
    Price: number;
    OldPrice: number;
    FinalPrice: number;
    TotalPrice: number;
    OrderMinimumQuantity: number;
    ProductAttributeId: number;
    ProductAttribute: string;
    ProductVariantAttributeId: number;
    ProductVariantAttributeValue: string;
    AttributeKey: string;
    AttributeValue: string;
    SpecificationAttribute: string;
    SpecificationAttributeOption: string;
    Id: number;
    Published: boolean | null;
    IsValid: boolean;
    DiscountAmount:any;
    FormattedMediaFileName:any;
    DiscountPricePercentage:string;
    EncryptProductId?: string;
}

export interface ICartModel {
    RecordsCount: number,
    PageSize: number,
    Count: number,
    PageNumber: number,
    PageCount: number,
    IsFirstPage: boolean,
    HasPreviousPage: boolean,
    HasNextPage: boolean,
    IsLastPage: boolean,
    Items:IItemModel,
    ImagePath?:string;
}

export interface AddCartModel {
    userId: number;
    skuId: number[];
    quantity: number;
}