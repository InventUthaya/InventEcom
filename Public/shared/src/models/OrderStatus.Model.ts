export interface IOrderStatusModel {
  RecordsCount: number;
  PageNumber: number;
  PageSize: number;
  Count: number;
  PageCount: number;
  IsFirstPage: boolean;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
  IsLastPage: boolean;
  Items: OrderItem[];
}

export interface OrderItem {
  OrderId: number;
  OrderNumber: string;
  OrderGuid: string;
  StoreId: number;
  CustomerId: number;
  OrderTotal: number;
  ShippingMethod: string | null;
  PaymentMethodSystemName: string | null;
  OrderSubtotalInclTax: number;
  OrderSubtotalExclTax: number;
  OrderShippingInclTax: number;
  OrderShippingExclTax: number;
  OrderTax: number;
  OrderDate: string;
  FullName: string;
  OrderStatusId: number;
  BillingAddressId: number;
  ShippingAddressId: number;
  Email: string;
  Address1: string;
  Address2: string;
  City: string;
  Country: string | null;
  ZipPostalCode: string;
  PhoneNumber: string;
  FaxNumber: string | null;
  ProductId: number;
  ProductName: string;
  Price: string;
  OrderMinimumQuantity: number;
  ProductAttributeId: number;
  ProductAttribute: string | null;
  ProductVariantAttributeValue: string | null;
  Id: number;
  Published: boolean | null;
  IsValid: boolean;
  OBDAvailability: boolean;
  ValidationErrors: ValidationError;
  OrderOTP?: string;
}

interface ValidationError {
  Items: string[];
}
