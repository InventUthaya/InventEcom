import { IBannerItem, IBannerResponseData } from "shared/src/models/Banner.Model";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";

const BannerRow = ({ bannerResData }: { bannerResData?: IBannerResponseData }) => {
  if (!bannerResData) return null;

  // Get the first key dynamically (e.g., "Home Banner", "About Us Banner", etc.)
  const firstKey = Object.keys(bannerResData)[0];
  const bannerItems = bannerResData[firstKey] || [];

  // Process and get two active banners
  const banners = bannerItems
    .filter((item) => item.Active && item.IsPublished && item.BannerImagePath)
    .flatMap((item) => {
      return item.BannerImagePath?.split(",").map((path) => {
        const cleanedPath = path
          .trim()
          .replace(/\/+/g, "/")
          .replace(/^\/+|\/+$/g, "");

        return {
          url: encodeURI(`${HelperConstant.imageAPI}/${cleanedPath}`),
          alt: item.ImageAltName || item.DisplayName || `Banner ${item.Id}`,
          title: item.ImageTitleName || item.DisplayName || undefined,
        };
      });
    })
    .slice(0, 2); // Only show first two

  return (
    <div className="flex gap-4 w-full h-[400px] rounded-lg overflow-hidden border border-[#EFEFEF77]">
      {banners.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No banners available
        </div>
      )}
      {banners.map((banner, idx) => (
        <img
          key={idx}
          src={banner?.url}
          alt={banner?.alt}
          title={banner?.title}
          loading="lazy"
          className="w-1/2 h-full object-cover object-center rounded-lg"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ))}
    </div>
  );
};

export default BannerRow;
