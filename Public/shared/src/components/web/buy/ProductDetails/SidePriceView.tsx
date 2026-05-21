import { DiscountTag, ShareIcon } from "./assets";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { LoginModalHandler, ShowLoginPage } from "../../../../recoil/userAuth";
import { useRouter } from "next/router";
import ProductService from "shared/src/services/Product.Service";
import { currencyByCountry, formatPrice, getLocalStorage } from "shared/src/components/helper/Helper";
import CartService from "shared/src/services/Cart.Service";
import DofyGeoService from "shared/src/services/DofyGeo.Service";
import { AssignedMediaState } from "shared/src/recoil/AddCheckout";
import { IDOFYGeoModel } from "shared/src/models/DofyGeo.Model";
import { LocationSearch } from "shared/src/components/LocationSearch";
import Image from "next/image";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { ButtonLoader } from "shared/src/components/utils/loading/spinnerLoading";

interface DesktopCartViewProps {
  selectedColor: { Color: string; Id: any };
  selectedProduct: { id: number; price: number; encryptedId: any } | null;
  language: "in_en" | "ae_en" | "ae_ar";
  setSelectedVariantImage?: (variant: any) => void;
  onColorSelect?: (color: string) => void;
}

interface Variant {
  SkuID: number;
  VariantID: number;
  ProductID: number;
  GradeName: string;
  ColorName: string;
  RamSize?: string;
  ImagePath?: string;
  StorageSize?: string;
  MRP: number;
  SellingPrice: number;
  StockQty: number;
  StatusID: number;
  StatusName: string;
}
interface Specifications {
  SpecId: number;
  SpecKey?: string;
  SpecValue?: string;

}
const extractProductData = (apiResponse: any) => {
  if (!apiResponse) return null;
  if (apiResponse.Items && Array.isArray(apiResponse.Items) && apiResponse.Items.length > 0) {
    return apiResponse.Items[0];
  }
  if (Array.isArray(apiResponse) && apiResponse.length > 0) {
    return apiResponse[0];
  }
  if (apiResponse.ProductID !== undefined) {
    return apiResponse;
  }
  return null;
};

