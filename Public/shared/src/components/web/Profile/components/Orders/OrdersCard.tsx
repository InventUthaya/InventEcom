import { FileIcon } from "../../assets/Orders";
import s22Mobile from "../../../buy/checkout/assets/one.png";
import { currencyByCountry, formatPrice, getLocalStorage, removeBracketValues } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FileOpenerOptions, FileOpener } from "@capacitor-community/file-opener";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, WriteFileResult } from "@capacitor/filesystem";
import { ScheduleOptions, LocalNotifications } from "@capacitor/local-notifications";
import FileSaver from "file-saver";
import TrackOrderService from "shared/src/services/TrackOrder.Service";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedOrderIdState } from "shared/src/recoil/OrderidTrack";
import BuyOrderServices from "shared/src/services/BuyOrder.Services";
import ReturnReasonModal from "shared/src/components/utils/ReturnRequestModel/ReturnRequestModel";
import { RefreshCcw, Undo2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import OrderTracker from "../../../buy/checkout/orderstatus/OrderTracker";
import moment from "moment";
import CancellationPoup from "shared/src/components/popups/CancellationPopup";

const OrdersCard = (item: any) => {
  const navigate = useRouter();
  const [isToast, setIsToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isReturn, setIsReturn] = useState(false)
  const [returnDays, setReturnDays] = useState<number>(0);
  const CdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "";
  const customerId = getLocalStorage()?.PersonId as any;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const imagePath = Array.isArray(item.ImagePath) && item.ImagePath.length > 0
    ? item.ImagePath
    : item.ImagePath || "";
  const [delet, setDelete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number>(0);
  const [orderData, setOrderData] = useState<any>(null);
  const Image = `${CdnUrl}${imagePath}`;
  const setSelectedOrderId = useSetRecoilState(selectedOrderIdState);
  const [isButtonDisable, setIsButtonDisable] = useState(false)

  const downloadInvoice = async (OrderId: any, OrderNumber: any) => {
    setLoading(true);
    TrackOrderService.DownloadOrdersList(OrderId).then(response => {
      if (response.status === 200) {
        if (Capacitor.isNativePlatform()) {
          let concatedBase64 = "data:application/pdf;base64, " + response.data;
          downloadMobileInvoice(concatedBase64, `Invent_Invoice_${OrderNumber}.pdf`);
        }
        else {
          let stringWithQuotes = response.data;
          let stringWithoutQuotes = stringWithQuotes.replace(/"/g, '');
          const byteArray = Uint8Array.from(atob(stringWithoutQuotes).split('').map(char => char.charCodeAt(0)));
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const file = new File([blob], `Invent_Invoice_${OrderNumber}.pdf`, { type: 'application/pdf' });
          FileSaver.saveAs(file);
        }
      }
      setLoading(false);
    }).catch((e) => {
      console.log(e);
    });
  }
  const selectedOrderId = useRecoilValue(selectedOrderIdState);
  const handleSubmitReview = () => {
    setIsButtonDisable(true)
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded: any = jwtDecode(token);
    const userId = decoded?.PersonId;

    const formData = new FormData();
    formData.append("SkuId", item.ProductId);
    formData.append("UserId", userId);
    formData.append("Rating", rating.toString());
    formData.append("ReviewText", reviewTitle.toString());
    formData.append("ReviewDescription", reviewDescription.toString());

    selectedImages.forEach((file) => {
      formData.append("Images", file);
    });

    BuyOrderServices.submitProductReview(formData)
      .then((res: any) => {
        if (res.status === 200) {
          setIsReviewModalOpen(false);
          setIsButtonDisable(false)
        }
      })
      .catch((err) => {
        console.error("Review submission error:", err);
      });
  };

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

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const ContinueOrderHandler = (OrderId: any) => {
    localStorage.setItem("orderId", OrderId);
    navigate.push('/buy/checkout');
  };

  const handleTrackOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    navigate.push(`/trackorder`);
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const GetReturnDaysConfig = () => {
    BuyOrderServices.getReturnDaysConfig()
      .then((res: any) => {
        if (res.status === 200) {
          const daysString = res.data?.ReturnDays || "0 Days";
          const daysNumber = parseInt(daysString.split(' ')[0]);
          setReturnDays(daysNumber);
        }
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (selectedOrderId) {
      setExpandedOrderId(selectedOrderId);
    }
  }, [selectedOrderId]);

  const DeleteHandler = (data?: any) => {
    setDelete(!delet);
    setOrderId(data.EncryptedOrderId);
    setOrderData(data);
  };

  const generateStatusLogs = (
    orderStatusId: number,
    OrderDate: string,
    UpdatedOrderDate: string,
    PaidOrderDate: string
  ) => {
    const formattedOrderDate = OrderDate
      ? moment(OrderDate).format("DD/MM/YYYY")
      : "";

    const formattedUpdatedOrderDate = UpdatedOrderDate
      ? moment(UpdatedOrderDate).format("DD/MM/YYYY")
      : "";

    const formattedPaidOrderDate = PaidOrderDate
      ? moment(PaidOrderDate).format("DD/MM/YYYY")
      : "";

    // ❌ Cancelled
    if (orderStatusId === 3) {
      return [
        { title: "Pending", date: formattedOrderDate, status: true, statusId: 1 },
        { title: "Order Confirmed", date: formattedOrderDate, status: true, statusId: 2 },
        { title: "Cancelled", date: formattedUpdatedOrderDate, status: true, statusId: 3 },
      ];
    }

    // ❌ Rejected
    if (orderStatusId === 5) {
      return [
        { title: "Pending", date: formattedOrderDate, status: true, statusId: 1 },
        { title: "Rejected", date: formattedUpdatedOrderDate, status: true, statusId: 5 },
      ];
    }

    if (orderStatusId === 4) {
      return [
        { title: "Pending", date: formattedOrderDate, status: true, statusId: 1 },
        { title: "Confirmed", date: formattedUpdatedOrderDate, status: true, statusId: 2 },
        { title: "Shipped", date: formattedUpdatedOrderDate, status: true, statusId: 6 },
        { title: "Assigned", date: formattedUpdatedOrderDate, status: true, statusId: 7 },
        { title: "Out For Delivery", date: formattedUpdatedOrderDate, status: true, statusId: 16 },
        { title: "Completed", date: formattedPaidOrderDate, status: true, statusId: 4 },
      ]
    }

    if (orderStatusId === 17) {
      return [
        { title: "Pending", date: formattedOrderDate, status: true, statusId: 1 },
        { title: "Confirmed", date: formattedUpdatedOrderDate, status: true, statusId: 2 },
        { title: "Shipped", date: formattedUpdatedOrderDate, status: true, statusId: 6 },
        { title: "Assigned", date: formattedUpdatedOrderDate, status: true, statusId: 7 },
        { title: "Out For Delivery", date: formattedUpdatedOrderDate, status: true, statusId: 16 },
        { title: "Completed", date: formattedPaidOrderDate, status: true, statusId: 4 },
        { title: "ReplacementRequest ", date: formattedPaidOrderDate, status: true, statusId: 17 },
      ]
    }
    if (orderStatusId === 10) {
      return [
        { title: "Pending", date: formattedOrderDate, status: true, statusId: 1 },
        { title: "Confirmed", date: formattedUpdatedOrderDate, status: true, statusId: 2 },
        { title: "Shipped", date: formattedUpdatedOrderDate, status: true, statusId: 6 },
        { title: "Assigned", date: formattedUpdatedOrderDate, status: true, statusId: 7 },
        { title: "Out For Delivery", date: formattedUpdatedOrderDate, status: true, statusId: 16 },
        { title: "Completed", date: formattedPaidOrderDate, status: true, statusId: 4 },
        { title: "RefundPending ", date: formattedPaidOrderDate, status: true, statusId: 10 },
      ]
    }
    if (orderStatusId === 11) {
      return [
        { title: "Pending", date: formattedOrderDate, status: true, statusId: 1 },
        { title: "Confirmed", date: formattedUpdatedOrderDate, status: true, statusId: 2 },
        { title: "Shipped", date: formattedUpdatedOrderDate, status: true, statusId: 6 },
        { title: "Assigned", date: formattedUpdatedOrderDate, status: true, statusId: 7 },
        { title: "Out For Delivery", date: formattedUpdatedOrderDate, status: true, statusId: 16 },
        { title: "Completed", date: formattedPaidOrderDate, status: true, statusId: 4 },
        { title: "RefundPending ", date: formattedPaidOrderDate, status: true, statusId: 10 },
        { title: "RefundCompleted ", date: formattedPaidOrderDate, status: true, statusId: 11 },
      ]
    }
    if (orderStatusId === 18) {
      return [
        { title: "Pending", date: formattedOrderDate, status: true, statusId: 1 },
        { title: "Confirmed", date: formattedUpdatedOrderDate, status: true, statusId: 2 },
        { title: "Shipped", date: formattedUpdatedOrderDate, status: true, statusId: 6 },
        { title: "Assigned", date: formattedUpdatedOrderDate, status: true, statusId: 7 },
        { title: "Out For Delivery", date: formattedUpdatedOrderDate, status: true, statusId: 16 },
        { title: "Completed", date: formattedPaidOrderDate, status: true, statusId: 4 },
        { title: "RefundPending ", date: formattedPaidOrderDate, status: true, statusId: 10 },
        { title: "ReplacementCompleted ", date: formattedPaidOrderDate, status: true, statusId: 18 },
      ]
    }
    // ✅ Normal successful flow (ALL 6)
    return [
      {
        title: "Pending",
        date: formattedOrderDate,
        status: orderStatusId >= 1,
        statusId: 1,
      },
      {
        title: "Confirmed",
        date: orderStatusId >= 2 ? formattedUpdatedOrderDate : "",
        status: orderStatusId >= 2,
        statusId: 2,
      },
      {
        title: "Shipped",
        date: orderStatusId >= 6 ? formattedUpdatedOrderDate : "",
        status: orderStatusId >= 6,
        statusId: 6,
      },
      {
        title: "Assigned",
        date: orderStatusId >= 7 ? formattedUpdatedOrderDate : "",
        status: orderStatusId >= 7,
        statusId: 7,
      },
      {
        title: "Out For Delivery",
        date: orderStatusId >= 16 ? formattedUpdatedOrderDate : "",
        status: orderStatusId >= 16,
        statusId: 16,
      },
      {
        title: "Completed",
        date: orderStatusId === 4 ? formattedPaidOrderDate : "",
        status: orderStatusId === 4,
        statusId: 4,
      },
    ];
  };



  const isReturnEligible = () => {
    if (item.OrderStatusId !== HelperConstant.orderStatusId.Delivered || !item.UpdatedOrderDate || item.ReturnRequestStatusId == HelperConstant.orderStatusId.Dispatched) return false;
    const updatedDate = new Date(item.UpdatedOrderDate);
    const today = new Date();
    const diffInTime = today.getTime() - updatedDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    return diffInDays <= returnDays;
  };

  // useEffect(() => {
  //   GetReturnDaysConfig();
  // }, []);

  return (
    <div className="border-[#EFEFEF] px-4 md:px-[24px] pt-4 md:pt-6 border-[1px] border-solid rounded-2xl bg-white">
      <ReturnReasonModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        orderNumber={item.OrderNumber}
        orderId={item.Id}
        OrderDetailId={item.OrderDetailId}
        SkuId={item.skuId}
        PartnerId={item.PartnerId}
        IsReturn={isReturn}
      />

      {/* Product Image + Details */}
      <div className="flex gap-4 pb-4">
        <img
          src={Image.toLowerCase()}
          alt="product-image"
          className="size-[60px] md:size-[120px] object-cover rounded-md flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] md:text-[20px] font-semibold leading-[20px] md:leading-[24px] text-[#050505] truncate">
            {item?.ProductName}
          </h2>

          <span className="text-base text-gray-600 block mt-1">
            {removeBracketValues(item?.AttributeDescription ? item?.AttributeDescription : '')}
          </span>

          {item?.DiscountPricePercentage > 0 && (
            <span className="text-base font-semibold text-[#EA002A] block mt-1">
              {item?.DiscountPricePercentage}% offer applied
            </span>
          )}

          <div className="mt-2">
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold">
                {currencyByCountry(
                  formatPrice(
                    (item?.TotalPrice == 0 || item?.TotalPrice == null) ? item?.Price : item?.TotalPrice
                  )
                )}
              </span>

              <span className="text-sm lg:text-base italic text-[#31313188] font-semibold">
                {(formatPrice(item?.TotalPrice) === formatPrice(item?.OldPrice) &&
                  formatPrice(item?.Price) === formatPrice(item?.OldPrice))
                  ? ""
                  : (formatPrice(item?.TotalPrice) !== formatPrice(item?.OldPrice) && item.OldPrice > 0 && (
                    <span className="relative line-through decoration-[#EA002A] decoration-[2px]">
                      {currencyByCountry(formatPrice(item?.OldPrice))}
                    </span>
                  ))
                }
              </span>
            </div>

            {/* Quantity moved BELOW the price line */}
            <span className="block mt-2 text-sm lg:text-base text-[#31313188] font-semibold">
              Quantity: {item?.Quantity || 0}
            </span>
          </div>
        </div>

        {/* Desktop Delivery Details (Hidden on Mobile) */}
        {item.OrderStatusId != 0 && (
          <div className="hidden md:block w-[280px] flex-shrink-0 ml-auto">
            <h3 className="text-[#939393] text-[12px] leading-[22px] font-medium uppercase tracking-wider">
              DELIVERY DETAILS
            </h3>
            <h2 className="font-semibold text-[14px] leading-[26px] mt-1">
              {item?.FullName} | {item?.PhoneNumber}
            </h2>
            <p className="text-[14px] font-normal leading-[24px] text-gray-700 mt-1">
              <span>
                {item.Address1 && <>{item.Address1}, </>}
                {item.Address2 && <>{item.Address2}, </>}
              </span>
              <br />
              {item.Title ? <>{item.Title},<br /></> : ""}
              {item.City && <>{item.City}&nbsp;</>}
              {item.ZipPostalCode && `- ${item.ZipPostalCode}. `}
              {item?.StateName}
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[#EFEFEF] my-4" />

      {/* Main Content for Completed/Processed Orders */}
      {item.OrderStatusId != 0 ? (
        <div className="space-y-5">
          <div className="md:hidden">
            <h3 className="text-[#939393] text-[12px] leading-[22px] font-medium uppercase tracking-wider">
              DELIVERY DETAILS
            </h3>
            <h2 className="font-semibold text-[14px] leading-[26px] mt-1">
              {item?.FullName} | {item?.PhoneNumber}
            </h2>
            <div className="text-[14px] font-normal leading-[24px] text-gray-700 mt-1">
              <span>
                {item.Address1 && <>{item.Address1}, </>}
                {item.Address2 && <>{item.Address2}, </>}
              </span>
              <br />
              {item.Title ? <>{item.Title},<br /></> : ""}
              {item.City && <>{item.City}&nbsp;</>}
              {item.ZipPostalCode && `- ${item.ZipPostalCode}. `}
              {item?.StateName}
            </div>
          </div>

          {/* Order Info: Number, OTP, Status */}
          <div className="space-y-3 text-[#939393] text-[12px] md:text-[14px] font-medium">
            <div>Order No.: #{item?.OrderNumber}</div>

            {item?.OrderOTP && (
              <div>Your Order Completion OTP is {item?.OrderOTP}</div>
            )}

            {/* Status + Actions (Review / Return) */}
            {item.ReturnRequestStatusId == null ? (
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  Status: {item?.StatusName} {HelperConstant.orderStatus[item?.OrderStatusId]} on{" "}
                  {formatDate(item?.UpdatedOrderDate)}
                </span>
                <div className="flex flex-wrap items-center gap-3 ">
                  {item?.OrderStatusId == 5 || item?.OrderStatusId === 4 && (
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="text-[#EA002A] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Add Review
                    </button>
                  )}

                  {item?.StatusName === "Completed" &&
                    item?.IsReturnable &&
                    item?.UpdatedOrderDate &&
                    item?.ReturnDays &&
                    new Date(item.UpdatedOrderDate).getTime() + item.ReturnDays * 24 * 60 * 60 * 1000 >= Date.now() && (
                      <button
                        onClick={() => { setIsReturnModalOpen(true), setIsReturn(true) }}
                        className="py-[6px] px-[14px] border-[#EA002A] border-[1px] border-solid rounded-md text-[#EA002A] hover:bg-[#EA002A] hover:text-white flex items-center gap-1 whitespace-nowrap transition"
                      >
                        <Undo2 size={17} strokeWidth={3} />
                        <span>Return Item</span>
                      </button>
                    )}

                  {item?.StatusName === "Completed" &&
                    item?.IsReplacement &&
                    item?.UpdatedOrderDate &&
                    item?.ReplacementDays &&
                    new Date(item.UpdatedOrderDate).getTime() + item.ReplacementDays * 24 * 60 * 60 * 1000 >= Date.now() && (
                      <button
                        onClick={() => setIsReturnModalOpen(true)}
                        className="py-[6px] px-[14px] border-[#2563EB] border-[1px] border-solid rounded-md text-[#2563EB] hover:bg-[#2563EB] hover:text-white flex items-center gap-1 whitespace-nowrap transition"
                      >
                        <RefreshCcw size={17} strokeWidth={3} />
                        <span>Replace Item</span>
                      </button>
                    )}

                </div>
              </div>
            ) : (
              <div>
                Return Status: {HelperConstant.returnOrderStatus[item?.ReturnRequestStatusId]} on{" "}
                {formatDate(item?.UpdatedOrderDate)}
              </div>
            )}
          </div>

          <div className="flex gap-3 flex-wrap p-4">
            {/* Download Invoice Button */}
            {item?.OrderStatusId == 5 || item?.OrderStatusId === 4 && (
              <button
                onClick={() => downloadInvoice(item.Id, item.OrderNumber)}
                className="py-[8px] px-[10px] border border-[#939393] rounded-md text-sm hover:bg-gray-50 whitespace-nowrap flex items-center justify-center gap-2 min-w-[140px]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
                ) : (
                  <FileIcon />
                )}
                <span className="text-[#050505] font-medium">
                  Download Invoice
                </span>
              </button>
            )}

            {/* Track Order / Hide Tracking Button */}
            <button
              onClick={() => setExpandedOrderId(expandedOrderId === item.OrderId ? null : item.OrderId)}
              className="py-[8px] px-[10px] border border-[#939393] rounded-md text-sm hover:bg-gray-50 whitespace-nowrap"
            >
              {expandedOrderId === item.OrderId ? "Hide Tracking" : "Track Order"}
            </button>

            {/* Cancel Button */}
            {(item.OrderStatusId === 1 || item.OrderStatusId === 2) && (
              <button
                onClick={() => DeleteHandler(item)}
                className="py-[8px] px-[10px] border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-600 hover:text-white whitespace-nowrap transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          {delet && <CancellationPoup data={orderData} setPopupType={setDelete} popupType={delet} isMobile={false} show={true} />}
          {/* Order Tracker - Expands Below Everything */}
          {expandedOrderId === item.OrderId && (
            <div className="border-t pt-6 mt-6">
              <OrderTracker
                status={!(item.OrderStatusId === 3 || item.OrderStatusId === 5)}
                OrderStatusData={generateStatusLogs(
                  item.OrderStatusId,
                  item.OrderDate,
                  item.UpdatedOrderDate,
                  item.PaidOrderDate || item.OrderDate,
                )}
              />
            </div>
          )}
        </div>
      ) : (
        /* Pending Checkout State */
        <div className="flex justify-center py-10">
          <button
            onClick={() => ContinueOrderHandler(item.EncryptedOrderId)}
            className="bg-[#EA002A] text-white px-6 py-3 rounded-md font-medium w-full max-w-md"
          >
            Continue to checkout
          </button>
        </div>
      )}

      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-[420px] mx-4 shadow-lg">
            <h2 className="text-sm font-semibold text-center mb-3">
              Write a Review
            </h2>

            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Title"
              className="w-full border border-gray-300 rounded-md p-2 mb-2 text-xs"
            />

            <textarea
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              placeholder="Write your review here..."
              className="w-full border border-gray-300 rounded-md p-2 mb-3 h-24 resize-none text-xs"
            />

            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-lg focus:outline-none"
                >
                  <span className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-1">Upload Photos (optional)</p>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const filesArray = Array.from(e.target.files);
                    setSelectedImages((prev) => [...prev, ...filesArray]);
                  }
                }}
                className="hidden"
                id={`file-upload-${item.OrderId}`}
              />
              <label
                htmlFor={`file-upload-${item.OrderId}`}
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md px-3 py-1 text-xs inline-block"
              >
                Choose Images
              </label>

              {selectedImages.length > 0 && (
                <ul className="mt-2 text-xs text-gray-700 space-y-1">
                  {selectedImages.map((file, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="truncate max-w-[260px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="text-red-500 text-xs ml-2"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-1 text-xs bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitReview}
                disabled={rating === 0 || isButtonDisable}
                className="px-4 py-1 text-xs bg-[#EA002A] text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersCard;