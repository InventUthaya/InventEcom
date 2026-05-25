import Menu from "shared/src/components/utils/Menus/TopMenu";
import Container from "shared/src/components/animation/Container";
import Footer from "shared/src/components/utils/Footer";
import OrderTracker from "shared/src/components/web/buy/checkout/orderstatus/OrderTracker";
import { useState, useEffect } from "react";
import { getUserLanguage, getLocalStorage, formatPrice, removeBracketValues, currencyByCountry } from "shared/src/components/helper/Helper";
import { BuyFooterData } from "./buy";
import TrackOrderService from "../services/TrackOrder.Service";
import { ITrackOrderItemModel, ITrackOrderModel } from "../models/TrackOrder.Model";
import FileSaver from "file-saver";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem, WriteFileResult } from "@capacitor/filesystem";
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { FileOpener, FileOpenerOptions } from "@capacitor-community/file-opener";
import { HelperConstant } from "../components/helper/HelperConstant";
import moment from "moment";
import { useRouter } from "next/router";
import s22Mobile from "../components/web/buy/checkout/assets/one.png";
import ContactUsServices from "../services/ContactUs.Services";
import CategoryService from "../services/CategoryService";
import { selectedOrderIdState } from "../recoil/OrderidTrack";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { MobileMenuSell } from "../components/utils/Menus/MobileSubMenu";
import { MenuContentZindex } from "../recoil/styleState";
import { ISEOModel } from "../models/SEO.Model";
import CancellationPoup from "../components/popups/CancellationPopup";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";
import ProductReview from "../components/utils/ProductReview/ProductReview";

type TrackOrderProps = {
  trackOrder: ITrackOrderItemModel[],
  isSSR?: boolean,
  filtertype: string,
  metaTags?: ISEOModel
}

