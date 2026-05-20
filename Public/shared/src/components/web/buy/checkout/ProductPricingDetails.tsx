import { useEffect, useState } from "react";
import { PromoAcceptIcon, PromoRejectIcon, TrashIcon } from "./assets";
import { useRecoilState, useRecoilValue } from "recoil";
import router, { useRouter } from "next/router";
import { UserLoginDetails } from "../../../../recoil/userAuth";
import {
  AddCheckoutAddress,
  ScheduleOrder,
  ShowAddressFormForMobile,
} from "../../../../recoil/AddCheckout";
import { CheckOutPayment } from "../../../../recoil/payment";
import { containerZindex } from "../../../../recoil/styleState";
import DiscountServices from "shared/src/services/Discount.Services";
import { currencyByCountry, formatPrice, getLocalStorage, removeBracketValues } from "shared/src/components/helper/Helper";
import { IGetOrderItemModel } from "shared/src/models/BuyOrder.Model";
import DiscountUsageHistory from "shared/src/services/DiscountUsageHistory";

type discountComponentProps = {
  onApplyDiscountId?: (discountAmount: number | null, discountId: any, finalAmount: any) => void;
  ProductDetail: any[];
  ProductView: any;
  OrderHeader?: any;
  slotHandler?: (isOrderStatus: boolean) => void | undefined,
  totalCartPrice?: number;
}

