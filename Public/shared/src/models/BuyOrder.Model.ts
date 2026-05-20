export interface IOrderModel {
    UserID: number;
    AddressID?: number | null;
    OrderAddress?: OrderAddress | null;
    PaymentMethod: string;
    SKUIds: string;
    PromoCode?: string | null;
    storeId?: number;
    discountUsageHistory?: IdiscountUsageHistory | null;
    orderItem?: IOrderItemModel[];
    EncryptedOrderId?: string | null;
    EncryptedCustomerId?: string | null;
    EncryptedBillingAddressId?: string | null;
    EncryptedShippingAddressId?: string | null;
    billingAddressId?: number | null;
    shippingAddressId?: number | null;
    customerCurrencyCode?: string | null;
    currencyRate?: number | null;
    productIds?: string | null;
}

export interface OrderAddress {
    OrderHeaderId?: number;
    AddressId?: number;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    State: string;
    Pincode: string;
    Country: string;
}

export interface IOrderItemModel {
    orderId?: number,
    productId: number,
    quantity: number,
    deliveryTimeId: number,
    attributeDescription?: any,
}

export interface IdiscountUsageHistory {
    discountId?: number | null,
    EncrptedDiscountId?: any
}

export interface IGetOrderModel {
    RecordsCount: number;
    PageNumber: number;
    PageSize: number;
    Count: number;
    PageCount: number;
    IsFirstPage: boolean;
    HasPreviousPage: boolean;
    HasNextPage: boolean;
    IsLastPage: boolean;
    Items: IGetOrderItemModel[];
}

export interface IGetOrderItemModel {
    [x: string]: any;
    Price: number,
    ProductName: string,
    OrderId: any,
    ProductId: any,
    OrderStatusId: number,
    OrderTotal: number,
    OldPrice: number,
    OrderNumber: string,
    DiscountAmount: any,
    DiscountPrice: any,
    OrderTotalOldPrice: any,
    CouponCode?: any,
    HasCouponCode?: boolean,
    DiscountId?: any,
    FinalTotalPrice?: any,
    AttributeDescription?: string,
    IsTaxExempt: boolean
}


// export interface IOrderModel {
//     id: number,
//     published: boolean,
//     validationErrors: { Items: [] },
//     orderNumber: string,
//     orderGuid: string,
//     storeId: number,
//     customerId: number,
//     billingAddressId: number,
//     shippingAddressId: number,
//     paymentMethodSystemName: string,
//     customerCurrencyCode: string,
//     currencyRate: number,
//     vatNumber: string,
//     orderSubtotalInclTax: number,
//     orderSubtotalExclTax: number,
//     orderSubTotalDiscountInclTax: number,
//     orderSubTotalDiscountExclTax: number,
//     orderShippingInclTax: number,
//     orderShippingExclTax: number,
//     orderShippingTaxRate: number,
//     paymentMethodAdditionalFeeInclTax: number,
//     paymentMethodAdditionalFeeExclTax: number,
//     paymentMethodAdditionalFeeTaxRate: number,
//     taxRates: string,
//     orderTax: number,
//     orderDiscount: number,
//     creditBalance: number,
//     orderTotalRounding: number,
//     orderTotal: number,
//     refundedAmount: number,
//     rewardPointsWereAdded: boolean,
//     checkoutAttributeDescription: string,
//     checkoutAttributesXml: string,
//     customerLanguageId: number,
//     affiliateId: number,
//     customerIp: string,
//     allowStoringCreditCardNumber: boolean,
//     cardType: string,
//     cardName: string,
//     cardNumber: string,
//     maskedCreditCardNumber: string,
//     cardCvv2: string,
//     cardExpirationMonth: string,
//     cardExpirationYear: string,
//     allowStoringDirectDebit: boolean,
//     directDebitAccountHolder: string,
//     directDebitAccountNumber: string,
//     directDebitBankCode: string,
//     directDebitBankName: string,
//     directDebitBIC: string,
//     directDebitCountry: string,
//     directDebitIban: string,
//     customerOrderComment: string,
//     authorizationTransactionId: string,
//     authorizationTransactionCode: string,
//     authorizationTransactionResult: string,
//     captureTransactionId: string,
//     captureTransactionResult: string,
//     subscriptionTransactionId: string,
//     purchaseOrderNumber: string,
//     paidDateUtc: string,
//     shippingMethod: string,
//     shippingRateComputationMethodSystemName: string,
//     deleted: boolean,
//     createdOnUtc: string,
//     updatedOnUtc: string,
//     rewardPointsRemaining: number,
//     hasNewPaymentNotification: boolean,
//     acceptThirdPartyEmailHandOver: boolean,
//     orderStatusId: number,
//     paymentStatusId: number,
//     shippingStatusId: number,
//     customerTaxDisplayTypeId: number,
//     isOpenBoxDelivery: boolean,
//     orderItem: IOrderItemModel
// }

// export interface IOrderItemModel {
//     id: number,
//     published: boolean,
//     validationErrors: { Items: [] },
//     orderItemGuid: string,
//     orderId: number,
//     productId: number,
//     sku: string,
//     quantity: number,
//     unitPriceInclTax: number,
//     unitPriceExclTax: number,
//     priceInclTax: number,
//     priceExclTax: number,
//     taxRate: number,
//     discountAmountInclTax: number,
//     discountAmountExclTax: number,
//     attributeDescription: string,
//     attributesXml: string,
//     downloadCount: number,
//     isDownloadActivated: boolean,
//     licenseDownloadId: number,
//     itemWeight: number,
//     bundleData: string,
//     productCost: number,
//     deliveryTimeId: number,
//     displayDeliveryTime: boolean,
//     gstPriceTax: number
// }
