import Link from "next/link";
import { useState, useEffect } from "react";
import { ProductCard } from "../../../../utils/Cards/productCard/productCard";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { IBannerResponseData, IBannerItem } from "shared/src/models/Banner.Model";

interface HalfBannerGridProps {
  reverse?: boolean;
  AppleProducts?: any[];
  bannerResData?: IBannerResponseData;
}

const HalfBannerGrid = ({
  reverse = false,
  AppleProducts = [],
  bannerResData = { HomepageBanner: [] },
}: HalfBannerGridProps) => {
  const productsToShow = AppleProducts.slice(0, 2);

  const imageData = (() => {
    const homepageBanners: IBannerItem[] = (() => {
      if (!bannerResData) return [];
    
      const firstKey = Object.keys(bannerResData)[0]; 
      return bannerResData[firstKey] || [];
    })();

    const seenPaths = new Set<string>();
    const uniqueBanners: { BannerImagePath: string; alt: string; title?: string }[] = [];

    homepageBanners.forEach((item: IBannerItem) => {
      if (!item.IsPublished || !item.Active) return;

      const bannerImagePath = item.BannerImagePath || "";
      const paths = bannerImagePath
        .split(",")
        .map((path) => path.trim())
        .filter((path) => path && path !== "null");

      paths.forEach((path) => {
        const mediaUrlPrefix = `${HelperConstant.imageAPI}/${path}`;
        const fullPath = `${mediaUrlPrefix}`;
        if (!seenPaths.has(fullPath)) {
          seenPaths.add(fullPath);
          uniqueBanners.push({
            BannerImagePath: encodeURI(fullPath),
            alt: item.ImageAltName || item.DisplayName || `Banner ${item.Id}`,
            title: item.ImageTitleName || item.DisplayName || undefined,
          });
        }
      });
    });

    if (uniqueBanners.length === 0) {
      uniqueBanners.push({
        BannerImagePath:  `${HelperConstant.imageAPI}/${bannerResData?.bannerImagePath}`,
        alt: "Default iPhone Deal Banner",
      });
    }

    return uniqueBanners;
  })();

  const images = imageData;

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Auto-slide effect
  useEffect(() => {
    if (images.length > 0) {
      setLoading(false);
      if (images.length > 1) {
        const next = (current + 1) % images.length;
        const id = setTimeout(() => setCurrent(next), 5000);
        return () => clearTimeout(id);
      }
    } else {
      setLoading(false);
      setError("No valid banners available");
    }
  }, [current, images]);

  // Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, url: string) => {
    console.error(`Failed to load image: ${url}`);
    setFailedImages((prev) => new Set(prev).add(url));
  };

  return (
    <> 
    <div className="flex flex-col mt-10 lg:mt-20 gap-4 md:gap-6">
      <h2 className="text-xl md:text-4xl font-semibold text-center">
        Amazing Deals
      </h2>
      <div
        className={`flex flex-col md:flex-${
          reverse ? "row-reverse" : "row"
        } gap-4 md:gap-6 mt-5 md:mt-10`}
      >
        {/* Banner Slider Section */}
        <div className="flex-1 rounded-lg overflow-hidden border border-[#EFEFEF77] relative">
          {/* {loading && <Loader />} */}
          {error ? (
            <div className="w-full h-[350px] flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-lg font-semibold gap-2">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          ) : (
            <>
              {/* Slider Container */}
              <div className="relative w-full h-[350px] overflow-hidden">
                <div
                  className="flex h-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {images.map((img, index) => (
                    <div key={`${img}-${index}`} className="min-w-full h-full">
                        <img
                          src={img.BannerImagePath}
                          alt={img.alt}
                          title={img.title}
                          loading="lazy"
                          className="w-full h-full object-fill object-center rounded-lg"
                          onError={(e) => handleImageError(e, img.alt)}
                        />
                    </div>
                  ))}
                </div>
              </div>
              {/* Pagination Dots */}
              {images.length > 1 && (
                <div className="p-1 z-50 absolute bottom-2 left-0 right-0 flex justify-center gap-[6px]">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrent(index)}
                      className={`w-2 h-2 rounded-full ${
                        current === index ? "bg-white w-4" : "bg-white/50"
                      }`}
                      aria-label={`Go to banner ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              {/* Arrow Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center"
                    onClick={() =>
                      setCurrent((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    aria-label="Previous banner"
                  >
                    ←
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center"
                    onClick={() =>
                      setCurrent((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    aria-label="Next banner"
                  >
                    →
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Products Section */}
        <div className="flex flex-nowrap justify-start items-center gap-3 md:gap-6 w-full md:w-auto overflow-x-auto pl-4 snap-x snap-mandatory">
          {productsToShow.length > 0 ? (
            productsToShow
              .filter((product) => {
                const price =
                  product.CurrentPrice ?? product.BasePrice ?? product.Price ?? 0;
                return price !== 0;
              })
              .map((product) => {
                const price =
                  product.CurrentPrice ?? product.BasePrice ?? product.Price ?? 0;
                const oldPrice =
                  product.BasePrice ?? product.OldPrice ?? product.CurrentPrice ?? price;
                const productId = product.ProductId ?? product.EncryptedId;

                return (
                  <Link href={`/buy/appleDeals/${productId}`} key={productId}>
                    <ProductCard
                      EncryptedProductId={productId}
                      title={product.ProductName || "Apple iPhone"}
                      price={price}
                      discount={product.DiscountPercentage}
                      OrginalPrice={oldPrice}
                      DiscountName={product.DiscountPricePercentage}
                      needTag={true}
                      isGrid={false}
                      Image={product.FormattedMediaFileName}
                      DealName={""}
                    />
                  </Link>
                );
              })
          ) : (
            <div className="text-sm md:text-lg text-[#939393] text-center w-full">
              No matching results for the applied filter
            </div>
          )}
        </div>
      </div>
    </div></>
  );
};

export default HalfBannerGrid;