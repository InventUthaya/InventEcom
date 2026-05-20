import { OrderCancleIcon, OrderSuccessIcon } from "../assets";

function OrderstatusBanner({ status }: { status: boolean }) {
  return (
    <div className="relative w-full h-48 lg:h-52 flex justify-center items-center ">
      <BannerDesign color={status ? "249B3E" : "EA002A"} />
      <div className="flex justify-center items-center flex-col gap-1">
        <div
          className={`w-16 h-16 rounded-full flex justify-center items-center z-10`}
          style={{ backgroundColor: `#${status ? "249B3E29" : "EA002A20"}` }}
        >
          {status ? <OrderSuccessIcon /> : <OrderCancleIcon />}
        </div>
        <div className="text-xl lg:text-2xl font-semibold  z-10">
          {status ? "Congratulations!" : "Payment failed"}
        </div>
        <div className="font-normal z-10 text-sm">
          {status
            ? "Your Order placed successfully"
            : "Your Order placement failed"}
        </div>
      </div>
    </div>
  );
}

export default OrderstatusBanner;

const BannerDesign = ({ color }: { color: any }) => {
  return (
    <>
      <div
        className={`absolute -bottom-24 left-10 w-36 h-36 rounded-full blur-[240px]`}
        style={{ backgroundColor: `#${color}` }}
      ></div>
      <div
        className={`absolute -bottom-24 right-10 w-36 h-36 rounded-full blur-[140px] `}
        style={{ backgroundColor: `#${color}` }}
      ></div>
      <svg
        viewBox="0 0 141 143"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-[100px] h-[120] lg:w-[140px] lg:h-[140]"
      >
        <circle
          cx="-15.9645"
          cy="-13.9635"
          r="155.718"
          transform="rotate(72.8457 -15.9645 -13.9635)"
          stroke="url(#paint0_linear_109_65471)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_109_65471"
            x1="-133.185"
            y1="-115.894"
            x2="-48.4559"
            y2="136.898"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={`#${color}`} />
            <stop offset="0.936081" stopColor={`#${color}`} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox="0 0 103 154"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 right-0 w-[60px] h-[100] lg:w-[100px] lg:h-[150]"
      >
        <circle
          cx="134.035"
          cy="134.036"
          r="132.579"
          transform="rotate(72.8457 134.035 134.036)"
          stroke="url(#paint0_linear_109_65470)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_109_65470"
            x1="34.122"
            y1="47.1548"
            x2="106.341"
            y2="262.623"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={`#${color}`} />
            <stop offset="0.936081" stopColor={`#${color}`} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};
