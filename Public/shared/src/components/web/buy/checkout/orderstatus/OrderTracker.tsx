import { useRouter } from "next/router";

function OrderTracker({
  status,
  OrderStatusData,
  titleStatue = true,
}: {
  status: boolean;
  OrderStatusData: any;
  titleStatue?: any;
}) {
  const router = useRouter();
  const path = router.asPath;
  return (
    <div className="flex flex-col gap-2 lg:gap-5 lg:py-3 overflow-hidden">
      {titleStatue && (
        <div className="text-xs sm:text-sm font-semibold text-[#9E9E9E] ml-0 sm:ml-5">
          ORDER STATUS
        </div>
      )}
      <div className="w-full flex flex-col relative h-40 lg:h-fit lg:flex-row">
        {OrderStatusData.map((item: any, index: any) => {
          const statusLength = OrderStatusData.length;
          return (
            <div
              className={`flex lg:flex-col lg:items-center gap-2 lg:w-full ${
                index !== statusLength - 1 && "h-full"
              }`}
              key={index}
            >
              {/* this name will show for desktop design only */}
              <div
                className={`${
                  item?.status
                    ? status
                      ? "text-[#249B3E]"
                      : "text-[#EA002A]"
                    : "text-[#939393]"
                } hidden lg:block text-xs font-medium capitalize`}
              >
                {item?.title}
              </div>
              {/* using after effect we design a new status bar for order status */}
              <div
                className={`relative lg:w-full lg:flex lg:justify-center lg:items-center
              ${
                index !== statusLength - 1 &&
                `after:content-[''] after:h-full after:w-[1px] lg:after:h-1 lg:after:w-full after:absolute after:left-[3px] lg:after:left-1/2 after:-translate-x-1/2 after:top-2 after:translate-y-full lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:-translate-x-0`
              }
              ${
                status === true
                  ? index !== statusLength - 1 &&
                    OrderStatusData[index + 1].status == true
                    ? "after:bg-[#249B3E]"
                    : "after:bg-[#ECECEC]"
                  : index !== statusLength - 1 &&
                    OrderStatusData[index + 1].status == true
                  ? "after:bg-[#EA002A]"
                  : "after:bg-[#ECECEC]"
              }`}
              >
                {/* order dot design */}
                <div
                  className={`shrink-0 relative w-2 h-2 rounded-full z-10 lg:mt-[2px]`}
                  style={{
                    backgroundColor: `${
                      item?.status
                        ? status
                          ? "#249B3E"
                          : "#EA002A"
                        : "#939393"
                    }`,
                  }}
                ></div>
              </div>
              {/* this date will show for desktop design only */}
              {path.includes("order-summary") ? (
                <>
                  {item.title == "Order Confirmed" && (
                    <div
                      className={`${
                        item?.status
                          ? status
                            ? "text-[#249B3E]"
                            : "text-[#EA002A]"
                          : "text-[#939393]"
                      } hidden lg:block text-xs font-medium`}
                    >
                      {item?.date}
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`${
                    item?.status
                      ? status
                        ? "text-[#249B3E]"
                        : "text-[#EA002A]"
                      : "text-[#939393]"
                  } hidden lg:block text-xs font-medium`}
                >
                  {item?.date}
                </div>
              )}

              {/* this is the order name ans date for mobile view */}
              <div className="flex lg:hidden flex-col gap-1 mt-[-3px]">
                <div
                  className={`text-xs font-semibold capitalize ${
                    item?.status
                      ? status
                        ? "text-[#249B3E]"
                        : "text-[#EA002A]"
                      : "text-[#939393]"
                  }`}
                >
                  {item?.title}
                </div>
                <div
                  className={`text-[10px] font-semibold ${
                    item?.status
                      ? status
                        ? "text-[#249B3E]"
                        : "text-[#EA002A]"
                      : "text-[#939393]"
                  }`}
                >
                  {item?.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTracker;