import React, { useEffect, useState } from 'react'
import Menu from '../../components/utils/Menus/TopMenu'
import Container from '../../components/animation/Container'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'
import { containerZindex } from 'shared/src/recoil/styleState'
import OrderSummary from './OrderSummary'
import { IGetOrderItemModel } from 'shared/src/models/BuyOrder.Model'
import { Direction, findWindow, getUserLanguage } from 'shared/src/components/helper/Helper'
import BuyOrderServices from 'shared/src/services/BuyOrder.Services'
import { Reloader } from 'shared/src/recoil/Reloader'

type OrderSummaryProps = {
  direction: string;
  language: "in_en" | "ae_en" | "ae_ar";
  orderId?: any;
  isSSR?: boolean;
  orderItem?: IGetOrderItemModel;
  viewProductsItem?: IGetOrderItemModel
};

const fetchData = async (context: any): Promise<OrderSummaryProps> => {
  const direction = Direction();
  const language = getUserLanguage();
  let orderId = findWindow() && window.location.pathname.split('/').at(-1) as any;
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
  return { direction, language, orderId, orderItem, viewProductsItem, isSSR: false };
}
function OrderSummaryLayout({ direction, language, orderId, orderItem, isSSR, viewProductsItem }: OrderSummaryProps) {
  const [val, setVal] = useRecoilState(containerZindex);
  const [orderSummaryData, setOrderSummaryData] = useState<OrderSummaryProps>({ direction, language, orderId, orderItem, viewProductsItem });
  const reload = useRecoilValueLoadable(Reloader);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSSR) {
      setLoading(true)
      fetchData("").then((res: OrderSummaryProps) => {
        setOrderSummaryData({
          direction: res.direction,
          language: res.language,
          orderItem: res.orderItem,
          orderId: res.orderId,
          viewProductsItem: res.viewProductsItem,
        });
        setLoading(false);
      }).catch((err: Error) => {
        console.error("Error fetching data:", err);
      });
    }
    setVal("z-0")
  }, [reload]);

  return (
    <React.Fragment>
      <Menu needSearch={false} zIndex={"z-0"} />
      <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto pb-10">
          <Container >
            <OrderSummary direction={direction} language={language} orderId={orderSummaryData.orderId} orderItem={orderSummaryData.orderItem} viewProductsItem={orderSummaryData.viewProductsItem} loading={loading} />
          </Container>
        </div>
      </div>
    </React.Fragment>
  )
}

export default OrderSummaryLayout