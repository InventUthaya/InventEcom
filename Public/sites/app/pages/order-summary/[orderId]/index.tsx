import React from 'react'
import { IGetOrderItemModel } from 'shared/src/models/BuyOrder.Model';
import OrderSummaryLayout from 'shared/src/pages/ordersummary/OrderSummaryLayout';

type OrderSummaryProps = {
    direction: string;
    language: "in_en" | "ae_en" | "ae_ar";
    orderId: any;
    isSSR?: boolean;
    orderItem?: IGetOrderItemModel;
    viewProductsItem?: IGetOrderItemModel
};

export default function index({ direction, language, orderId, orderItem, viewProductsItem }: OrderSummaryProps) {
    return (
        <OrderSummaryLayout direction={direction} language={language} orderId={orderId} viewProductsItem={{} as IGetOrderItemModel} orderItem={{} as IGetOrderItemModel} />
    )
}
