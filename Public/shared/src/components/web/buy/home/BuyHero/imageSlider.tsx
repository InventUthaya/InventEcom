import { useState, useEffect } from "react";
import { IBannerItem, IBannerResponseData } from "shared/src/models/Banner.Model";
import Loader from "shared/src/components/utils/Loader/Loader";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import index from "pages/about-us";

const ImageSlider = ({ bannerResData }: { bannerResData?: IBannerResponseData }) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newImages, setNewImages] = useState<
    { BannerImagePath: string; alt: string; title?: string }[]
  >([]);
  // Process HomepageBanner data to extract unique images
  const imageData = (() => {
    const homepageBanners: IBannerItem[] = (() => {
      if (!bannerResData) return [];

      // Get the first key from the object dynamically
      const firstKey = Object.keys(bannerResData)[0]; // e.g., "Home Banner"
      return bannerResData[firstKey] || [];
    })();

    const seenPaths = new Set<string>(); // Track unique image paths
    const uniqueBanners: { BannerImagePath: string; alt: string; title?: string }[] = [];

    homepageBanners.forEach((item: IBannerItem) => {
      // Skip inactive or unpublished banners
      if (!item.IsPublished || !item.Active) return;

      const bannerImagePath = item.BannerImagePath || "";
      // Split and clean image paths, normalize slashes
      const paths = bannerImagePath
        .split(",")
        .map((path) =>
          path
            .trim()
            .replace(/\/+/g, "/") // Replace multiple slashes with single slash
            .replace(/^\/+|\/+$/g, "") // Remove leading/trailing slashes
        )
        .filter((path) => path && path !== "null");

      paths.forEach((path) => {
        // Construct full URL, ensuring no double slashes
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

    return uniqueBanners;
  })();

  const images = imageData;
  useEffect(() => {
    setNewImages([
      {
        BannerImagePath: "assets/images/Home_Banner2.jpg" as any,
        alt: "Local Banner 1",
        title: "Welcome Banner One",
      },
      {
        BannerImagePath: "assets/images/Home_Banner1.jpg",
        alt: "Local Banner 2",
        title: "Special Offer Banner",
      },
    ]);
  }, []);


  // Auto-slide effect
  useEffect(() => {
    if (images.length > 0) {
      setLoading(false); // Data processed, stop loading
      const next = (current + 1) % images.length;
      const id = setTimeout(() => setCurrent(next), 3000);
      return () => clearTimeout(id);
    } else {
      setLoading(false); // No images, stop loading
      setError("No valid banners available");
    }
  }, [current, images]);

  // Handle image load errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, url: string) => {
    console.error(`Failed to load image: ${url}`);
    e.currentTarget.style.display = "none"; // Hide broken image
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-[#EFEFEF77]">
      {/* {loading && <Loader />} */}
      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-lg font-semibold gap-2">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      ) : newImages.length > 0 ? (
        <>
          {/* Pagination Dots */}
          <div className="p-1 z-50 absolute top-2 right-2 lg:right-6 flex gap-[6px]">
            {newImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${current === index ? "bg-[#EA002A]" : "bg-[#FDE5EA]"}`}
              ></div>
            ))}
          </div>
          {/* Current Image */}
          <img
            key={newImages[current].BannerImagePath}
            src={newImages[current].BannerImagePath}
            alt={newImages[current].alt}
            title={newImages[current].title}
            loading="lazy"
            className="absolute object-cover object-center rounded-lg w-full h-full top-0 left-0 transition-opacity duration-1000 ease-in-out opacity-100"
            style={{ height: "100%" }}
            onError={(e) => handleImageError(e, images[current].alt)}
          />
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-lg font-semibold gap-2">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No banners available
        </div>
      )}
    </div>
  );
};

export default ImageSlider;