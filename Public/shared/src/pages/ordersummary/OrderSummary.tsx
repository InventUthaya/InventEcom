import { getLocalStorage } from "shared/src/components/helper/Helper";
import { IGetOrderItemModel } from "shared/src/models/BuyOrder.Model";
import OrderStatus from "shared/src/components/web/buy/checkout/utils/orderStatus";
import { ProductPriceingDetails } from "shared/src/components/web/buy/checkout/ProductPricingDetails";

type OrderSummaryProps = {
    direction: string;
    language: "in_en" | "ae_en" | "ae_ar";
    orderId: any;
    isSSR?: boolean;
    orderItem?: IGetOrderItemModel;
    loading?: boolean;
    viewProductsItem?: IGetOrderItemModel;
};

function OrderSummary({ direction, language, orderId, orderItem, isSSR, loading, viewProductsItem }: OrderSummaryProps) {
    const personId = getLocalStorage()?.PersonId as any;
    if (loading) {
        // <Loader />
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:transition-all">
            <OrderStatus orderId={orderId} personId={personId} />
            <div className="w-full h-fit lg:sticky transition-all bg-white lg:top-10 lg:w-1/2 border-t lg:border border-[#EFEFEF] py-4 lg:py-8 lg:rounded-2xl">
                <ProductPriceingDetails
                    ProductDetail={orderItem ? [orderItem] : []}
                    ProductView={viewProductsItem}
                />            </div>
        </div>
    );
}

export default OrderSummary;