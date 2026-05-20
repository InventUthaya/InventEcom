import { useEffect, useState, useRef } from "react";
import { DropDownIcon } from "./assets";
import { MenuButton } from "./components/MenuButton";
import Link from "next/link";
import OpacityLoad from "../../animation/opacityLoad";
import { PrimarySell } from "../colors/colors";
import { useRouter } from "next/router";
import CategoryService from "shared/src/services/CategoryService";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { ISellButtonConfig } from "shared/src/models/Address.Model";
import ChooseProduct from "../../web/buy/chooseProduct";
import { useSetRecoilState } from "recoil";
import { breadcrumbState } from "../BreadCrumb/Breadcrumbs";

// Myntra-inspired color palette
const CATEGORY_COLORS = [
  "#FF3F6C", // Myntra Pink
  "#FF905A", // Orange
  "#526CD0", // Blue
  "#03A685", // Green
  "#FFBE00", // Yellow
  "#FF3E6C", // Hot Pink
  "#4CAF50", // Light Green
  "#9C27B0", // Purple
  "#FF6B00", // Deep Orange
  "#00BCD4", // Cyan
];

export default function DesktopSubMenu() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const [menuTop, setMenuTop] = useState(0);

  useEffect(() => {
    const updateMenuPosition = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setMenuTop(rect.bottom);
      }
    };

    updateMenuPosition();
    window.addEventListener('scroll', updateMenuPosition);
    window.addEventListener('resize', updateMenuPosition);

    return () => {
      window.removeEventListener('scroll', updateMenuPosition);
      window.removeEventListener('resize', updateMenuPosition);
    };
  }, []);

  const setBreadcrumb = useSetRecoilState(breadcrumbState);

  return (
    <OpacityLoad load={"animation-delay-300"}>
      <div ref={navRef} className="flex justify-center items-center relative py-2 bg-white shadow-sm lg:px-16 px-5">
        <div className="flex items-center w-full max-w-[1300px] mx-auto">
          <BuySubMenu
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
            menuTop={menuTop}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </div>
      </div>
    </OpacityLoad>
  );
}