function BuyTrackOrder({ trackOrder, isSSR, filtertype, metaTags }: TrackOrderProps) {
  const [trackOrderList, setTrackOrderList] = useState<TrackOrderProps>({ trackOrder: [], filtertype, metaTags });
  const [orderlist, setOrderList] = useState<Array<ITrackOrderItemModel>>();
  const [adress, setAddress] = useState();
  const [loading, setLoading] = useState(false);
  const selectedOrderId = useRecoilValue(selectedOrderIdState);
  const resetSelectedOrderId = useResetRecoilState(selectedOrderIdState);
  const [footerData, setFooterData] = useState(BuyFooterData);
  const menuContentZindex = useRecoilValue(MenuContentZindex);
  let language = getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

  const [orderFilterList, setOrderFilterList] = useState({
    list: [
      { title: "Older first" },
      { title: "Newest first" },
      { title: "Last 30 days only" },
      { title: "All" },
      { title: "Alphabetic order" },
    ],
    selectedValue: "Newest first",
  });

  const fetchData = async () => {
    const customerId = getLocalStorage()?.PersonId as any;
    const filtertype = orderFilterList.selectedValue;
    let metaTags = getStaticMeta(HelperConstant.metaPages.MyOrders);

    TrackOrderService.GetOrderByCustomerId(customerId, filtertype).then((res => {
      if (res.status === 200) {
        const orders = Array.isArray(res.data) ? res.data : (res.data.Items || []);
        let filteredItems = orders.filter((item: any) => item.OrderStatusId !== 0);
        if (selectedOrderId) {
          filteredItems = filteredItems.filter(
            (item: ITrackOrderItemModel) => item.OrderId === selectedOrderId
          );
        }
        setOrderList(filteredItems);
        setTrackOrderList({
          trackOrder: filteredItems,
          filtertype: orderFilterList.selectedValue,
          metaTags: metaTags
        });
        setLoading(false);
      }
    })).catch(err => {
      console.error(err);
      setLoading(false);
    });

    ContactUsServices.getAddress().then((res => {
      if (res.status === 200) {
        setAddress(res.data)
      }
    })).catch(err => console.error(err));
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [orderFilterList.selectedValue]);

  useEffect(() => {
    return () => resetSelectedOrderId();
  }, [resetSelectedOrderId]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategoryList();
      if (response.status === 200 && response.data) {
        const allCategories = response.data;
        const popularCategories = allCategories.map((category: any) => ({
          title: `Buy ${category.CategoryName}`,
          link: `/buy/${category.EncryptedId}_Category`,
        }));
        setFooterData({
          ...footerData,
          PopularCategories: popularCategories,
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Menu needSearch={false} />
      <MobileMenuSell ActiveId={0} zIndex={menuContentZindex.Z_Index} />
      <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto pb-10">
          <Container>
            <div className="flex justify-between items-center">
              <h1 className="text-sm tracking-[2px] py-5 flex gap-1 font-semibold capitalize px-5 pb-4 lg:px-8">
                <span>ORDERS</span>
                <span className="text-[#EA002A] font-semibold">({trackOrderList.trackOrder?.length})</span>
              </h1>
              <div className="font-semibold group relative flex items-center gap-1 cursor-pointer select-none">
                <OrderFilterIcon />
                <span className="select-none text-xs sm:text-base">
                  {orderFilterList.selectedValue}
                </span>
                <div
                  className={`max-h-0 group-hover:max-h-96 w-40 overflow-hidden
                  transition-all duration-500 bg-white h-fit absolute top-8
                  right-0 z-40 shadow-[0px_2px_14px_rgba(20,_83,_83,_0.1)] rounded-xl`}
                >
                  {orderFilterList.list.map((item, index) => (
                    <div
                      key={item.title}
                      className={`font-semibold text-xs sm:text-sm py-2.5 text-center px-5
                      ${item.title == orderFilterList.selectedValue
                          ? "text-[#EA002A]"
                          : "text-[#050505]"
                        }
                      ${orderFilterList.list.length - 1 !== index &&
                        "border-b border-[#EBEBEB]"
                        }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setOrderFilterList((prev) => ({
                          ...prev,
                          selectedValue: item.title,
                        }));
                      }}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <MobileTackOrder trackOrder={trackOrderList.trackOrder} />
            <DesktopTrackOrder trackOrder={trackOrderList.trackOrder} />
          </Container>
        </div>
      </div>
      <Footer footerData={footerData} address={adress} />
    </>
  );
}

export default BuyTrackOrder;

const DesktopTrackOrder = ({ trackOrder }: { trackOrder: any[] }) => {
  const [isToast, setIsToast] = useState(false);
  const customerId = getLocalStorage()?.PersonId as any;
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const [delet, setDelete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number>(0);
  const [orderData, setOrderData] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [showReviewForOrder, setShowReviewForOrder] = useState<number | null>(null);


  const DeleteHandler = (data?: any) => {
    setDelete(!delet);
    setOrderId(data.EncryptedOrderId);
    setOrderData(data);
  };

  const downloadInvoice = async (OrderId: any, orderNumber: string) => {
    setLoading(true);
    TrackOrderService.DownloadOrdersList(OrderId).then(response => {
      if (response.status === 200) {
        if (Capacitor.isNativePlatform()) {
          let concatedBase64 = "data:application/pdf;base64," + response.data;
          downloadMobileInvoice(concatedBase64, `Invent_Invoice_${orderNumber}.pdf`);
        } else {
          let stringWithoutQuotes = response.data.replace(/"/g, '');
          const byteArray = Uint8Array.from(atob(stringWithoutQuotes).split('').map(char => char.charCodeAt(0)));
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const file = new File([blob], `Invent_Invoice_${orderNumber}.pdf`, { type: 'application/pdf' });
          FileSaver.saveAs(file);
        }
      }
      setLoading(false);
    }).catch((e) => {
      console.log(e);
      setLoading(false);
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
    } catch (error) { }
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

  const generateStatusLogs = (
    orderStatusId: number,
    OrderDate: string,
    UpdatedOrderDate: string,
    PaidOrderDate: string
  ) => {
    const formattedOrderDate = moment(OrderDate).format("DD/MM/YYYY");
    const formattedUpdatedOrderDate = moment(UpdatedOrderDate).format("DD/MM/YYYY");
    const formattedPaidOrderDate = moment(PaidOrderDate || OrderDate).format("DD/MM/YYYY");

    const steps = [
      { title: "Pending", statusId: 1, date: formattedOrderDate },
      { title: "Order Confirmed", statusId: 2, date: formattedUpdatedOrderDate },
      { title: "Shipped", statusId: 6, date: formattedUpdatedOrderDate },
      { title: "Assigned", statusId: 7, date: formattedUpdatedOrderDate },
      { title: "Out For Delivery", statusId: 16, date: formattedPaidOrderDate },
      { title: "Completed", statusId: 4, date: formattedPaidOrderDate }
    ];

    if (orderStatusId === 3) {
      return [
        { title: "Pending", statusId: 1, date: formattedOrderDate, status: true },
        { title: "Order Confirmed", statusId: 2, date: formattedOrderDate, status: true },
        { title: "Cancelled", statusId: 3, date: formattedUpdatedOrderDate, status: true, isCancelled: true }
      ];
    }
    const currentStepIndex = steps.findIndex(
      step => step.statusId === orderStatusId
    );

    return steps.map((step, index) => ({
      ...step,
      status: index <= currentStepIndex,
      date: index <= currentStepIndex ? step.date : ""
    }));
  };
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getImageUrl = (formattedMediaFileName: string | null | undefined): string => {
    const mediaUrlPrefix = process.env.NEXT_PUBLIC_CDN_URL || "";

    let imageUrl = mediaUrlPrefix + formattedMediaFileName;
    return imageUrl;
  };

  return (
    <>
      {trackOrder.length > 0 ? (
        trackOrder.filter(item => item.OrderStatusId !== 0).map((item, index) => {
          const firstImageUrl = getImageUrl(item?.ImagePath);


          return (
            <div
              className="hidden lg:block p-4 bg-white border border-[#EFEFEF] rounded-lg mb-4"
              key={item.OrderId}
            >
              <div className="flex gap-2 border-b border-[#EFEFEF] pb-5 pt-3">
                <div className="flex gap-3 lg:gap-5 pb-3 w-[60%]">
                  <div className="w-28 p-4 bg-[#F5F5F5] rounded-lg">
                    <img src={firstImageUrl?.toLowerCase()} className="w-full" />
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="lg:text-xl font-semibold">{item.ProductName}</div>
                    <span className="text-base">
                      {removeBracketValues(item.AttributeDescription || "")}
                    </span>
                    <span className="text-xl font-bold">
                      {currencyByCountry(formatPrice(item.TotalPrice || item.Price))}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-[#939393] text-sm">Delivery Details</h3>
                  <h2 className="font-semibold">
                    {item.FullName} | {item.PhoneNumber}
                  </h2>
                  <p className="text-sm">
                    {item.Address1}, {item.City} - {item.ZipPostalCode}
                  </p>
                </div>
              </div>
              <div className="text-sm font-semibold">
                Order No: <span className="font-bold">#{item.OrderNumber}</span>
              </div>    <div className="text-sm font-medium text-[#939393]">
                Status: {item?.StatusName} {HelperConstant.orderStatus[item?.OrderStatusId]} on{" "}
                {formatDate(item?.UpdatedOrderDate)}
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() =>
                    setExpandedOrderId(prev =>
                      prev === item.Id ? null : item.Id
                    )
                  }
                  className="py-[10px] px-[14px] border rounded-md text-sm"
                >
                  {expandedOrderId === item.Id ? "Hide Tracking" : "Track Order"}
                </button>

                {(item.OrderStatusId === 1 || item.OrderStatusId === 2) && (
                  <button
                    onClick={() => DeleteHandler(item)}
                    className="py-[10px] px-[14px] border text-red-600 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {expandedOrderId === item.Id && (
                <div className="mt-4 border-t pt-4">
                  <OrderTracker
                    status={!(item.OrderStatusId === 3 || item.OrderStatusId === 5)}
                    OrderStatusData={generateStatusLogs(
                      item.OrderStatusId,
                      item.OrderDate,
                      item.UpdatedOrderDate,
                      item.PaidOrderDate || item.OrderDate
                    )}
                  />
                  {showReviewForOrder === item.Id &&
                    (item.OrderStatusId === 4 || item.OrderStatusId === 3) && (
                      <div className="mt-6">
                        <ProductReview productId={item.ProductId} />
                      </div>
                    )}

                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center mt-5">No orders found.</div>
      )}
      {delet && <CancellationPoup data={orderData} setPopupType={setDelete} popupType={delet} isMobile={false} show={true} />}
    </>
  );
}

const MobileTackOrder = ({ trackOrder }: { trackOrder: any[] }) => {
  const [isToast, setIsToast] = useState(false);
  const customerId = getLocalStorage()?.PersonId as any;
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const [delet, setDelete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number>(0);
  const [orderData, setOrderData] = useState<any>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const DeleteHandler = (data?: any) => {
    setDelete(!delet);
    setOrderId(data.EncryptedOrderId);
    setOrderData(data);
  };

  const downloadInvoice = async (OrderId: any, orderNumber: string) => {
    setLoading(true);
    TrackOrderService.DownloadOrdersList(OrderId).then(response => {
      if (response.status === 200) {
        if (Capacitor.isNativePlatform()) {
          let concatedBase64 = "data:application/pdf;base64," + response.data;
          downloadMobileInvoice(concatedBase64, `Invent_Invoice_${orderNumber}.pdf`);
        } else {
          let stringWithoutQuotes = response.data.replace(/"/g, '');
          const byteArray = Uint8Array.from(atob(stringWithoutQuotes).split('').map(char => char.charCodeAt(0)));
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const file = new File([blob], `Invent_Invoice_${orderNumber}.pdf`, { type: 'application/pdf' });
          FileSaver.saveAs(file);
        }
      }
      setLoading(false);
    }).catch((e) => {
      console.log(e);
      setLoading(false);
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
    } catch (error) { }
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

  const generateStatusLogs = (orderStatusId: number, OrderDate: string, UpdatedOrderDate: string, PaidOrderDate: string, ReturnRequestStatusId: number | null, ReturnRequestUpdatedDate: string, ReturnRequestCreatedDate: string, ShippingStatusId: number) => {
    const formattedOrderDate = moment(OrderDate).format("DD/MM/YYYY");
    const formattedUpdatedOrderDate = moment(UpdatedOrderDate).format("DD/MM/YYYY");
    const formattedPaidOrderDate = moment(PaidOrderDate).format("DD/MM/YYYY");

    const statusLogs = [
      { title: "Pending", date: formattedOrderDate, status: orderStatusId >= 1, statusId: 1 },
      { title: "Order Confirmed", date: orderStatusId >= 2 ? formattedUpdatedOrderDate : "", status: orderStatusId >= 2, statusId: 2 },
      { title: "Shipped", date: orderStatusId >= 6 ? formattedUpdatedOrderDate : "", status: orderStatusId >= 6, statusId: 6 },
      { title: "Completed", date: orderStatusId >= 4 ? formattedPaidOrderDate : "", status: orderStatusId >= 4, statusId: 4 },
    ];

    if (orderStatusId === 3) {
      return [
        { title: "Pending", date: formattedOrderDate, status: true, statusId: 1 },
        { title: "Order Confirmed", date: formattedOrderDate, status: true, statusId: 2 },
        { title: "Cancelled", date: formattedUpdatedOrderDate, status: true, statusId: 3 }
      ];
    }
    if (orderStatusId === 5) {
      return [{ title: "Rejected", date: formattedUpdatedOrderDate, status: true, statusId: 5 }];
    }

    return statusLogs;
  };

  const ContinueOrderHandler = (OrderId: any) => {
    localStorage.setItem("orderId", OrderId);
    navigate.push('/buy/checkout');
  }

  const getImageUrl = (formattedMediaFileName: string | null | undefined): string => {


    if (!formattedMediaFileName) return s22Mobile.src;
    const mediaUrlPrefix = process.env.NEXT_PUBLIC_MEDIA_URL || process.env.NEXT_PUBLIC_CDN_URL || '';
    if (!mediaUrlPrefix) return s22Mobile.src;

    const filename = formattedMediaFileName.split('\\').pop() || '';
    if (!filename) return s22Mobile.src;

    return encodeURI(`${mediaUrlPrefix}${filename}`);
  };

  return (
    <>
      {trackOrder.length > 0 ? (
        trackOrder.filter(item => item.OrderStatusId !== 0).map((item, index) => {
          const firstImageUrl = getImageUrl(item?.ImagePath);

          return (
            <div
              className="block lg:hidden p-4 bg-white border border-[#EFEFEF] rounded-lg mb-4"
              key={item.OrderId}
            >
              <div className="flex gap-3 border-b pb-3">
                <div className="w-28 p-4 bg-[#F5F5F5] rounded-lg">
                  <img src={firstImageUrl?.toLowerCase()} className="w-full" />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="text-sm font-semibold">{item.ProductName}</div>
                  <span className="text-sm font-bold">
                    {currencyByCountry(formatPrice(item.TotalPrice || item.Price))}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() =>
                    setExpandedOrderId(prev =>
                      prev === item.Id ? null : item.Id
                    )
                  }
                  className="py-[10px] px-[14px] border rounded-md text-sm"
                >
                  {expandedOrderId === item.Id ? "Hide Tracking" : "Track Order"}
                </button>



                {(item.OrderStatusId === 1 || item.OrderStatusId === 2) && (
                  <button
                    onClick={() => DeleteHandler(item)}
                    className="py-[10px] px-[14px] border text-red-600 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>


              {expandedOrderId === item.Id && (
                <div className="mt-4 border-t pt-4">
                  <OrderTracker
                    status={!(item.OrderStatusId === 3 || item.OrderStatusId === 5)}
                    OrderStatusData={generateStatusLogs(
                      item.OrderStatusId,
                      item.OrderDate,
                      item.UpdatedOrderDate,
                      item.PaidOrderDate || item.OrderDate,
                      item.ReturnRequestStatusId || null,
                      item.ReturnRequestUpdatedDate || "",
                      item.ReturnRequestCreatedDate || "",
                      item.ShippingStatusId || 0
                    )}
                  />
                  <div className="mt-6">
                    <ProductReview productId={item.ProductId} />
                  </div>
                </div>
              )}

            </div>

          );
        })
      ) : (
        <div className="text-center mt-5 block lg:hidden">No orders found.</div>
      )}
      {delet && <CancellationPoup data={orderData} setPopupType={setDelete} popupType={delet} isMobile={false} show={true} />}
    </>
  );
};

const CallIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_109_79879)">
      <path d="M17.665 14.2827V16.2827C17.6657 16.4683 17.6277 16.6521 17.5533 16.8222C17.479 16.9924 17.3699 17.1451 17.233 17.2706C17.0962 17.3961 16.9347 17.4917 16.7588 17.5511C16.5829 17.6106 16.3966 17.6327 16.2117 17.616C14.1602 17.3931 12.1897 16.6921 10.4583 15.5693C8.84755 14.5458 7.48189 13.1801 6.45833 11.5693C5.33165 9.83014 4.63049 7.85 4.41166 5.78934C4.395 5.60498 4.41691 5.41918 4.47599 5.24375C4.53508 5.06833 4.63004 4.90713 4.75484 4.77042C4.87964 4.6337 5.03153 4.52448 5.20086 4.44968C5.37018 4.37489 5.55322 4.33618 5.73833 4.336H7.73833C8.06187 4.33282 8.37552 4.44739 8.62084 4.65836C8.86615 4.86933 9.02638 5.1623 9.07166 5.48267C9.15608 6.12271 9.31263 6.75115 9.53833 7.356C9.62802 7.59462 9.64744 7.85395 9.59427 8.10326C9.5411 8.35257 9.41757 8.58141 9.23833 8.76267L8.39166 9.60934C9.3407 11.2784 10.7226 12.6603 12.3917 13.6093L13.2383 12.7627C13.4196 12.5834 13.6484 12.4599 13.8977 12.4067C14.1471 12.3536 14.4064 12.373 14.645 12.4627C15.2498 12.6884 15.8783 12.8449 16.5183 12.9293C16.8422 12.975 17.1379 13.1381 17.3494 13.3877C17.5608 13.6372 17.6731 13.9557 17.665 14.2827Z"
        stroke="#EA002A" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_109_79879">
        <rect width="16" height="16" fill="white" transform="translate(3 3)" />
      </clipPath>
    </defs>
  </svg>
);

const OrderFilterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.54688 8.3623L6.4562 5.45298L9.36552 8.3623" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.8191 18.5469H9.3644C8.5928 18.5469 7.8528 18.2404 7.3072 17.6948C6.76159 17.1492 6.45508 16.4092 6.45508 15.6376L6.45508 5.45493" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.5462 15.6376L16.6369 18.5469L13.7275 15.6376" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.2754 5.45493H13.7301C14.5017 5.45493 15.2416 5.76145 15.7873 6.30705C16.3329 6.85266 16.6394 7.59265 16.6394 8.36425V18.5469" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
