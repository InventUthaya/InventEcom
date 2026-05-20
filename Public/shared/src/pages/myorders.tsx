import { useEffect, useState } from "react";
import Menu from "../components/utils/Menus/TopMenu";
import { ITrackOrderItemModel } from "../models/TrackOrder.Model";
import { Direction, getLocalStorage, getUserLanguage } from "../components/helper/Helper";
import TrackOrderService from "../services/TrackOrder.Service";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { MobileMenuSell } from "../components/utils/Menus/MobileSubMenu";
import { MenuContentZindex } from "../recoil/styleState";
import { ISEOModel } from "../models/SEO.Model";
import { HelperConstant } from "../components/helper/HelperConstant";
import MetaTags from "../components/utils/metatags/MetaTags";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";
import OrdersCard from "../components/web/Profile/components/Orders/OrdersCard";
import Breadcrumbs from "../components/utils/BreadCrumb/Breadcrumbs";

type MyOrderProps = {
  trackOrder: ITrackOrderItemModel[],
  isSSR?: boolean,
  filtertype: string,
  metaTags?: ISEOModel
}

function MyOrders({ trackOrder, isSSR, filtertype, metaTags }: MyOrderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trackOrderList, setTrackOrderList] = useState<MyOrderProps>({ trackOrder: [], filtertype, metaTags });
  const [orders, setOrders] = useState<ITrackOrderItemModel[]>([]);
  let direction = Direction();
  let language = getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
  const [orderFilterList, setOrderFilterList] = useState({
    list: [
      { title: "older first" },
      { title: "Newest first" },
      { title: "Last 30 days only" },
      { title: "All" },
      { title: "Alphabetic order" },
    ],
    selectedValue: "Newest first",
  });
  const menuContentZindex = useRecoilValue(MenuContentZindex);

  const fetchData = async () => {
    try {
      const customerId = getLocalStorage()?.PersonId as any;
      const filtertype = orderFilterList.selectedValue;
      let metaTags = getStaticMeta(HelperConstant.metaPages.MyOrders);

      TrackOrderService.GetOrderByCustomerId(customerId, filtertype).then((res => {
        if (res.status === 200) {
          let filteredItems = (res.data || []).filter((item: { OrderStatusId: number; }) => item.OrderStatusId !== 0);
          setOrders(filteredItems);
          setTrackOrderList({
            trackOrder: res.data.Items || [],
            filtertype: orderFilterList.selectedValue,
            metaTags: metaTags
          });
          setLoading(false);
        }
      }));

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderFilterList.selectedValue]);

  return (
    <>

      <MetaTags metaTags={trackOrderList.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={language} />
      {/* {loading && <Loader />} */}
      {!router.pathname.includes('/profile/') && (
        <>
          <Menu needSearch={false} />
          {/* <MobileMenuBuy ActiveId={-1} /> */}
          <MobileMenuSell ActiveId={0} zIndex={menuContentZindex.Z_Index} />
        </>
      )}
      <div className="lg:px-16 px-5">
        <div className="mt-3">
          <Breadcrumbs
            category={"My Orders"}
            subcategory={""} />
        </div>
        <div className="max-w-[1300px] mx-auto pb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-sm tracking-[2px] py-5 flex gap-1 font-semibold capitalize px-5 pb-4 lg:px-8">
              <span>MY ORDERS</span>
              <span className="text-[#EA002A] font-semibold">{`(${orders.length})`}</span>
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
          <div className="flex flex-col gap-5">
            {orders.map((data) => {
              return <OrdersCard key={data.OrderId} {...data} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyOrders;


const OrderFilterIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.54688 8.3623L6.4562 5.45298L9.36552 8.3623"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8191 18.5469H9.3644C8.5928 18.5469 7.8528 18.2404 7.3072 17.6948C6.76159 17.1492 6.45508 16.4092 6.45508 15.6376L6.45508 5.45493"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.5462 15.6376L16.6369 18.5469L13.7275 15.6376"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.2754 5.45493H13.7301C14.5017 5.45493 15.2416 5.76145 15.7873 6.30705C16.3329 6.85266 16.6394 7.59265 16.6394 8.36425V18.5469"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
