import { currencyByCountry, formatPrice } from "shared/src/components/helper/Helper";
import { CardTag } from "shared/src/components/utils/Cards/productCard/CardTag";
import { Discount } from "shared/src/components/utils/Cards/productCard/Discount";
import s22Mobile from "shared/src/components/utils/Cards/productCard/assets/image.png";
import handleMostVisitedTracking from "./HandleAddorUpdateMostVisitedProducts";

type MostVisitedProductCardType = {
    title: string;
    price: number;
    discount: number;
    needTag?: boolean;
    tagName?: string;
    isGrid?: boolean;
    cardWidth?: number;
    originalPrice?: number; // Renamed for clarity
    discountName?: number;  // Renamed for clarity
    image?: string;
    totalPrice?: number;
    fullDescription?: string;
    dealName?: string;
    EncryptedProductId: string;
};

export const MostVisitedProductCard = (props: MostVisitedProductCardType) => {
    const defaultWidth = 250;
    const defaultHeight = 350;
    const width = props.cardWidth || defaultWidth;

    const formattedMediaFileName = props.image?.split(', ')[0] || "";
    const mediaUrlPrefix = process.env.NEXT_PUBLIC_MEDIA_URL || '';
    const firstImageUrl = props.image
        ? encodeURI(`${mediaUrlPrefix}${formattedMediaFileName}`)
        : s22Mobile.src;

    return (
        <div
            className="snap-start flex flex-col bg-white border border-[#EFEFEF] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ flex: `1 1 ${width}px`, minWidth: `${width}px`, maxWidth: `${width}px`, height: `${defaultHeight}px` }}
            onClick={() => handleMostVisitedTracking(props.EncryptedProductId)}
        >
            <div className="relative bg-[#F5F5F5] h-[200px] p-3 rounded-t-xl">
                {/* {props?.needTag && props?.dealName && <CardTag text={props.dealName} />} */}
                {props.discountName && props.discountName > 0 && (
                    <div className="text-xs sm:text-base capitalize rounded-r-[5px] absolute top-2 sm:top-4 left-0 text-white bg-red-600 py-1 px-5 font-semibold">
                       {props.discountName}% OFF
                    </div>
                )}
                <img
                    src={firstImageUrl?.toLowerCase()}
                    className="mx-auto h-full object-contain"
                    alt={props.title}
                />
            </div>
            <div className="flex flex-col p-4 gap-2">
                <h3 className="font-semibold text-lg text-gray-800 truncate">{props.title}</h3>
                <div
                    className="text-sm text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: props.fullDescription || '' }}
                />
                <div className="flex flex-col gap-1">
                    {props.totalPrice ? (
                        <p className="text-xl font-semibold text-gray-900">
                            {currencyByCountry(formatPrice(props.totalPrice))}
                        </p>
                    ) : (
                        <p className="text-xl font-semibold text-gray-900">
                            {currencyByCountry(formatPrice(props.price))}
                        </p>
                    )}
                     {props.price !== props.originalPrice && props.originalPrice && props.originalPrice > 0 && (
                        <>
                            <p className="text-base text-gray-400 line-through">
                                {currencyByCountry(formatPrice(props.originalPrice))}
                            </p>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};