import { useEffect, useState } from "react";
import OrderstatusBanner from "../orderstatus/orderstatusBanner";
import { DocumentIcon } from "../assets";
import OrderTracker from "../orderstatus/OrderTracker";
import DeliveryAddress from "../orderstatus/DeliveryAddress";
import Link from "next/link";
import BuyOrderServices from "shared/src/services/BuyOrder.Services";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { Reloader } from "shared/src/recoil/Reloader";
import { useRouter } from "next/router";
import TrackOrderService from "shared/src/services/TrackOrder.Service";
import { OrderItem } from "shared/src/models/OrderStatus.Model";
import FileSaver from "file-saver";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem, WriteFileResult } from "@capacitor/filesystem";
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { FileOpener, FileOpenerOptions } from "@capacitor-community/file-opener";
import { checkoutloadingState, ScheduleOrder } from "shared/src/recoil/AddCheckout";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import Loader from "shared/src/components/utils/Loader/Loader";

type OrderProps = {
  orderId: any,
  personId: any,
}

export default function OrderStatus({ orderId, personId }: OrderProps) {
  const [OrderStatus, _] = useState(true);
  const [delet, setDelete] = useState(false);
  const reload = useRecoilValueLoadable(Reloader);
  const [reloader, setReloader] = useRecoilState(Reloader);
  const [orderlist, setOrderList] = useState<OrderItem>();
  const [orderStatusData, setOrderStatusData] = useState<{ title: string; date: string; status: boolean; statusId: number; }[]>([]);
  const [isToast, setIsToast] = useState(false);
  const navigate = useRouter();
  const [handleOutlet, setHandleOutlet] = useRecoilState(ScheduleOrder);
  const [loading, setLoading] = useState(true);
  const [checkoutloading, setCheckoutloading] = useRecoilState(checkoutloadingState);

  // const OrderId = localStorage.getItem("orderId");

  const getTrackOrder = (OrderId: any) => {
    if (OrderId) {
      TrackOrderService.GetOrderById(orderId || OrderId).then((res => {
        if (res.status === 200) {
          setLoading(false);
          setOrderList(res.data.Items[0]);
          const orderData = res?.data?.Items[0];
          const { OrderStatusId, OrderDate } = orderData;
          const formattedDate = new Date(OrderDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          const computedOrderStatus = Object.keys(HelperConstant.orderStatusTrack).map((key) => ({
            title: HelperConstant.orderStatusTrack[Number(key) as keyof typeof HelperConstant.orderStatusTrack],
            date: formattedDate,
            status: Number(key) <= OrderStatusId,
            statusId: Number(key),
          }));
          setOrderStatusData(computedOrderStatus);
        }
      }))
    }
  }

  const CancelOrder = (orderId: any, personId: any) => {
    setCheckoutloading(true);
    const OrderId = localStorage.getItem("orderId");
    if (typeof OrderId === 'string' && OrderId.includes(',')) {
      BuyOrderServices.CancelBulkOrder(OrderId, personId).then(res => {
        if (res.status === 200) {
          // setReloader(!reloader);
          setDelete(false);
          setHandleOutlet({
            handleSchedule: "selectaddress"
          })
          localStorage.removeItem("orderId");
          setCheckoutloading(false);
          navigate.push('/myorder');
        }
      }).catch((e: string) => {
        console.log(e)
      });
    }
    else {
      const payload = {
        OrderId: orderId,
        PersonId: personId
      }
      BuyOrderServices.cancelOrder(payload).then(res => {
        if (res.status === 200) {
          // setReloader(!reloader);
          setDelete(false);
          setHandleOutlet({
            handleSchedule: "selectaddress"
          })
          localStorage.removeItem("orderId");
          setCheckoutloading(false);
          navigate.push('/myorder');
        }
      }).catch((e: string) => {
        console.log(e)
      });
    }
    setCheckoutloading(false);
  }

  const DoneHandler = () => {
    setCheckoutloading(true);
    localStorage.removeItem("orderId");
    setCheckoutloading(false);
    navigate.push('/myorder');
  }


  const downloadInvoice = async (OrderId: any, orderNumber: any) => {
    setLoading(true);
    TrackOrderService.DownloadOrdersList(orderId).then(response => {
      if (response.status === 200) {
        if (Capacitor.isNativePlatform()) {
          let concatedBase64 = "data:application/pdf;base64, " + response.data;
          downloadMobileInvoice(concatedBase64, `DOFY_Invoice_${OrderId}.pdf`);
        }
        else {
          let stringWithQuotes = response.data;
          let stringWithoutQuotes = stringWithQuotes.replace(/"/g, '');
          const byteArray = Uint8Array.from(atob(stringWithoutQuotes).split('').map(char => char.charCodeAt(0)));
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const file = new File([blob], `DOFY_Invoice_${orderNumber}.pdf`, { type: 'application/pdf' });
          FileSaver.saveAs(file);
        }
      }
      setLoading(false);
    }).catch((e) => {
      console.log(e);
    });
  }

  const downloadMobileInvoice = async (file: any, path: any) => {
    setTimeout(() => { setIsToast(false) }, 5000);
    Filesystem.writeFile({
      path: path,
      data: file,
      directory: Directory.Documents,
      recursive: true
    }).then((res: WriteFileResult) => {
      showInvoiceNotification(res.uri, path);
    }).catch(e => console.log(e));
  }

  const showInvoiceNotification = async (uri: any, name: any) => {
    let options: ScheduleOptions = {
      notifications: [
        {
          id: 1,
          title: name,
          body: "Download completed. Click to open!",
          extra: { uri: uri },
          actionTypeId: "open_pdf"
        }
      ]
    };

    try {
      await LocalNotifications.schedule(options);
    } catch (error) {
    }

    LocalNotifications.addListener('localNotificationActionPerformed', async (notification) => {
      if (notification.notification.actionTypeId === 'open_pdf') {
        const uri = notification.notification.extra.uri;
        openDownloadedFile(uri);
      }
    });
  }

  const openDownloadedFile = async (uri: any) => {
    try {
      const fileOpenerOptions: FileOpenerOptions = {
        filePath: uri,
        contentType: "application/pdf",
        openWithDefault: true,
      };
      await FileOpener.open(fileOpenerOptions);

    } catch (e) {
      console.log('Error opening file', e);
    }
  }

  useEffect(() => {
    getTrackOrder(orderId);
  }, [reload]);

  return (
    <>
      {/* {loading && <Loader />} */}
      <div className="flex flex-col w-full lg:w-1/2 bg-white border lg:border border-[#EFEFEF] rounded-xl overflow-hidden">
        <div className="relative w-full overflow-hidden">
          <OrderstatusBanner status={OrderStatus} />
        </div>
        <div className="flex-1 flex flex-col gap-2 px-1 pt-1">
          {OrderStatus && (
            <div className="items-center gap-2 lg:gap-5 p-2 lg:py-3 lg:px-5">
              {/* {orderlist?.OrderStatusId == HelperConstant.orderStatusId.Delivered &&
                <div className="text-xs sm:text-base p-2 border border-[#939393] rounded-md font-semibold flex gap-1 items-center cursor-pointer"
                  onClick={() => downloadInvoice(orderId, orderlist?.OrderNumber)}>
                  {loading ? (
                    <Loader />
                  ) : (
                    <DocumentIcon />
                  )} Download Invoice
                </div>
              } */}
              <div className="flex flex-col gap-1 lg:gap-2">
                <div className="flex items-center justify-between text-[#9E9E9E] font-semibold text-sm lg:text-base">
                  <div className="text-xs sm:text-base text-[#939393] font-semibold">
                    Order No: {orderlist?.OrderNumber}
                  </div>
                </div>
              </div>

            </div>
          )}
          <OrderTracker status={OrderStatus} OrderStatusData={orderStatusData} />
          {/* {orderlist?.OBDAvailability == true &&
          <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm font-semibold p-4 rounded-lg shadow-lg flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12l5 5L20 7" />
            </svg>
            <span>Open Box Delivery is Available for this Location</span>
          </div>
        } */}
          <DeliveryAddress orderList={orderlist} />
          <div className="flex-1 flex items-end gap-2 lg:gap-5 p-2 lg:py-4 lg:px-5">
            <button
              className="py-2 text-center lg:px-16 w-full lg:w-fit bg-[#EA002A] text-white rounded-md"
              onClick={() => DoneHandler()}
            >
              Done
            </button>
            {/* <button
              className="py-2 text-center lg:px-3 w-full lg:w-fit text-[#05050599] "
              onClick={() => CancelOrder(orderId, personId)}>
              Cancel Order
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}

