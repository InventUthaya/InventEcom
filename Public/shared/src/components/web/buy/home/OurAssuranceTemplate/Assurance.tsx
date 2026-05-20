import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { OurAssuranceCardTemplate } from "./AssuranceCard";
import CategoryService from "shared/src/services/CategoryService";

const categoryImageMap: Record<string, string> = {
  "BALL BEARINGS": "/assets/Categories/Ball Bearings.jpg",
  "ROLLER BEARINGS": "/assets/Categories/Roller Bearings.jpg",
  "NEEDLE BEARINGS": "/assets/Categories/Needle Bearings.jpg",
  "BEARING UNITS": "/assets/Categories/Bearing Units.jpg",
  "BEARING DISASSEMBLY UNITS": "/assets/Categories/Bearing Disassembly.jpg",
  "TOOLS": "/assets/Categories/Tools.jpg",
  "SUPPORT ROLLERS": "/assets/Categories/Support Rollers.jpg",
};

const OurAssuranceTemplate = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  // Fetch categories dynamically
  const getCategories = async () => {
    try {
      const res = await CategoryService.getCategoryProductsList();
      if (res.status === 200) {
        setCategories(res.data?.Categories || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Navigation function
  const navigateToItemCategory = (name: string) => {
    router.push(`/buy/category?${encodeURIComponent(name)}`);
  };

  // Helper to get dynamic image URL
  const getImageUrl = (category: any) => {
    if (category.ImagePath) {
      const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "";
      const cleanCdn = cdnUrl.endsWith("/") ? cdnUrl.slice(0, -1) : cdnUrl;
      const cleanPath = category.ImagePath.startsWith("/") ? category.ImagePath : `/${category.ImagePath}`;
      return `${cleanCdn}${cleanPath}`;
    }
    if (category.ImageUrl) return category.ImageUrl;

    const nameUpper = category.CategoryName?.toUpperCase() || "";
    return categoryImageMap[nameUpper] || null;
  };

  return (
    <section className="py-8 md:py-8 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2 block">
              BROWSE CATEGORIES
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Industrial Parts You Can Shop
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of precision components sourced from leading global brands
          </p>
        </div>

        {/* Category Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category, index) => {
              const imageUrl = getImageUrl(category);

              return (
                <div
                  key={category.CategoryId}
                  onClick={() => navigateToItemCategory(category.CategoryName)}
                  className="group cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Image Container */}
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={category.CategoryName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                      {/* Animated Border Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 border-2 border-white/30 rounded-3xl animate-pulse"></div>
                      </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="space-y-3">
                        <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          {category.CategoryName}
                        </h3>

                        {/* Shop Now Button - Appears on Hover */}
                        <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                          <span className="text-sm font-semibold">Shop Now</span>
                          <svg
                            className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl" />
                <div className="mt-4 space-y-2">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default OurAssuranceTemplate;