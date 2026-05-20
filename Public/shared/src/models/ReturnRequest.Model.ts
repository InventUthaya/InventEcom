export interface ReturnRequestModel {
    storeId: number;
    OrderId: number;
    UserId: number;
    quantity: number;
    Reason: string;
    requestedAction: string;
    customerComments: string;
    returnRequestStatusId: number;
    OrderDetailId: number;
    SkuId : number;
    RefundAmount : number;
}