export const DesktopCartView: React.FC<DesktopCartViewProps> = ({
  selectedColor,
  selectedProduct,
  language,
  setSelectedVariantImage,
  onColorSelect,
}) => {
  const navigate = useRouter();
  const [error, setError] = useState("");
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string | null>(null);
  const [selectedBWidth, setSelectedBWidth] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [, setOpenLoginWitSelectedProduct] = useRecoilState(LoginModalHandler);
  const [, setShowLogin] = useRecoilState(ShowLoginPage);
  const { productdetailId } = navigate.query;
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
  const [availabilityColor, setAvailabilityColor] = useState<string>("text-neutral-400");
  const [, setAssignedMediaState] = useRecoilState(AssignedMediaState);
  const [query, setQuery] = useState("");
  const [globalData, setGlobalData] = useState<IDOFYGeoModel[]>([]);
  const [enumName, setEnumName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [specifications, setSpecifications] = useState<Specifications[]>([]);
  const isSelectedVariantOutOfStock = !selectedVariant || (selectedVariant.StockQty ?? 0) <= 0;
  const isActionDisabled = !selectedVariant || isSelectedVariantOutOfStock || !selectedSize || !selectedColors || !selectedBWidth;

  const getProductById = () => {
    if (!productdetailId) return;
    setIsLoading(true);
    ProductService.GetProductDetailbyId(productdetailId)
      .then((res: any) => {
        if (res.status === 200 && res.data) {
          const extractedData = extractProductData(res.data);
          if (!extractedData) {
            setError("Invalid product data format");
            return;
          }
          setProductData(extractedData);
          const variantList: Variant[] = extractedData.Variants || [];
          setVariants(variantList);
          setSpecifications(extractedData.Specifications)
          setAssignedMediaState(extractedData.AssignedMedia || null);
          const matchingVariant = variantList.find(
            (v: Variant) =>
              v.ColorName.toLowerCase() === selectedColor?.Color?.toLowerCase() && v.StockQty > 0
          );
          if (matchingVariant) {
            setSelectedVariant(matchingVariant);
          } else if (variantList.length > 0 && variantList[0].StockQty > 0) {
            setSelectedVariant(variantList[0]);
          } else if (variantList.length > 0) {
            setSelectedVariant(variantList[0]);
          }
        } else {
          setError("Failed to load product details");
        }
      })
      .catch((e: any) => {
        console.error("Error fetching product:", e);
        setError("Failed to load product details");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Preserved exact Buy Now functionality from FIRST code (add to cart first, then /buy/checkout)
  const submitOrderHandler = async () => {
    if (
      isBuyNowLoading ||
      !selectedVariant ||
      !productData ||
      isSelectedVariantOutOfStock ||
      !selectedSize ||
      !selectedColors
    )
      return;
    setIsBuyNowLoading(true);
    setError("");
    try {
      const userId = parseInt(getLocalStorage()?.PersonId || "0");
      let success = false;
      let res: any = null;
      if (userId > 0) {
        const payload = {
          userId,
          skuId: [selectedVariant.SkuID],
          quantity: 1,
        };
        res = await CartService.addCartItem(payload);
        success = res.status === 200;
      } else {
        const attributeDescription = `${selectedVariant.GradeName} ${selectedVariant.ColorName} ${selectedVariant.RamSize || ""} ${selectedVariant.StorageSize || ""}`.trim();
        localStorage.setItem(
          "cartItem",
          JSON.stringify({
            EncryptCustomerId: null,
            EncryptProductId: productdetailId?.toString() ?? "",
            storeId: 1,
            quantity: 1,
            shoppingCartTypeId: 1,
            id: 0,
            attributesXml: attributeDescription,
            customerEnteredPrice: selectedVariant.SellingPrice,
          })
        );
        success = true;
      }
      if (success) {
        navigate.push(`/buy/checkout`);
      } else {
        setError("Failed to add to cart. Please try again.");
      }
    } catch (err) {
      console.error("Buy Now error:", err);
      setError("Failed to proceed. Please try again.");
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  // Preserved exact Add to Cart from FIRST code
  const handleAddToCart = async () => {
    if (isAddToCartLoading || !selectedVariant || !productData || isSelectedVariantOutOfStock) return;
    setIsAddToCartLoading(true);
    const userId = parseInt(getLocalStorage()?.PersonId || "0");
    try {
      if (userId > 0) {
        const payload = {
          userId,
          skuId: [selectedVariant.SkuID],
          quantity: 1,
        };
        const res = await CartService.addCartItem(payload);
        if (res.status === 200) {
          navigate.push("/cart");
        }
      } else {
        const attributeDescription = `${selectedVariant.GradeName} ${selectedVariant.ColorName} ${selectedVariant.RamSize || ""} ${selectedVariant.StorageSize || ""}`.trim();
        localStorage.setItem(
          "cartItem",
          JSON.stringify({
            EncryptCustomerId: null,
            EncryptProductId: productdetailId?.toString() ?? "",
            storeId: 1,
            quantity: 1,
            shoppingCartTypeId: 1,
            id: 0,
            attributesXml: attributeDescription,
            customerEnteredPrice: selectedVariant.SellingPrice,
          })
        );
        navigate.push("/cart");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddToCartLoading(false);
    }
  };

  const GetDofyGeoListBysearch = (searchText: string) => {
    const header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
    if (searchText) {
      DofyGeoService.GetDofyGeoListBysearch(" ", searchText, header.CountryCode, header.LanguageCode)
        .then((res: any) => {
          if (res.status === 200) {
            setGlobalData(res.data.Items);
          }
        })
        .catch((e: any) => console.log(e));
    } else {
      setGlobalData([]);
    }
  };

  const getGlobalDataSearch = (searchText: string) => {
    setQuery(searchText);
    if (searchText.length <= 0) {
      setAvailabilityMessage("");
      setAvailabilityColor("text-neutral-400");
    }
  };

  const checkPincodeAvailability = (pincode: string) => {
    if (!pincode) return;
    DofyGeoService.getPincodeAvailability(pincode)
      .then((res: any) => {
        if (res.status === 200 && res.data[0]) {
          const cutoffTime = res.data[0].CutoffTime || "00:00:00";
          const dayCount = res.data[0].dayCount || 1;
          const [hours, minutes] = cutoffTime.split(":").map(Number);
          const cutoffDateTime = new Date();
          cutoffDateTime.setHours(hours, minutes, 0, 0);
          const currentDate = new Date();
          const isBeforeCutoff = currentDate.getTime() < cutoffDateTime.getTime();
          const deliveryDate = new Date();
          deliveryDate.setDate(isBeforeCutoff ? deliveryDate.getDate() : deliveryDate.getDate() + dayCount);
          const formattedDate = deliveryDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          setAvailabilityMessage(
            formattedDate === currentDate.toLocaleDateString("en-US")
              ? " | Delivery by Today"
              : ` | Delivery by ${formattedDate}`
          );
          setAvailabilityColor("text-[#249B3E]");
          const map = ["sameDay", "oneDay", "twoDays", "", "", "express", "", "standard"];
          const daysDiff = Math.ceil((deliveryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          setEnumName(map[daysDiff] || "standard");
        } else {
          setAvailabilityMessage(" | Delivery not available");
          setAvailabilityColor("text-[#FF0000]");
        }
      });
  };

  useEffect(() => {
    getProductById();
  }, [productdetailId]);

  useEffect(() => {
    const savedCityName = localStorage.getItem("CityName");
    if (savedCityName) {
      const cityName = JSON.parse(savedCityName);
      setQuery(cityName);
      GetDofyGeoListBysearch(cityName);
      checkPincodeAvailability(cityName);
    }
  }, []);

  const sizes = Array.from(new Set(variants.map(v => v.RamSize).filter(Boolean)));
  const colors = Array.from(new Set(variants.map(v => v.ColorName)));
  const bWidths = Array.from(new Set(variants.map(v => v.StorageSize).filter(Boolean)));

  const validSizes = selectedColors
    ? Array.from(new Set(variants.filter(v => v.ColorName === selectedColors && v.StockQty > 0).map(v => v.RamSize).filter(Boolean)))
    : sizes;

  const validColors = selectedSize
    ? Array.from(new Set(variants.filter(v => v.RamSize === selectedSize && v.StockQty > 0).map(v => v.ColorName)))
    : colors;
  const isProductOutOfStock = variants.every(v => (v.StockQty ?? 0) <= 0);
  // Improved auto-selection logic from SECOND code
  useEffect(() => {
    if (!variants || variants.length === 0) return;

    if (!selectedColors) {
      const firstColor = variants.find(v => v.StockQty > 0)?.ColorName;
      if (firstColor) {
        setSelectedColors(firstColor);
      }
    }

    if (selectedColors && !selectedSize) {
      const firstSize = variants.find(
        v => v.ColorName === selectedColors && v.StockQty > 0
      )?.RamSize;
      if (firstSize) {
        setSelectedSize(firstSize);
      }
    }

    if (selectedColors && selectedSize && !selectedBWidth) {
      const firstBWidth = variants.find(
        v => v.ColorName === selectedColors && v.RamSize === selectedSize && v.StockQty > 0
      )?.StorageSize;
      if (firstBWidth) setSelectedBWidth(firstBWidth);
    }

    if (selectedColors) {
      const variant = variants.find(v => v.ColorName === selectedColors && v.StockQty > 0);
      setSelectedVariantImage && setSelectedVariantImage(variant?.ImagePath || "");
    }

    if (selectedSize && selectedColors) {
      const variant = variants.find(
        v => v.RamSize === selectedSize && v.ColorName === selectedColors && v.StorageSize === selectedBWidth && v.StockQty > 0
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColors, selectedBWidth, variants, selectedColor]);

  if (isLoading) {
    return (
      <div className="pl-3 pr-1 w-full h-fit sticky top-5 z-10 flex flex-col gap-3">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="bg-[#FFFFFF] p-4 rounded-[10px] flex-1 relative border-[#F2F2F2] border-[1.5px]">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="bg-white p-4 rounded-[10px] border-[1.5px] border-[#F2F2F2] w-32">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-3 pr-1 w-full h-fit sticky top-5 z-10 flex flex-col gap-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
      {productData ? (
        <div>
          <div className="flex justify-between items-center">
            <div className="text-[#050505] font-semibold text-3xl mb-2">
              {productData.ProductName || "Product Name"}
            </div>
            <div className="cursor-pointer">
              <ShareIcon />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-700 text-lg mb-4 font-medium">
              {productData.Description || "Product Description"}
            </div>
            <div className="mb-4">
              {productData.BrandName ? (
                <img
                  src={`/assets/BrandImages/${["Permatex", "Podtrade"].includes(productData.BrandName)
                      ? productData.BrandName
                      : ["ABRO", "BEA", "BECOOL", "BS BEARING", "CONTITECH", "COPELAND", "LOXEAL", "MANEUROP", "MOL", "NIS", "PATRIOT", "PETROPUMP", "POWER STEER", "ROSPOD", "RUBENA", "SAMICK", "SANLUX", "SLZ", "KURSK BEARING COMPANY"].includes(productData.BrandName.toUpperCase())
                        ? `${productData.BrandName.toUpperCase()}.jpg`
                        : productData.BrandName.toUpperCase() === "CZH"
                          ? "CZH.gif"
                          : `${productData.BrandName.toUpperCase()}.png`
                    }`}
                  alt={productData.BrandName}
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.parentElement!.innerHTML = `<span class="px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow">${productData.BrandName}</span>`;
                  }}
                />
              ) : (
                <span className="px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow">
                  {productData.BrandName || "Product BrandName"}
                </span>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-red-500">Failed to load product data</div>
      )}
      {productData && selectedVariant ? (
        <div className="flex justify-between gap-4">
          <div className="bg-[#FFFFFF] p-4 rounded-[10px] flex-1 relative border-[#F2F2F2] border-[1.5px]">
            <div className="self-start text-xs font-extrabold tracking-wider text-red-500">PRICE</div>
            <div className="m-2 flex gap-4 items-center">
              <span className="font-bold text-3xl">
                {currencyByCountry(formatPrice(selectedVariant.SellingPrice + (selectedVariant.SellingPrice * (productData.TaxRate || 0) / 100)))}
              </span>
              {selectedVariant.MRP > selectedVariant.SellingPrice && (
                <span className="text-gray-400 relative px-1 italic text-lg line-through decoration-red-600 decoration-2">
                  {currencyByCountry(formatPrice(selectedVariant.MRP + (selectedVariant.MRP * (productData.TaxRate || 0) / 100)))}
                </span>
              )}
            </div>
            {selectedVariant.MRP > selectedVariant.SellingPrice && (
              <span className="absolute top-[10px] z-50 right-[-6px] italic">
                <DiscountTag
                  discount={Math.round(((selectedVariant.MRP - selectedVariant.SellingPrice) / selectedVariant.MRP) * 100).toString()}
                />
              </span>
            )}
            <span className="text-base text-[#939393] m-1">
              {productData.IsInclusive ? "(Inclusive of all taxes)" : ""}
            </span>
          </div>
          {enumName && (
            <div className="bg-white p-4 text-center rounded-[10px] border-[1.5px] border-[#F2F2F2] flex items-center justify-center">
              <Image
                className="mt-5"
                src={`${HelperConstant.imageAPI}/locationicons/uae/${enumName}.png`}
                alt={enumName}
                width={100}
                height={100}
              />
            </div>
          )}
        </div>
      ) : null}
      {/* Combined Variant Section - Row Layout */}
      <div className="grid grid-cols-3 p-5 bg-white rounded-xl border border-[#F2F2F2] mt-4 divide-x divide-gray-100">
        {/* D INTERNAL */}
        <div className="px-4 first:pl-0">
          <div className="text-xs font-extrabold tracking-wider text-zinc-950 uppercase mb-3">
            D INTERNAL
          </div>
          {isProductOutOfStock ? (
            <div className="text-red-600 font-semibold text-sm">Out of Stock</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => {
                const disabled = !validSizes.includes(size);
                const selected = selectedSize === size;
                return (
                  <div
                    key={size}
                    onClick={() => !disabled && setSelectedSize(size as string)}
                    className={`px-3 py-1.5 rounded-[38px] border text-center text-sm transition-all
                      ${selected ? "border-[#EA002A] bg-[#FFE9ED] text-[#EA002A] font-semibold" : "border-gray-200"}
                      ${disabled ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}
                    `}
                  >
                    {size}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* D EXTERNAL */}
        <div className="px-4">
          <div className="text-xs font-extrabold tracking-wider text-zinc-950 uppercase mb-3">
            D EXTERNAL
          </div>
          {isProductOutOfStock ? (
            <div className="text-red-600 font-semibold text-sm">Out of Stock</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {colors.map(color => {
                const disabled = !validColors.includes(color);
                const selected = selectedColors === color;
                return (
                  <div
                    key={color}
                    onClick={() => {
                      if (!disabled && color) {
                        setSelectedColors(color);
                        onColorSelect?.(color);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-[38px] border text-center text-sm transition-all
                      ${selected ? "border-[#EA002A] bg-[#FFE9ED] text-[#EA002A] font-semibold" : "border-gray-200"}
                      ${disabled ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}
                    `}
                  >
                    {color}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* B WIDTH */}
        <div className="px-4 last:pr-0">
          <div className="text-xs font-extrabold tracking-wider text-zinc-950 uppercase mb-3">
            B WIDTH
          </div>
          {isProductOutOfStock ? (
            <div className="text-red-600 font-semibold text-sm">Out of Stock</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {bWidths.map((bwidth: any) => {
                const selected = selectedBWidth === bwidth;
                return (
                  <div
                    key={bwidth}
                    onClick={() => setSelectedBWidth(bwidth as string)}
                    className={`px-3 py-1.5 rounded-[38px] border text-center text-sm transition-all
                      ${selected ? "border-[#EA002A] bg-[#FFE9ED] text-[#EA002A] font-semibold" : "border-gray-200 cursor-pointer hover:border-gray-400"}
                    `}
                  >
                    {bwidth}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col p-5 bg-white rounded-xl border border-[#F2F2F2] mt-4">
        <div className="text-xs font-extrabold tracking-wider text-zinc-950 uppercase">
          Specifications
        </div>

        <div className="mt-4 border-t border-gray-100">
          <table className="w-full text-sm text-left border-collapse">
            <tbody>
              {specifications.map((spec, index) => (
                <tr
                  key={spec.SpecId}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="py-4 pr-6 font-bold text-gray-950 w-[40%] align-top">
                    {spec.SpecKey}
                  </td>
                  <td className="py-4 text-gray-600 font-medium align-top">
                    {spec.SpecValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col p-5 bg-white rounded-xl border-[#F2F2F2] border-[1.5px]">
        <div className="flex justify-between font-bold text-xs">
          <div className="tracking-wider text-zinc-950 font-extrabold">DELIVERY AVAILABILITY</div>
          <div className="text-[#249B3E] text-right">
            COD Available<span className={`${availabilityColor}`}>{availabilityMessage}</span>
          </div>
        </div>
        <div className="relative mt-3">
          <LocationSearch
            value={query}
            globalData={globalData}
            onChange={getGlobalDataSearch}
            checkPincodeAvailability={checkPincodeAvailability}
          />
        </div>
        <p className="mt-3 text-neutral-500 text-xs">Product will delivery only to available location</p>
      </div>
      <div className="flex gap-4 text-xl font-semibold">
        <button
          onClick={handleAddToCart}
          disabled={isActionDisabled || isAddToCartLoading}
          className={`w-[50%] py-3 rounded-lg border font-semibold
            ${isActionDisabled || isAddToCartLoading
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-white text-[#EA002A] border-[#EA002A] hover:bg-[#FFE9ED] transition"
            }`}
        >
          {isAddToCartLoading ? <ButtonLoader /> : "Add To Cart"}
        </button>
        <button
          onClick={submitOrderHandler}
          disabled={isActionDisabled || isBuyNowLoading}
          className={`w-[50%] py-3 rounded-lg
            ${isActionDisabled || isBuyNowLoading
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-[#EA002A] text-white cursor-pointer"
            }`}
        >
          {isBuyNowLoading ? <ButtonLoader /> : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export const MobileCartView: React.FC<DesktopCartViewProps> = ({
  selectedColor,
  selectedProduct,
  language,
  setSelectedVariantImage,
  onColorSelect,
}) => {
  const navigate = useRouter();
  const [error, setError] = useState("");
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [specifications, setSpecifications] = useState<Specifications[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string | null>(null);
  const [selectedBWidth, setSelectedBWidth] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { productdetailId } = navigate.query;
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
  const [availabilityColor, setAvailabilityColor] = useState<string>("text-neutral-400");
  const [, setAssignedMediaState] = useRecoilState(AssignedMediaState);
  const [query, setQuery] = useState("");
  const [globalData, setGlobalData] = useState<IDOFYGeoModel[]>([]);
  const [enumName, setEnumName] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isSelectedVariantOutOfStock = !selectedVariant || (selectedVariant.StockQty ?? 0) <= 0;
  const isActionDisabled = !selectedVariant || isSelectedVariantOutOfStock || !selectedSize || !selectedColors || !selectedBWidth;

  const getProductById = () => {
    if (!productdetailId) return;
    setIsLoading(true);
    ProductService.GetProductDetailbyId(productdetailId)
      .then((res: any) => {
        if (res.status === 200 && res.data) {
          const extractedData = extractProductData(res.data);
          if (!extractedData) {
            setError("Invalid product data format");
            return;
          }
          console.log("GetProductById", extractedData.Specifications)
          setProductData(extractedData);
          const variantList: Variant[] = extractedData.Variants || [];
          setVariants(variantList);
          setSpecifications(extractedData.Specifications)
          setAssignedMediaState(extractedData.AssignedMedia || null);
          const matchingVariant = variantList.find(
            (v: Variant) =>
              v.ColorName.toLowerCase() === selectedColor?.Color?.toLowerCase() && v.StockQty > 0
          );
          if (matchingVariant) {
            setSelectedVariant(matchingVariant);
          } else if (variantList.length > 0 && variantList[0].StockQty > 0) {
            setSelectedVariant(variantList[0]);
          } else if (variantList.length > 0) {
            setSelectedVariant(variantList[0]);
          }
        } else {
          setError("Failed to load product details");
        }
      })
      .catch((e: any) => {
        console.error("Error fetching product:", e);
        setError("Failed to load product details");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Preserved exact Buy Now functionality from FIRST code (same as desktop)
  const submitOrderHandler = async () => {
    if (isBuyNowLoading || !selectedVariant || !productData || isSelectedVariantOutOfStock || !selectedSize || !selectedColors) return;
    setIsBuyNowLoading(true);
    setError("");
    try {
      const userId = parseInt(getLocalStorage()?.PersonId || "0");
      let success = false;
      let res: any = null;
      if (userId > 0) {
        const payload = {
          userId,
          skuId: [selectedVariant.SkuID],
          quantity: 1,
        };
        res = await CartService.addCartItem(payload);
        success = res.status === 200;
      } else {
        const attributeDescription = `${selectedVariant.GradeName} ${selectedVariant.ColorName} ${selectedVariant.RamSize || ""} ${selectedVariant.StorageSize || ""}`.trim();
        localStorage.setItem(
          "cartItem",
          JSON.stringify({
            EncryptCustomerId: null,
            EncryptProductId: productdetailId?.toString() ?? "",
            storeId: 1,
            quantity: 1,
            shoppingCartTypeId: 1,
            id: 0,
            attributesXml: attributeDescription,
            customerEnteredPrice: selectedVariant.SellingPrice,
          })
        );
        success = true;
      }
      if (success) {
        navigate.push(`/buy/checkout`);
      } else {
        setError("Failed to add to cart. Please try again.");
      }
    } catch (err) {
      console.error("Buy Now error:", err);
      setError("Failed to proceed. Please try again.");
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  // Preserved exact Add to Cart from FIRST code
  const handleAddToCart = async () => {
    if (isAddToCartLoading || !selectedVariant || !productData || isSelectedVariantOutOfStock) return;
    setIsAddToCartLoading(true);
    const userId = parseInt(getLocalStorage()?.PersonId || "0");
    try {
      if (userId > 0) {
        const payload = {
          userId,
          skuId: [selectedVariant.SkuID],
          quantity: 1,
        };
        const res = await CartService.addCartItem(payload);
        if (res.status === 200) {
          navigate.push("/cart");
        }
      } else {
        const attributeDescription = `${selectedVariant.GradeName} ${selectedVariant.ColorName} ${selectedVariant.RamSize || ""} ${selectedVariant.StorageSize || ""}`.trim();
        localStorage.setItem(
          "cartItem",
          JSON.stringify({
            EncryptCustomerId: null,
            EncryptProductId: productdetailId?.toString() ?? "",
            storeId: 1,
            quantity: 1,
            shoppingCartTypeId: 1,
            id: 0,
            attributesXml: attributeDescription,
            customerEnteredPrice: selectedVariant.SellingPrice,
          })
        );
        navigate.push("/cart");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddToCartLoading(false);
    }
  };

  const GetDofyGeoListBysearch = (searchText: string) => {
    const header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
    if (searchText) {
      DofyGeoService.GetDofyGeoListBysearch(" ", searchText, header.CountryCode, header.LanguageCode)
        .then((res: any) => {
          if (res.status === 200) {
            setGlobalData(res.data.Items);
          }
        })
        .catch((e: any) => console.log(e));
    } else {
      setGlobalData([]);
    }
  };

  const getGlobalDataSearch = (searchText: string) => {
    setQuery(searchText);
    if (searchText.length <= 0) {
      setAvailabilityMessage("");
      setAvailabilityColor("text-neutral-400");
    }
  };

  const checkPincodeAvailability = (pincode: string) => {
    if (!pincode) return;
    DofyGeoService.getPincodeAvailability(pincode)
      .then((res: any) => {
        if (res.status === 200 && res.data[0]) {
          const cutoffTime = res.data[0].CutoffTime || "00:00:00";
          const dayCount = res.data[0].dayCount || 1;
          const [hours, minutes] = cutoffTime.split(":").map(Number);
          const cutoffDateTime = new Date();
          cutoffDateTime.setHours(hours, minutes, 0, 0);
          const currentDate = new Date();
          const isBeforeCutoff = currentDate.getTime() < cutoffDateTime.getTime();
          const deliveryDate = new Date();
          deliveryDate.setDate(isBeforeCutoff ? deliveryDate.getDate() : deliveryDate.getDate() + dayCount);
          const formattedDate = deliveryDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          setAvailabilityMessage(
            formattedDate === currentDate.toLocaleDateString("en-US")
              ? " | Delivery by Today"
              : ` | Delivery by ${formattedDate}`
          );
          setAvailabilityColor("text-[#249B3E]");
          const map = ["sameDay", "oneDay", "twoDays", "", "", "express", "", "standard"];
          const daysDiff = Math.ceil((deliveryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          setEnumName(map[daysDiff] || "standard");
        } else {
          setAvailabilityMessage(" | Delivery not available");
          setAvailabilityColor("text-[#FF0000]");
        }
      });
  };

  useEffect(() => {
    getProductById();
  }, [productdetailId]);

  useEffect(() => {
    const savedCityName = localStorage.getItem("CityName");
    if (savedCityName) {
      const cityName = JSON.parse(savedCityName);
      setQuery(cityName);
      GetDofyGeoListBysearch(cityName);
      checkPincodeAvailability(cityName);
    }
  }, []);

  const sizes = Array.from(new Set(variants.map(v => v.RamSize).filter(Boolean)));
  const colors = Array.from(new Set(variants.map(v => v.ColorName)));
  const bWidths = Array.from(new Set(variants.map(v => v.StorageSize).filter(Boolean)));

  const validSizes = selectedColors
    ? Array.from(new Set(variants.filter(v => v.ColorName === selectedColors && v.StockQty > 0).map(v => v.RamSize).filter(Boolean)))
    : sizes;

  const validColors = selectedSize
    ? Array.from(new Set(variants.filter(v => v.RamSize === selectedSize && v.StockQty > 0).map(v => v.ColorName)))
    : colors;
  const isProductOutOfStock = variants.every(v => (v.StockQty ?? 0) <= 0);
  // Improved auto-selection logic from SECOND code
  useEffect(() => {
    if (!variants || variants.length === 0) return;

    if (!selectedColors) {
      const firstColor = variants.find(v => v.StockQty > 0)?.ColorName;
      if (firstColor) {
        setSelectedColors(firstColor);
      }
    }

    if (selectedColors && !selectedSize) {
      const firstSize = variants.find(
        v => v.ColorName === selectedColors && v.StockQty > 0
      )?.RamSize;
      if (firstSize) {
        setSelectedSize(firstSize);
      }
    }

    if (selectedColors && selectedSize && !selectedBWidth) {
      const firstBWidth = variants.find(
        v => v.ColorName === selectedColors && v.RamSize === selectedSize && v.StockQty > 0
      )?.StorageSize;
      if (firstBWidth) setSelectedBWidth(firstBWidth);
    }

    if (selectedSize && selectedColors) {
      const variant = variants.find(
        v => v.RamSize === selectedSize && v.ColorName === selectedColors && v.StorageSize === selectedBWidth && v.StockQty > 0
      );
      setSelectedVariant(variant || null);
    }
  }, [variants, selectedColors, selectedSize, selectedBWidth]);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-3">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="bg-[#FFFFFF] p-4 rounded-[10px] flex-1 relative border-[#F2F2F2] border-[1.5px]">
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="bg-white p-4 rounded-[10px] border-[1.5px] border-[#F2F2F2] w-24">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
      {productData ? (
        <div>
          <div className="flex justify-between items-center">
            <div className="text-[#050505] font-semibold text-xl mb-2">{productData.ProductName || "Product Name"}</div>
            <div className="cursor-pointer">
              <ShareIcon />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-[#252525] text-base font-medium">{productData.Description || "Product Description"}</div>
            {productData.BrandName && (
              <div className="ml-4 shrink-0">
                <img
                  src={`/assets/BrandImages/${["Permatex", "Podtrade"].includes(productData.BrandName)
                      ? productData.BrandName
                      : ["ABRO", "BEA", "BECOOL", "BS BEARING", "CONTITECH", "COPELAND", "LOXEAL", "MANEUROP", "MOL", "NIS", "PATRIOT", "PETROPUMP", "POWER STEER", "ROSPOD", "RUBENA", "SAMICK", "SANLUX", "SLZ", "KURSK BEARING COMPANY"].includes(productData.BrandName.toUpperCase())
                        ? `${productData.BrandName.toUpperCase()}.jpg`
                        : productData.BrandName.toUpperCase() === "CZH"
                          ? "CZH.gif"
                          : `${productData.BrandName.toUpperCase()}.png`
                    }`}
                  alt={productData.BrandName}
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.parentElement!.innerHTML = `<span class="px-2 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow">${productData.BrandName}</span>`;
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-red-500 text-sm">Failed to load product data</div>
      )}
      {productData && selectedVariant ? (
        <div className="flex justify-between gap-4">
          <div className="bg-[#FFFFFF] p-4 rounded-[10px] flex-1 relative border-[#F2F2F2] border-[1.5px]">
            <div className="self-start text-xs font-extrabold tracking-wider text-red-500">PRICE</div>
            <div className="m-2 flex gap-4 items-center">
              <span className="font-bold text-2xl">
                {currencyByCountry(formatPrice(selectedVariant.SellingPrice + (selectedVariant.SellingPrice * (productData.TaxRate || 0) / 100)))}
              </span>
              {selectedVariant.MRP > selectedVariant.SellingPrice && (
                <span className="text-gray-400 relative px-1 italic text-base line-through decoration-red-600 decoration-2">
                  {currencyByCountry(formatPrice(selectedVariant.MRP + (selectedVariant.MRP * (productData.TaxRate || 0) / 100)))}
                </span>
              )}
            </div>
            {selectedVariant.MRP > selectedVariant.SellingPrice && (
              <span className="absolute top-[10px] right-[-6px] italic">
                <DiscountTag
                  discount={Math.round(((selectedVariant.MRP - selectedVariant.SellingPrice) / selectedVariant.MRP) * 100).toString()}
                />
              </span>
            )}
            <span className="text-xs text-[#939393] m-1">
              {productData.IsInclusive ? " (Inclusive of all taxes)" : ""}
            </span>
          </div>
          {enumName && (
            <div className="bg-white p-4 text-center rounded-[10px] border-[1.5px] border-[#F2F2F2] flex items-center justify-center">
              <Image
                className="mt-3"
                src={`${HelperConstant.imageAPI}/locationicons/uae/${enumName}.png`}
                alt={enumName}
                width={80}
                height={80}
              />
            </div>
          )}
        </div>
      ) : null}
      {/* Combined Variant Section - Row Layout */}
      <div className="grid grid-cols-3 p-5 bg-white rounded-xl border border-[#F2F2F2] mt-4 divide-x divide-gray-100">
        {/* D INTERNAL */}
        <div className="px-4 first:pl-0">
          <div className="text-[10px] font-extrabold tracking-wider text-zinc-950 uppercase mb-2">
            D INTERNAL
          </div>
          {isProductOutOfStock ? (
            <div className="text-red-600 font-semibold text-[10px]">Out of Stock</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => {
                const disabled = !validSizes.includes(size);
                const selected = selectedSize === size;
                return (
                  <div
                    key={size}
                    onClick={() => !disabled && setSelectedSize(size as string)}
                    className={`px-2.5 py-1 rounded-[38px] border text-center text-xs transition-all
                      ${selected ? "border-[#EA002A] bg-[#FFE9ED] text-[#EA002A] font-semibold" : "border-gray-200"}
                      ${disabled ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    {size}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* D EXTERNAL */}
        <div className="px-4">
          <div className="text-[10px] font-extrabold tracking-wider text-zinc-950 uppercase mb-2">
            D EXTERNAL
          </div>
          {isProductOutOfStock ? (
            <div className="text-red-600 font-semibold text-[10px]">Out of Stock</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {colors.map(color => {
                const disabled = !validColors.includes(color);
                const selected = selectedColors === color;
                return (
                  <div
                    key={color}
                    onClick={() => {
                      if (!disabled && color) {
                        setSelectedColors(color);
                        onColorSelect?.(color);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-[38px] border text-center text-xs transition-all
                      ${selected ? "border-[#EA002A] bg-[#FFE9ED] text-[#EA002A] font-semibold" : "border-gray-200"}
                      ${disabled ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    {color}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* B WIDTH */}
        <div className="px-4 last:pr-0">
          <div className="text-[10px] font-extrabold tracking-wider text-zinc-950 uppercase mb-2">
            B WIDTH
          </div>
          {isProductOutOfStock ? (
            <div className="text-red-600 font-semibold text-[10px]">Out of Stock</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {bWidths.map((bwidth: any) => {
                const selected = selectedBWidth === bwidth;
                return (
                  <div
                    key={bwidth}
                    onClick={() => setSelectedBWidth(bwidth as string)}
                    className={`px-2.5 py-1 rounded-[38px] border text-center text-xs transition-all
                      ${selected ? "border-[#EA002A] bg-[#FFE9ED] text-[#EA002A] font-semibold" : "border-gray-200 cursor-pointer hover:border-gray-400"}
                    `}
                  >
                    {bwidth}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col p-5 bg-white rounded-xl border border-[#F2F2F2] mt-4">
        <div className="text-xs font-extrabold tracking-wider text-zinc-950">
          Specifications
        </div>
        <div className="mt-4 border-t border-gray-100">
          <table className="w-full text-sm text-left border-collapse">
            <tbody>
              {specifications.map((spec, index) => (
                <tr
                  key={spec.SpecId}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="py-4 pr-4 font-bold text-gray-950 w-[40%] align-top">
                    {spec.SpecKey}
                  </td>
                  <td className="py-4 text-gray-600 font-medium align-top">
                    {spec.SpecValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col p-4 bg-white rounded-xl border-[#F2F2F2] border-[1.5px]">
        <div className="flex justify-between font-bold text-xs">
          <div className="tracking-wider text-zinc-950 font-extrabold">DELIVERY AVAILABILITY</div>
          <div className="text-[#249B3E] text-right">
            COD Available<span className={`${availabilityColor}`}>{availabilityMessage}</span>
          </div>
        </div>
        <div className="relative mt-3">
          <LocationSearch
            value={query}
            globalData={globalData}
            onChange={getGlobalDataSearch}
            checkPincodeAvailability={checkPincodeAvailability}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={isActionDisabled || isAddToCartLoading}
          className={`w-full py-3 rounded-md border text-base font-semibold ${isActionDisabled || isAddToCartLoading ? "bg-gray-300 text-white cursor-not-allowed" : "bg-white text-[#EA002A] border-[#EA002A]"}`}
        >
          {isAddToCartLoading ? <ButtonLoader /> : "Add To Cart"}
        </button>
        <button
          onClick={submitOrderHandler}
          disabled={isActionDisabled || isBuyNowLoading}
          className={`w-full py-3 rounded-md text-base font-semibold ${isActionDisabled || isBuyNowLoading ? "bg-gray-300 text-white cursor-not-allowed" : "bg-[#EA002A] text-white"}`}
        >
          {isBuyNowLoading ? <ButtonLoader /> : "Buy Now"}
        </button>
      </div>
    </div>
  );
};