export const ProductPriceingDetails: React.FC<discountComponentProps> = ({
  onApplyDiscountId,
  ProductDetail,
  ProductView,
  OrderHeader,
  slotHandler,
  totalCartPrice: externalTotalCartPrice
}) => {

  const router = useRouter();
  const path = router.asPath;
  const [showPriceTag, setShowPriceTag] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [promoCodeMessage, setPromoCodeMessage] = useState("");
  const [calculatedTotalPrice, setCalculatedTotalPrice] = useState<number>(0);

  const selectedTab = useRecoilValue(ScheduleOrder);

  useEffect(() => {
    setData(ProductDetail || []);

    if (OrderHeader) {
      setOrderData({
        ...OrderHeader,
        Price: OrderHeader.ProductTotal || 0,
        OrderTotal: OrderHeader.NetPayable || OrderHeader.ProductTotal || 0,
        DiscountAmount: OrderHeader.DiscountTotal || 0,
        HasCouponCode: false,
        IsTaxExempt: false,
        VATAmount: OrderHeader.ProductTaxTotal || 0,
      });
    } else if (ProductView && ProductView.OrderHeader) {
      setOrderData({
        ...ProductView.OrderHeader,
        Price: ProductView.OrderHeader.ProductTotal || 0,
        OrderTotal: ProductView.OrderHeader.NetPayable || ProductView.OrderHeader.ProductTotal || 0,
        DiscountAmount: ProductView.OrderHeader.DiscountTotal || 0,
        HasCouponCode: false,
        IsTaxExempt: false,
        VATAmount: ProductView.OrderHeader.ProductTaxTotal || 0,
      });
    }
  }, [ProductDetail, ProductView, OrderHeader]);

  const calculateProductTotals = () => {
    if (!ProductDetail || ProductDetail.length === 0) return { total: 0, tax: 0 };

    const total = ProductDetail.reduce((sum, item) => sum + (item.TotalPrice || item.UnitPrice || 0), 0);
    const tax = ProductDetail.reduce((sum, item) => sum + (item.TaxAmount || 0), 0);

    return { total, tax };
  };

  useEffect(() => {
    const totals = calculateProductTotals();
    setCalculatedTotalPrice(totals.total);
  }, [ProductDetail]);

  const productTotals = calculateProductTotals();

  const orderTotal = orderData?.OrderTotal || productTotals.total || 0;
  const taxTotal = orderData?.VATAmount || productTotals.tax || 0;
  const discountTotal = orderData?.DiscountAmount || 0;

  const handlePromoDiscount = (discountAmount: number | null, discountId: any, discountMessage: any, promoCodeValue?: string) => {
    const currentAmount = orderTotal - (discountAmount || 0);
    setPromoDiscount(discountAmount);
    onApplyDiscountId?.(discountAmount, discountId, currentAmount);
    setPromoCodeMessage(discountMessage);
  };

  const finalAmount = promoDiscount
    ? orderTotal - promoDiscount
    : orderTotal;

  useEffect(() => {
    let path = router.asPath.split("/");
    if (
      path.length > 1 &&
      (path[path.length - 1] == "checkout")
    ) {
      setShowPriceTag(true);
    } else {
      setShowPriceTag(false);
    }
  }, [router.asPath]);

  return (
    <>
      <h1 className="text-sm tracking-[2px] font-semibold capitalize px-2 pb-4 lg:px-8">
        PRODUCTS{" "}
        <span className="text-[#EA002A] font-semibold">{`(${data.length})`}</span>
      </h1>
      <div className="w-full lg:h-[40vh] lg:overflow-auto px-2 lg:px-8">
        {data.map((item, indx) => (
          <ProductDetailCard key={indx} orderdata={item} />
        ))}
      </div>

      <div className="w-[100%] p-4 lg:px-8 lg:shadow-[0px_-10px_20px_#E8E8E8]">
        <h2 className="text-[#EA002A] text-sm lg:text-base uppercase font-semibold tracking-[2px]">
          Price details
        </h2>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex justify-between text-[#252525] font-light capitalize">
            <span className="font-semibold text-sm lg:text-base">Product Total</span>
            <span className="font-semibold text-sm lg:text-base">
              {currencyByCountry(formatPrice(productTotals.total))}
            </span>
          </div>

          {taxTotal > 0 && (
            <div className="flex justify-between text-[#252525] font-light capitalize">
              <span className="font-semibold text-sm lg:text-base">Tax</span>
              <span className="font-semibold text-sm lg:text-base">
                +{currencyByCountry(formatPrice(taxTotal))}
              </span>
            </div>
          )}

          {discountTotal > 0 && (
            <div className="flex justify-between text-[#252525] font-light capitalize">
              <span className="font-semibold text-sm lg:text-base">Discount</span>
              <span className="font-semibold text-sm lg:text-base">
                -{currencyByCountry(formatPrice(discountTotal))}
              </span>
            </div>
          )}

          {(!path.includes("/order-summary") && !orderData?.HasCouponCode) && (
            <div className="flex justify-between text-[#252525] font-light capitalize">
              <span className="font-semibold text-sm lg:text-base">
                Promo code
              </span>
              <PromoCodeComponent
                onApplyDiscount={handlePromoDiscount}
                HasCouponCode={orderData?.HasCouponCode}
                CouponCode={orderData?.CouponCode}
                OrderId={orderData?.Id || ProductView?.OrderHeader?.Id}
                DiscountId={orderData?.DiscountId}
                DiscountAmount={orderData?.DiscountAmount}
                totalCartPrice={externalTotalCartPrice || calculatedTotalPrice}
              />
            </div>
          )}

          {promoCodeMessage && (
            <div className="text-xs 2xl:text-sm text-end font-semibold text-[#EA002A]">
              {promoCodeMessage}
            </div>
          )}

          <div className="pb-5 lg:p-0">
            <div className="border-y-2 flex justify-between py-4 mt-4 capitalize">
              <span className="font-semibold text-base lg:text-xl">
                Total payable amount

                <span className="text-base text-[#939393] m-1">
                  {taxTotal > 0 ? `(Inclusive of taxes)` : ""}
                </span>
              </span>
              <span className="font-semibold text-base lg:text-xl">
                {currencyByCountry(formatPrice(finalAmount))}
              </span>
            </div>
          </div>
        </div>

        {showPriceTag && (
          <ProductDetailMobileFixed
            orderData={orderData}
            TotalAmount={finalAmount}
            slotHandler={slotHandler}
          />
        )}
      </div>
    </>
  );
};

type ProductdataProps = {
  orderdata: any;
}

export const ProductDetailCard = ({ orderdata }: ProductdataProps) => {
  const getProductImage = () => {
    if (orderdata?.FormattedMediaFileName) {
      const formattedMediaFileName = orderdata.FormattedMediaFileName.split(',')[0] || "";
      const mediaUrlPrefix = process.env.NEXT_PUBLIC_MEDIA_URL || "";
      return encodeURI(`${mediaUrlPrefix}${formattedMediaFileName}`);
    }

    return "/placeholder-image.jpg";
  };

  const getProductName = () => {
    return orderdata?.ProductName ||
      orderdata?.ProductDetails?.[0]?.ProductName ||
      "Product Name Not Available";
  };

  const getProductDescription = () => {
    return orderdata?.Description ||
      orderdata?.ProductDetails?.[0]?.Description ||
      "";
  };

  const getBrandName = () => {
    return orderdata?.BrandName ||
      orderdata?.ProductDetails?.[0]?.BrandName ||
      "";
  };

  const getPrice = () => {
    return orderdata?.TotalPrice ||
      orderdata?.UnitPrice ||
      orderdata?.BasePrice ||
      orderdata?.ProductDetails?.[0]?.BasePrice ||
      0;
  };

  const getOldPrice = () => {
    if (orderdata?.DiscountPrice && orderdata.DiscountPrice > 0) {
      return getPrice() + orderdata.DiscountPrice;
    }
    return null;
  };

  const getDiscountPercentage = () => {
    const price = getPrice();
    const oldPrice = getOldPrice();
    if (oldPrice && oldPrice > price) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    return 0;
  };

  const imageUrl = getProductImage();
  const productName = getProductName();
  const description = getProductDescription();
  const brandName = getBrandName();
  const price = getPrice();
  const oldPrice = getOldPrice();
  const discountPercentage = getDiscountPercentage();

  return (
    <div className="flex justify-start items-start gap-3 lg:gap-6 py-4 border-b lg:border-b-2">
      <div className="w-32 lg:w-40 h-24 lg:h-32 bg-[#efefef] p-2 lg:p-3 rounded-lg">
        <img
          src={imageUrl?.toLowerCase()}
          alt={productName}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
          }}
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex justify-between items-start">
          <div className="font-semibold text-base lg:text-xl">
            {productName}
          </div>
          <div className="cursor-pointer">
          </div>
        </div>

        {description && (
          <span className="text-sm lg:text-base text-gray-600">
            {removeBracketValues(description)}
          </span>
        )}

        {brandName && (
          <p className="text-[#252525] text-xs lg:text-sm font-medium">
            Brand: {brandName}
          </p>
        )}

        {orderdata?.RamSize && (
          <p className="text-[#252525] text-xs lg:text-sm font-medium">
            RAM: {orderdata.RamSize}
          </p>
        )}

        <p className="text-[#252525] text-xs lg:text-sm font-medium">
          Quantity: {orderdata?.Quantity || 1}
        </p>

        <div className="mt-1 lg:mt-2 flex flex-col gap-1 lg:gap-2">
          {discountPercentage > 0 && (
            <p className="text-[#EA002A] text-xs lg:text-sm font-bold">
              {discountPercentage}% Off
            </p>
          )}

          <div className="flex gap-2 lg:gap-4 items-center justify-start">
            <span className="text-base lg:text-lg font-bold">
              {currencyByCountry(formatPrice(price))}
            </span>

            {oldPrice && oldPrice > price && (
              <span className="text-sm lg:text-base italic text-[#31313188] font-semibold line-through">
                {currencyByCountry(formatPrice(oldPrice))}
              </span>
            )}
          </div>

          {orderdata?.TaxAmount && orderdata.TaxAmount > 0 && (
            <p className="text-xs text-gray-500">
              + {currencyByCountry(formatPrice(orderdata.TaxAmount))} tax
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

type PromoCodeComponentProps = {
  onApplyDiscount: (discountAmount: number | null, discountId: any, discountMessage: any, promoCodeValue?: string) => void;
  HasCouponCode?: boolean;
  CouponCode?: any;
  DiscountId?: any;
  OrderId?: any;
  DiscountAmount?: any;
  totalCartPrice?: number;
};

export const PromoCodeComponent: React.FC<PromoCodeComponentProps> = ({
  onApplyDiscount,
  HasCouponCode,
  CouponCode,
  OrderId,
  DiscountId,
  DiscountAmount,
  totalCartPrice = 0
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeStatus, setPromoCodeStatus] = useState<any>(undefined);
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [currentPromoCode, setCurrentPromoCode] = useState<string>("");
  const [removeConfirm, setRemoveConfirm] = useState(false);
  const selectedTab = useRecoilValue(ScheduleOrder);

  const handleChange = (event: any) => {
    if (event.target.value.length <= 15) {
      setPromoCode(event.target.value);
      setPromoCodeStatus(undefined);
      setDiscountAmount(null);
      onApplyDiscount(null, "", "");
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      getPromoCode(promoCode, event);
      event.preventDefault();
    }
  };

  const getPromoCode = (promoCode: any, event: any) => {
    const personId = getLocalStorage()?.PersonId as any;
    if (promoCode) {
      DiscountServices.getPromoCodeByPersonId(promoCode, personId).then(res => {
        if (res.status === 200 && res.data) {
          const discountData = res.data;
          let calculatedDiscount = 0;
          calculatedDiscount = discountData.Value;
          // if (discountData.DiscountType === "percentage") {
          //   // Calculate percentage discount
          //   calculatedDiscount = (totalCartPrice * discountData.Value) / 100;
          // } else if (discountData.DiscountType === "fixed") {
          //   // For fixed amount discount
          //   calculatedDiscount = discountData.Value;
          // }

          setPromoCodeStatus(true);
          setCurrentPromoCode(promoCode);
          setDiscountAmount(calculatedDiscount);
          onApplyDiscount(calculatedDiscount, discountData.Id, '', promoCode);

          if (event?.target?.blur) {
            event.target.blur();
          }
        } else {
          setPromoCodeStatus(false);
          setDiscountAmount(null);
          onApplyDiscount(null, "", "Invalid promo code");
        }
      }).catch((e: string) => {
        console.log(e);
        setPromoCodeStatus(false);
        setDiscountAmount(null);
        onApplyDiscount(null, "", "Error validating promo code");
      });
    } else {
      setPromoCodeStatus(undefined);
      setDiscountAmount(null);
      onApplyDiscount(null, "", "");
    }
  };

  const handleRemovePromoCode = () => {
    setPromoCode("");
    setPromoCodeStatus(undefined);
    setDiscountAmount(null);
    setCurrentPromoCode("");
    onApplyDiscount(null, "", "");
  };

  const RemoveCode = () => {
    DiscountUsageHistory.removePromoCodeByOrderId(OrderId, DiscountId).then(res => {
      if (res.status == 200) {
        setRemoveConfirm(false);
        window.location.reload();
      }
    }).catch((e: string) => {
      console.log(e);
    });
  };

  return (
    <>
      {removeConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="bg-white rounded-lg animate-slide-up z-10 relative max-w-lg w-full">
              <div className="overflow-hidden relative lg:px-8 px-4 lg:py-8 py-4">
                <div className="absolute top-2 right-2 bg-white drop-shadow-2xl z-50 rounded-full px-3 py-3 w-fit text-center">
                  <button
                    onClick={() => setRemoveConfirm(false)}
                    className="absolute top-[-4px] right-1 z-50 text-2xl text-[#000000] hover:text-gray-800"
                  >
                    ×
                  </button>
                </div>
                <h1 className="text-lg font-semibold">Information</h1>
                <h5 className="text-md mt-1 text-[#050505]">
                  Are you sure to Delete <span className="font-semibold">{CouponCode}</span> PromoCode
                </h5>
                <div className="absolute right-0 top-[-32px] left-[80%]">
                  <svg
                    width="100"
                    height="146"
                    viewBox="0 0 100 146"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="134.566"
                      cy="116.501"
                      r="132.579"
                      transform="rotate(72.8457 134.566 116.501)"
                      stroke="url(#paint0_linear_109_77655)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_109_77655"
                        x1="34.6533"
                        y1="29.6197"
                        x2="117.842"
                        y2="258.334"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#EA002A" />
                        <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="w-[100px] lg:block hidden h-[100px] bg-[#1E54c9] rounded-[50%] absolute left-20 bottom-[60px] blur-[220px]"></div>
                <div className="w-[120px] h-[100px] bg-[#EA002A] rounded-[50%] absolute right-10 bottom-[40px] blur-[100px] overflow-hidden"></div>
              </div>
              <div className="flex justify-center gap-8 mb-5">
                <button
                  onClick={() => setRemoveConfirm(false)}
                  className="px-4 py-2 w-[40%] border-2 border-[#050505] text-black rounded-lg"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    handleRemovePromoCode();
                    RemoveCode();
                  }}
                  className="px-4 py-2 w-[40%] bg-[#EA002A] text-white rounded-lg"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-start gap-1 border-b-2 border-dotted border-[#D9D9D9]">
        {(promoCodeStatus === true && (
          <>
            <div className="mt-[2px]">
              <PromoAcceptIcon />
            </div>
            <div className="mt-[2px] cursor-pointer ml-1" onClick={handleRemovePromoCode}>
              ×
            </div>
          </>
        )) ||
          (promoCodeStatus === false && (
            <div className="mt-[2px] cursor-pointer" onClick={handleRemovePromoCode}>
              <PromoRejectIcon />
            </div>
          ))}
        {HasCouponCode ? (
          <input
            type="text"
            placeholder="promo code"
            className="placeholder:text-[#A9A9A9] placeholder:text-xs font-semibold uppercase placeholder:lowercase text-center w-[10ch] text-xs lg:text-sm border-0 outline-0 bg-transparent"
            value={CouponCode}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onClick={() => setPromoCodeStatus(undefined)}
            disabled
          />
        ) : (
          <input
            type="text"
            placeholder="promo code"
            className="placeholder:text-[#A9A9A9] placeholder:text-xs font-semibold uppercase placeholder:lowercase text-center w-[10ch] text-xs lg:text-sm border-0 outline-0 bg-transparent"
            value={promoCode}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onClick={() => setPromoCodeStatus(undefined)}
          />
        )}
        {!HasCouponCode && promoCode && promoCodeStatus !== true ? (
          <button
            onClick={(e) => getPromoCode(promoCode, e)}
            className="w-fit capitalize border-theme px-2 py-[2px] font-semibold text-xs text-black rounded-md"
          >
            Apply Code
          </button>
        ) : null}
        {HasCouponCode ? (
          <>
            {DiscountAmount > 0 && (
              <div className="text-sm lg:text-base font-semibold">
                - {currencyByCountry(formatPrice(DiscountAmount))}
              </div>
            )}
            {!window.location.pathname.includes("/order-summary") && (
              <div className="mt-[2px] cursor-pointer" onClick={() => setRemoveConfirm(true)}>
                <TrashIcon />
              </div>
            )}
          </>
        ) : null}
        {(promoCodeStatus === true && discountAmount !== null && (
          <div className="text-sm lg:text-base font-semibold">
            - {currencyByCountry(formatPrice(discountAmount))}
          </div>
        ))}
      </div>
    </>
  );
};

type MobileproductProps = {
  orderData: any,
  TotalAmount: any,
  slotHandler?: (isOrderStatus: boolean) => void | undefined,
}

const ProductDetailMobileFixed = ({ orderData, TotalAmount, slotHandler }: MobileproductProps) => {
  const router = useRouter();
  const [showPriceTag, setShowPriceTag] = useState(false);
  const selectedTab = useRecoilValue(ScheduleOrder);
  const path = router.asPath;

  useEffect(() => {
    let path = router.asPath.split("/");
    if (
      path.length > 1 &&
      (path[path.length - 1] == "checkout")
    ) {
      setShowPriceTag(true);
    } else {
      setShowPriceTag(false);
    }
  }, [router.asPath]);

  return (
    <>
      {path.includes("/order-summary") && (
        <div className="block lg:hidden w-full fixed bottom-0 left-0 bg-white p-4 shadow-[0px_-10px_20px_#E8E8E8]">
          <div className="flex gap-5 px-3">
            <div className="flex flex-col">
              {orderData?.OldPrice && orderData.OldPrice > TotalAmount && (
                <span className="text-sm lg:text-base italic text-[#31313188] font-semibold line-through">
                  {currencyByCountry(formatPrice(orderData.OldPrice))}
                </span>
              )}

              <span className="text-lg font-bold">
                {currencyByCountry(formatPrice(TotalAmount))}
              </span>

              <div className="row">
                <span className="text-sm font-semibold text-[#939393]">
                  {orderData?.VATAmount > 0 ? "Incl. Tax" : ""}
                </span>
              </div>
            </div>
            <UserCurrentPosition slotHandler={slotHandler} />
          </div>
        </div>
      )}
    </>
  );
};

type UserCurrentPositionProps = {
  slotHandler?: (isOrderStatus: boolean) => void | undefined,
}

const UserCurrentPosition = ({ slotHandler }: UserCurrentPositionProps) => {
  const navigate = useRouter();
  const [IsUserLoggedIn, setIsUserLoggedIn] = useRecoilState(UserLoginDetails);
  const [IsAddressAdded, _] = useRecoilState(AddCheckoutAddress);
  const IsPaymentChoosed = useRecoilValue(CheckOutPayment);
  const [__, setShowAddressForms] = useRecoilState(ShowAddressFormForMobile);
  const [___, setZindex] = useRecoilState(containerZindex);
  const selectedTab = useRecoilValue(ScheduleOrder);
  const path = router.asPath;

  const LoginHandler = () => {
    setIsUserLoggedIn((e) => ({
      ...e,
      status: true,
      data: {
        username: "test",
        mobileNumber: "+91 8912345678",
        email: "test@example.com",
        pincode: "909090",
      },
    }));
    navigate.push("/buy/checkout/selectaddress");
  };

  const UserAddressHandler = () => {
    setShowAddressForms((e) => ({
      ...e,
      AddressSelectionForm: false,
      AddAddressForm: true,
    }));
    setZindex("z-50");
  };

  const PaymentHandler = () => {
    navigate.push("/buy/checkout/orderstatus");
  };

  if (!IsAddressAdded.status && path.includes("/order-summary")) {
    return (
      <button
        onClick={UserAddressHandler}
        className="flex-1 w-11/12 disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC] bg-[#EA002A] border-0 outline-0 text-white flex justify-center items-center rounded-md capitalize text-lg font-semibold"
      >
        Add Address
      </button>
    );
  } else if (IsPaymentChoosed.status) {
    return (
      <button
        onClick={() => slotHandler?.(true)}
        className="flex-1 disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC] bg-[#EA002A] border-0 outline-0 text-white flex justify-center items-center rounded-md capitalize text-lg font-semibold"
      >
        Proceed to pay
      </button>
    );
  }

  return null;
};