import { useState } from "react";
import { Discount } from "../productCard/Discount";
import s22Mobile from "../productCard/assets/image.png";
import { currencyByCountry, formatPrice } from "shared/src/components/helper/Helper";

type ProductCardType = {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  discount: number;
  Image: any;
  isGrid?: boolean;
  encryptedId?: any;
  onSelect?: (id: number, price: number, encryptedId: any) => void;
};

export const ProductCardSelection = (props: ProductCardType) => {
  const calculateDiscount = (price: any, discount: any) => {
    return (price - price * (discount / 100))
      .toLocaleString()
      .split(".")
      .map((e, i) => {
        if (i == 1) {
          return e.slice(0, 2);
        } else {
          return e;
        }
      })
      .join(".");
  };
  const [select, setSelect] = useState(false);

  const handleSelection = () => {
    setSelect((prev) => !prev);
    if (!select && props.onSelect) {
      props.onSelect(props.id, props.price, props.encryptedId);
    }
  };

  const formattedMediaFileName = props.Image?.split(', ')[0] || "";
  const mediaUrlPrefix = process.env.NEXT_PUBLIC_MEDIA_URL || '';
  const firstImageUrl = props.Image
    ? encodeURI(`${mediaUrlPrefix}${formattedMediaFileName}`)
    : s22Mobile.src;

  return (
    <div
      className={`cursor-pointer w-full flex flex-col border bg-white border-[#EFEFEF] rounded-xl md:rounded-2xl relative overflow-hidden`}
      onClick={handleSelection}
    >
      <div
        className={`w-6 h-6 md:w-8 md:h-8 absolute top-2 right-3 z-50 flex justify-center items-center bg-white border ${select ? "border-[#EA002A]" : "border-[#DBD9D9]"
          } rounded-md`}
      >
        {select && <Tick />}
      </div>
      <div className="w-full relative bg-[#F5F5F5] h-[150px] md:h-[200px] py-3 rounded-t-xl rounded-b-none md:rounded-t-2xl">
        <img
          src={firstImageUrl}
          className="mx-auto h-full object-contain"
          alt="product"
        />
      </div>
      <div className="flex flex-col p-3 px-4 sm:p-4 gap-2">
        <h3 className="font-semibold text-base sm:text-lg">{props?.title}</h3>

        <div className="flex items-center justify-start gap-2 md:gap-3">
          <p className="text-base md:text-xl md:leading-[18px] font-semibold my-auto">
          {currencyByCountry(formatPrice(props?.price))}
          </p>

          <p className="text-sm lg:text-base italic text-[#31313188] font-semibold relative 
                after:contents-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-[112%] after:bg-[#EA002A]">
            {props?.oldPrice !== 0 ? props?.oldPrice : ''}
          </p>
          {/* {props?.discount && (
            <>
              {!props.isGrid && props?.discount && (
                <Discount discount={props?.discount} />
              )}
            </>
          )} */}
        </div>
      </div>
    </div >
  );
};

const Tick = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 4.5L6.75 12.75L3 9"
      stroke="#EA002A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
