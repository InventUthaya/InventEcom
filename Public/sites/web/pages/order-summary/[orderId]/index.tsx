import { GetServerSideProps } from 'next';
import React from 'react'
import { Direction, getUserLanguage } from 'shared/src/components/helper/Helper';
import { IGetOrderItemModel } from 'shared/src/models/BuyOrder.Model';
import OrderSummaryLayout from 'shared/src/pages/ordersummary/OrderSummaryLayout';
import BuyOrderServices from 'shared/src/services/BuyOrder.Services';

type OrderSummaryProps = {
    direction: string;
    language: "in_en" | "ae_en" | "ae_ar";
    orderId: any;
    isSSR?: boolean;
    orderItem?: IGetOrderItemModel;
    viewProductsItem?: IGetOrderItemModel
};

const fetchData = async (context: any): Promise<OrderSummaryProps> => {
    const direction = Direction();
    const language = getUserLanguage();
    const orderId = context.query.orderId || context.params.orderId || null;

    let orderItem = {} as IGetOrderItemModel;
    let viewProductsItem = {} as IGetOrderItemModel;

    if (orderId) {
        try {
            const orderRes = await BuyOrderServices.getDetailByOrderId(orderId);
            if (orderRes.status === 200) {
                orderItem = orderRes?.data?.Items;
                viewProductsItem = orderRes?.data;
            }
        } catch (err) {
            console.error("SSR Error fetching order item:", err);
        }
    }
    return { direction, language, orderId, orderItem, viewProductsItem };
}

export default function index({ direction, language, orderId, orderItem, viewProductsItem }: OrderSummaryProps) {
    return (
        <OrderSummaryLayout direction={direction} language={language} orderId={orderId} isSSR={true} viewProductsItem={viewProductsItem} orderItem={orderItem} />
    )
}

export const getServerSideProps: GetServerSideProps<OrderSummaryProps> = async (context) => {
    const { direction, language, orderId, orderItem, viewProductsItem } = await fetchData(context);
    return { props: { direction, language, orderId, orderItem, viewProductsItem } }
}