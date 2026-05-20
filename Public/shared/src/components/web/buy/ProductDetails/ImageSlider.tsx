import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Breadcrumbs, { breadcrumbState } from "shared/src/components/utils/BreadCrumb/Breadcrumbs";
import { AssignedMediaState } from "shared/src/recoil/AddCheckout";

interface ProductImageSliderProps {
  selectedColor?: string;
  product: any;
}

const ImageSlider: React.FC<ProductImageSliderProps> = ({ product, selectedColor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateValue, setTranslateValue] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const [mounted, setMounted] = useState(false);

  const assignedMedia = useRecoilValue(AssignedMediaState);
  const CdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "";

  const router = useRouter();
  const { query } = router;
  const asPath = router.asPath;
  const parts = asPath.split('?').slice(1);
  const selectedItemCategory = parts[0]?.split('/')[0] || "";
  const selectedSubCategory = parts[1] || "";

  useEffect(() => {
    if (!product) return;

    let newImages: string[] = [];

    // Priority 1: Use ColorImages filtered by selectedColor
    if (selectedColor && product.ColorImages && Array.isArray(product.ColorImages)) {
      const filtered = product.ColorImages
        .filter((item: any) =>
          item.ColorName?.toLowerCase().trim() === selectedColor?.toLowerCase().trim()
        )
        .map((item: any) => {
          const rawPath = item.ImagePath?.startsWith("/")
            ? item.ImagePath.slice(1)
            : item.ImagePath;
          return `${CdnUrl}${rawPath}`;
        });

      if (filtered.length > 0) {
        newImages = filtered;
      }
    }

    // Priority 2: Fallback to FormattedMediaFileName (default images)
    if (newImages.length === 0 && product.FormattedMediaFileName) {
      const paths = typeof product.FormattedMediaFileName === "string"
        ? product.FormattedMediaFileName.split(",").map((s: string) => s.trim())
        : [];

      newImages = paths.map((path: string) => {
        const cleanPath = path.startsWith("/") ? path.slice(1) : path;
        return `${CdnUrl}${cleanPath}`;
      });
    }

    setImages(newImages);
    setCurrentIndex(0);
    setTranslateValue(0);
  }, [selectedColor, product, CdnUrl]);

  // Auto-scroll to assigned media (e.g. condition video thumbnail)
  useEffect(() => {
    if (assignedMedia && images.length > 0) {
      const index = images.findIndex((img) => img.includes(assignedMedia));
      if (index >= 0) {
        setCurrentIndex(index);
        setTranslateValue(-(index * 100));
      }
    }
  }, [images, assignedMedia]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setTranslateValue(-(index * 100));
  };

  if (images.length === 0) {
    return (
      <div className="h-60 lg:h-96 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
        No images available
      </div>
    );
  }

  return (
    <>
      {/* <Breadcrumbs
        category={}
        subcategory={}
      /> */}
      <div className="flex flex-col gap-5">
        {/* Main Slider */}
        <div className="relative overflow-hidden w-full h-60 lg:h-96 bg-[#F3F4F8] rounded-md p-4 flex items-center justify-center">
          <div
            className="flex transition-transform duration-700 ease-out h-full"
            style={{ transform: `translateX(${translateValue}%)`, width: `${images.length * 100}%` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full shrink-0">
                <img
                  src={image.toLowerCase()}
                  alt={`Product - ${selectedColor || "Default"} view ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`
                flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all
                ${currentIndex === index ? "border-red-600 scale-105" : "border-transparent"}
              `}
            >
              <div className="w-20 h-20 lg:w-28 lg:h-28 bg-[#EFEFEF] p-2">
                <img
                  src={image.toLowerCase()}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ImageSlider;