const BuySubMenu = ({
  hoveredCategory,
  setHoveredCategory,
  menuTop,
  mobileMenuOpen,
  setMobileMenuOpen
}: {
  hoveredCategory: number | null,
  setHoveredCategory: (id: number | null) => void,
  menuTop: number,
  mobileMenuOpen: boolean,
  setMobileMenuOpen: (open: boolean) => void
}) => {
  const setBreadcrumb = useSetRecoilState(breadcrumbState);
  const [categoryProductsList, setCategoryProductsList] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedItemCategory, setSelectedItemCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<number | null>(null);
  const [expandedMobileSubCategory, setExpandedMobileSubCategory] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  console.log(selectedSubCategory);
  const router = useRouter();

  const getCategoryProductsList = () => {
    CategoryService.getCategoryProductsList()
      .then((res: any) => {
        if (res.status === 200) {
          setCategoryProductsList(res.data);
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCategoryProductsList();
  }, []);

  const handleMouseEnter = (categoryId: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 300);
  };

  const handleItemClick = (subCategoryName: string, itemCategoryName: string, name: string) => {
    router.push(`/buy/itemCategory?${name}/CategoryName?${subCategoryName}`);
    setHoveredCategory(null);
  };

  const getCategoryColor = (index: number) => {
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  };

  return (
    <div className="flex justify-start items-center w-full font-medium">
      <div className="hidden lg:flex items-center gap-6 xl:gap-8">
        {categoryProductsList?.Categories?.map((category: any, index: number) => {
          const categoryColor = getCategoryColor(index);

          return (
            <div
              key={category.CategoryId}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(category.CategoryId)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`relative cursor-pointer py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 ${hoveredCategory === category.CategoryId
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
                  }`}
                onClick={() => {
                  router.push(`/buy/category?${encodeURIComponent(category.CategoryName)}`);
                  setHoveredCategory(null);
                }}
              >
                {category.CategoryName}

                {/* Myntra-style bottom border */}
                <span
                  className="absolute -bottom-0 left-0 right-0 h-1 transition-all duration-300"
                  style={{
                    backgroundColor: hoveredCategory === category.CategoryId ? categoryColor : "transparent",
                  }}
                />
              </div>

              {/* Myntra-style Mega Menu Dropdown */}
              {hoveredCategory === category.CategoryId && category.SubCategories?.length > 0 && (
                <div
                  className="fixed left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
                  style={{
                    top: `${menuTop}px`,
                  }}
                  onMouseEnter={() => handleMouseEnter(category.CategoryId)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Inner container with max-width */}
                  <div className="w-full lg:px-16 px-5 py-2">
                    <div className="max-w-[1300px] mx-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-6">
                        {category.SubCategories.map((subCategory: any) => (
                          <div key={subCategory.SubCategoryId} className="min-w-0">
                            {/* Myntra-style SubCategory Header */}
                            <h3
                              className="text-xs font-bold mb-2 uppercase tracking-wide pb-1"
                              style={{
                                color: categoryColor,
                                borderBottom: `2px solid ${categoryColor}20`
                              }}
                            >
                              {subCategory.SubCategoryName}
                            </h3>

                            {/* Items List - Myntra Style */}
                            {subCategory.ItemsCategories?.length > 0 && (
                              <ul className="space-y-1">
                                {subCategory.ItemsCategories.map((item: any) => (
                                  <li key={item.ItemsCategoryId}>
                                    <div
                                      className="text-xs text-gray-600 hover:text-gray-900 hover:font-medium cursor-pointer transition-all duration-150 py-0.5"
                                      onClick={() =>
                                        handleItemClick(
                                          subCategory.SubCategoryName,
                                          item.ItemsCategoryName,
                                          item.ItemsCategoryName
                                        )
                                      }
                                    >
                                      {item.ItemsCategoryName}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="flex lg:hidden items-center gap-3 w-full justify-between">
        <div
          className="group flex items-center gap-2 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="text-sm font-medium group-hover:text-[#FF3F6C] transition">All Categories</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden overflow-y-auto"
          style={{
            top: `${menuTop}px`,
            maxHeight: `calc(100vh - ${menuTop}px)`
          }}
        >
          <div className="px-4 py-4">
            {categoryProductsList?.Categories?.map((category: any, index: number) => {
              const categoryColor = getCategoryColor(index);
              const isExpanded = expandedMobileCategory === category.CategoryId;

              return (
                <div key={category.CategoryId} className="border-b border-gray-100 last:border-b-0">
                  <div
                    className="flex items-center justify-between py-3 cursor-pointer"
                    onClick={() => setExpandedMobileCategory(isExpanded ? null : category.CategoryId)}
                  >
                    <span
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: isExpanded ? categoryColor : '#374151' }}
                    >
                      {category.CategoryName}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Mobile SubCategories */}
                  {isExpanded && category.SubCategories?.length > 0 && (
                    <div className="pl-4 pb-3 space-y-2">
                      {category.SubCategories.map((subCategory: any) => {
                        const isSubExpanded = expandedMobileSubCategory === subCategory.SubCategoryId;

                        return (
                          <div key={subCategory.SubCategoryId}>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer"
                              onClick={() => setExpandedMobileSubCategory(isSubExpanded ? null : subCategory.SubCategoryId)}
                            >
                              <span
                                className="text-xs font-semibold uppercase"
                                style={{ color: categoryColor }}
                              >
                                {subCategory.SubCategoryName}
                              </span>
                              <svg
                                className={`w-3 h-3 transition-transform duration-200 ${isSubExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>

                            {/* Mobile Items */}
                            {isSubExpanded && subCategory.ItemsCategories?.length > 0 && (
                              <div className="pl-4 space-y-1 pb-2">
                                {subCategory.ItemsCategories.map((item: any) => (
                                  <div
                                    key={item.ItemsCategoryId}
                                    className="text-xs text-gray-600 py-1.5 cursor-pointer hover:text-gray-900"
                                    onClick={() => {
                                      handleItemClick(
                                        subCategory.SubCategoryName,
                                        item.ItemsCategoryName,
                                        item.ItemsCategoryName
                                      );
                                      setMobileMenuOpen(false);
                                    }}
                                  >
                                    {item.ItemsCategoryName}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};