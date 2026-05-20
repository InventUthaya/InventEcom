import { currencyByCountry, formatPrice } from "shared/src/components/helper/Helper";
import { CardTag } from "./CardTag";
import handleMostVisitedTracking from "shared/src/components/web/buy/home/MostVisitedProducts/HandleAddorUpdateMostVisitedProducts";
import { Store } from "lucide-react";
import { useEffect, useState } from "react";

type ProductCardType = {
  title: string;
  price: number;
  discount: number;
  needTag?: boolean;
  tagName?: string;
  isGrid?: boolean;
  cardswidth?: number;
  OrginalPrice?: any;
  DiscountName?: any;
  Image?: string;
  TotalPrice?: number;
  FullDescription?: string;
  DealName: string;
  EncryptedProductId: string;
  ImageBase64?: string;
  PartnerCompanyName?: string;
};

export const ProductCard = (props: ProductCardType) => {
  const getImageSrc = () => {
    if (props.Image) {
      const CdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "";
      const cleanCdn = CdnUrl.endsWith("/") ? CdnUrl.slice(0, -1) : CdnUrl;
      const cleanPath = props.Image.startsWith("/") ? props.Image : `/${props.Image}`;
      return `${cleanCdn}${cleanPath}`;
    }
  };

  const formattedMediaFileName = props.Image?.split(', ')[0] || "";
  const firstImageUrl = props.Image
    ? `${process.env.NEXT_PUBLIC_CDN_URL}${formattedMediaFileName}`
    : "https://via.placeholder.com/300x300?text=Product";

  const imageSrc = getImageSrc() || firstImageUrl;

  // Price logic
  const mainPrice = props.OrginalPrice ?? props.price;
  const strikethroughPrice = props.OrginalPrice ? props.price : null;

  // Discount calculation based on discount amount (OldPrice - NewPrice)
  const hasDiscountAmount = props.OrginalPrice && props.price > 0 && props.price < props.OrginalPrice;
  const discountAmount = hasDiscountAmount ? props.OrginalPrice - props.price : 0;
  const discountPercentage = hasDiscountAmount && discountAmount > 0
    ? Math.round((discountAmount / props.OrginalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative w-full cursor-pointer"
      onClick={() => handleMostVisitedTracking(props.EncryptedProductId)}
    >
      <div className="overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image Section */}
        <div className="aspect-[3/2] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={imageSrc?.toLowerCase()}
            alt={props.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Deal Tag - Top Left */}
          {props?.needTag && props?.DealName && (
            <div className="absolute top-2 left-2 z-10">
              <CardTag text={props.DealName} />
            </div>
          )}

          {/* Discount % Badge - Top Right */}
          {hasDiscountAmount && discountPercentage > 0 && (
            <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {props.title}
          </h3>

          {/* Description */}
          {props.FullDescription && props.FullDescription !== '<br>' && (
            <p
              className="text-xs text-gray-600 line-clamp-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: props.FullDescription }}
            />
          )}

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-lg font-bold text-gray-900">
              {currencyByCountry(formatPrice(mainPrice))}
            </span>

            {strikethroughPrice && strikethroughPrice > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {currencyByCountry(formatPrice(strikethroughPrice))}
              </span>
            )}
          </div>

          {/* Partner Company Name - At Bottom with Underline */}
          {props?.PartnerCompanyName && (
            <div className="pt-2 mt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 group/partner">
                <Store size={13} className="text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600 truncate border-b border-dashed border-gray-300 pb-0.5 transition-colors">
                  {props.PartnerCompanyName}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};