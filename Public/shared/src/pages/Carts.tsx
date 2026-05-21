import { useEffect, useState } from "react";
import Container from "../components/animation/Container";
import {
  currencyByCountry,
  Direction,
  formatPrice,
  getLocalStorage,
  getProductIdwithoutLogin,
  getUserLanguage,
  removeBracketValues,
  SSRDetection,
} from "../components/helper/Helper";
import { MobileMenuSell } from "../components/utils/Menus/MobileSubMenu";
import Menu from "../components/utils/Menus/TopMenu";
import { PromoCodeComponent } from "../components/web/buy/checkout/ProductPricingDetails";
import CartService from "../services/Cart.Service";
import { DeleteIcon } from "../components/web/buy/checkout/assets";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { IProductModel } from "../models/Product.Model";
import {
  LoginWithSelectedProduct,
  LoginModalHandler,
  ShowLoginPage,
} from "../recoil/userAuth";
import ProductService from "../services/Product.Service";
import { Reloader } from "../recoil/Reloader";
import { MenuContentZindex } from "../recoil/styleState";
import { ISEOModel } from "../models/SEO.Model";
import MetaTags from "../components/utils/metatags/MetaTags";
import { HelperConstant } from "../components/helper/HelperConstant";
import Loader from "../components/utils/Loader/Loader";
import Link from "next/link";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";
import { ICartModel } from "../models/Cart.Model";
import { Store } from "lucide-react";
import Breadcrumbs from "../components/utils/BreadCrumb/Breadcrumbs";

interface ICartItemModel {
  ImagesPath?: string;
  CartId: number;
  UserId: number;
  SkuId: number;
  CartQuantity: number;
  ProductId: number;
  ProductName: string;
  Description: string;
  CategoryName: string;
  BrandName: string;
  VariantId: number;
  GradeName: string;
  ColorName: string;
  RamSize: string;
  StorageSize: string | null;
  MRP: number;
  SellingPrice: number;
  StockQty: number;
  StatusId: number;
  StatusName: string;
  TotalPrice: number;
  TotalMRP: number;
  StockStatus: string;
  Created: string | null;
  EncryptedShoppingCartId: string;
  EncryptProductId: string;
  Id: number;
  CreatedBy: string | null;
  IsActive: boolean;
  Modified: string | null;
  ModifiedBy: string | null;
  IsValid: boolean;
  PartnerCompanyName?: string;
  ValidationErrors: {
    Items: any[];
  };
  FormattedMediaFileName?: string;
  ImageBase64?: string;
  base64Images?: string;
  ImagePath?: string;
  TaxRate?: number;
  IsInclusive?: boolean;
  TaxAmount?: number;
}

interface ICartResponseModel {
  RecordsCount: number;
  PageNumber: number;
  PageSize: number;
  Count: number;
  PageCount: number;
  IsFirstPage: boolean;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
  IsLastPage: boolean;
  Items: ICartItemModel[];
}

type CartProps = {
  cartList: ICartItemModel[];
  direction: string;
  language: "in_en" | "ae_en" | "ae_ar";
  isSSR?: boolean;
  cart: ICartModel;
  metaTags?: ISEOModel;
};

const fetchData = async (context: any): Promise<CartProps> => {
  const customerId = getLocalStorage()?.PersonId as any;
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  let cartlistRes = await CartService.getAllCart(customerId);
  let cartList = (cartlistRes.status === 200 && cartlistRes.data.Items) || [];
  let cart = (cartlistRes.status === 200 && cartlistRes.data) || {};
  let metaTags = getStaticMeta(HelperConstant.metaPages.Cart);

  return { cart, cartList, direction, language, metaTags };
};

function Cart({ cart, cartList, direction, language, isSSR, metaTags }: CartProps) {
  const [isClient, setIsClient] = useState(false);
  const [shoppingCartList, setShoppingCartList] = useState<CartProps>({
    cart,
    cartList: [],
    direction,
    language,
    metaTags,
  });
  const [promoCodeMessage, setPromoCodeMessage] = useState("");
  const [isPromoCode, setIsPromoCode] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [discountId, setDiscountId] = useState<string>("");
  const [product, setProduct] = useState<IProductModel[]>([]);
  const [isLoginViaEvalution, setIsLoginViaEvalution] = useRecoilState(LoginWithSelectedProduct);
  const [, setOpenLoginWitSelectedProduct] = useRecoilState(LoginModalHandler);
  const [showLogin, setShowLogin] = useRecoilState(ShowLoginPage);
  const reload = useRecoilValueLoadable(Reloader);
  const menuContentZindex = useRecoilValue(MenuContentZindex);
  const navigate = useRouter();
  const PersonId = getLocalStorage()?.PersonId as any;
  const productId = getProductIdwithoutLogin() as string;

  const handlePromoDiscount = (
    discountAmount: number | null,
    discountId: any | null,
    discountMessage: any,
    promoCodeValue?: string
  ) => {
    setPromoDiscount(discountAmount);
    setDiscountId(discountId || "");
    setPromoCode(promoCodeValue || "");
    setPromoCodeMessage(discountMessage);
  };

  let taxTotal = 0;
  let hasExclusiveTax = false;

  const totalCartPrice = shoppingCartList.cartList.reduce((total, item) => {
    const basePrice = item.TotalPrice || 0;
    const tax = item.TaxAmount || (basePrice * (item.TaxRate || 0) / 100);
    
    if (item.IsInclusive === false) {
      hasExclusiveTax = true;
      taxTotal += tax;
      return total + basePrice;
    } else {
      return total + basePrice + tax;
    }
  }, 0);

  const totalCartMRP = shoppingCartList.cartList.reduce((total, item) => {
    const baseMRP = item.TotalMRP || (item.MRP || item.TotalPrice || 0) * (item.CartQuantity || 1);
    const tax = item.TaxRate ? baseMRP * (item.TaxRate / 100) : 0;
    
    if (item.IsInclusive === false) {
      return total + baseMRP;
    } else {
      return total + baseMRP + tax;
    }
  }, 0);

  const totalDiscount = totalCartMRP - totalCartPrice;

  const finalAmount = (promoDiscount ? totalCartPrice - promoDiscount : totalCartPrice) + taxTotal;

  const proceedWithOrder = () => {
    if (!PersonId) {
      // Guest user — force login
      setShowLogin(true);
      setIsLoginViaEvalution(true);
      localStorage.setItem("redirectTocart", "true");
      setOpenLoginWitSelectedProduct({
        handler: "login",
        isOpen: true,
      });
      return;
    }

    if (shoppingCartList.cartList.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Collect all unique ENCRYPTED cart IDs
    const encryptedCartIds = Array.from(
      new Set(
        shoppingCartList.cartList
          .map((item) => item.EncryptedShoppingCartId)
          .filter((id): id is string => !!id)
      )
    );

    if (encryptedCartIds.length === 0) {
      alert("Unable to retrieve cart information. Please try again.");
      return;
    }

    // Join with comma for multiple carts
    const encryptedCartIdsParam = encryptedCartIds.join(",");

    // Navigate with ENCRYPTED cartId(s)
    navigate.push(`/buy/checkout`);
  };

  const handleCheckout = () => {
    proceedWithOrder();
  };

  const handlcheckoutwithoutlogin = () => {
    setShowLogin(true);
    setIsLoginViaEvalution(true);
    localStorage.setItem("redirectTocart", "true");
    setOpenLoginWitSelectedProduct({
      handler: "login",
      isOpen: true,
    });
  };

  const handlcontinuewithoutlogin = () => {
    navigate.push("/");
  };

  const getProductwithoutlogin = () => {
    ProductService.GetProductbyId(productId).then((res: any) => {
      if (res.status === 200) {
        setProduct(res.data.Items || []);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (!PersonId && productId) {
      setLoading(true);
      getProductwithoutlogin();
    }
  }, [productId, PersonId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setLoading(true);

    fetchData("").then((res) => {
      setShoppingCartList({
        cart: res.cart || {},
        cartList: res.cartList || [],
        direction: res.direction,
        language: res.language,
        metaTags: res.metaTags,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [reload, refresh]);

  return (
    <>
      <MetaTags metaTags={shoppingCartList.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={language} />
      <Menu needSearch={false} />
      <MobileMenuSell ActiveId={0} zIndex={menuContentZindex.Z_Index} />

      <div className="lg:px-16 px-0">
        <div className="mt-2">
          <Breadcrumbs
            category={"Add To Cart"}
            subcategory={""} />
        </div>
        <div className="max-w-[1300px] mx-auto pb-10">
          {isClient ? (
            <Container>
              <div className="flex flex-col lg:flex-row gap-5 mt-5">
                {PersonId ? (
                  <div
                    className={`bg-white flex flex-col w-full ${shoppingCartList.cartList.length > 0 ? "lg:w-1/2" : "w-full"
                      } lg:border border-[#EFEFEF] lg:rounded-xl lg:overflow-hidden`}
                  >
                    <h1 className="text-sm tracking-[2px] py-5 flex gap-1 font-semibold capitalize px-5 pb-4 lg:px-8">
                      <span>CART</span>
                      <span className="text-[#EA002A] font-semibold">({shoppingCartList.cartList?.length})</span>
                    </h1>
                    <div className="lg:overflow-auto px-5">
                      {shoppingCartList.cartList.length > 0 ? (
                        shoppingCartList.cartList.map((item, index) => {
                          const discountPercentage =
                            item.MRP > 0
                              ? Math.round(
                                ((item.MRP - (item.SellingPrice || item.TotalPrice / (item.CartQuantity || 1))) /
                                  item.MRP) *
                                100
                              )
                              : 0;

                          return (
                            <ProductDetailCartCard
                              key={index}
                              productName={item.ProductName}
                              shortDescription={item.Description}
                              price={(item.SellingPrice || item.TotalPrice / (item.CartQuantity || 1)) + ((item.SellingPrice || item.TotalPrice / (item.CartQuantity || 1)) * (item.TaxRate || 0) / 100)}
                              oldPrice={(item.MRP || (item.TotalMRP || 0) / (item.CartQuantity || 1)) + ((item.MRP || (item.TotalMRP || 0) / (item.CartQuantity || 1)) * (item.TaxRate || 0) / 100)}
                              cartId={item.CartId}
                              encryptedCartId={item.EncryptedShoppingCartId}
                              setRefresh={setRefresh}
                              DiscountName={discountPercentage}
                              personId={PersonId}
                              encryptProductId={item.EncryptProductId}
                              quantity={item.CartQuantity || 1}
                              brandName={item.BrandName}
                              ImagePath={item.ImagePath}
                              categoryName={item.CategoryName}
                              PartnerCompanyName={item.PartnerCompanyName}
                            />
                          );
                        })
                      ) : (
                        <>
                          <p className="text-center mt-5">No items in the cart.</p>
                          <div className="flex flex-col items-center mt-5">
                            <button
                              className="px-10 py-2 text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize text-lg font-semibold mt-5"
                              onClick={handlcontinuewithoutlogin}
                            >
                              Continue to Shopping
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white flex flex-col w-full border-y lg:border border-[#EFEFEF] lg:rounded-xl lg:overflow-hidden">
                    <h1 className="text-sm tracking-[2px] py-5 flex gap-1 font-semibold capitalize px-5 pb-4 lg:px-8">
                      <span>CART</span>
                      <span className="text-[#EA002A] font-semibold">({product.length})</span>
                    </h1>
                    <div className="lg:h-auto lg:overflow-auto px-5">
                      {product.length > 0 ? (
                        product.map((item) => (
                          <ProductDetailCartCard
                            key={item.Id}
                            productName={item.Name || item.ProductName}
                            shortDescription={removeBracketValues(item.AttributesXml) || ""}
                            price={
                              (() => {
                                const localItem = JSON.parse(localStorage.getItem("cartItem") || "{}");
                                return localItem.productId === item.EncryptedId
                                  ? parseFloat(localItem.customerEnteredPrice)
                                  : item.Price;
                              })()
                            }
                            oldPrice={item.OldPrice || item.TotalPrice}
                            cartId={item.Id}
                            encryptedCartId={item.EncryptedId}
                            setRefresh={setRefresh}
                            DiscountName={item.DiscountName}
                            encryptProductId={item.EncryptedId}
                            ImagePath={item.ImagePath}
                          />
                        ))
                      ) : (
                        <p className="text-center my-5">No items in the cart.</p>
                      )}
                    </div>
                    <div className="hidden lg:flex lg:p-4 lg:justify-center lg:items-center bg-white shadow-[0px_-30px_40px_#fff] relative">
                      <button
                        className="shrink-0 h-fit px-10 py-2 text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize text-lg font-semibold me-5"
                        onClick={handlcontinuewithoutlogin}
                      >
                        Continue to Shopping
                      </button>
                      {product.length > 0 && (
                        <button
                          className="shrink-0 h-fit px-10 py-2 text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize text-lg font-semibold"
                          onClick={handlcheckoutwithoutlogin}
                        >
                          Proceed to buy
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {shoppingCartList.cartList.length > 0 && PersonId && (
                  <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="p-4 lg:px-8 bg-white h-fit w-full border-y lg:border border-[#EFEFEF] lg:rounded-xl lg:overflow-hidden">
                      <h2 className="text-[#EA002A] text-sm lg:text-base uppercase font-semibold tracking-[2px]">
                        Price details
                      </h2>
                      <div className="flex flex-col gap-4 mt-4">
                        <div className="flex justify-between text-[#252525] font-light capitalize">
                          <span className="font-semibold text-sm lg:text-base">
                            Price ({shoppingCartList.cartList.length} {shoppingCartList.cartList.length === 1 ? "Item" : "Items"})
                          </span>
                          <span className="font-bold text-sm lg:text-base">
                            {currencyByCountry(formatPrice(totalCartPrice))}
                          </span>
                        </div>
                        {hasExclusiveTax && (
                          <div className="flex justify-between text-[#252525] font-light capitalize">
                            <span className="font-semibold text-sm lg:text-base">Tax (Excl.)</span>
                            <span className="font-bold text-sm lg:text-base">
                              + {currencyByCountry(formatPrice(taxTotal))}
                            </span>
                          </div>
                        )}
                        {/* <div className="flex justify-between text-[#252525] font-light capitalize">
                        <span className="font-semibold text-sm lg:text-base">Promo code</span>
                        {isPromoCode && (
                          <PromoCodeComponent onApplyDiscount={handlePromoDiscount} totalCartPrice={totalCartPrice} />
                        )}
                      </div> */}
                        {/* {promoCodeMessage && (
                        <div className="text-xs 2xl:text-sm text-end font-semibold text-[#EA002A]">
                          {promoCodeMessage}
                        </div>
                      )} */}
                        <div className="pb-5 lg:p-0">
                          <div className="border-y-2 flex justify-between py-4 mt-4 capitalize">
                            <span className="font-semibold text-base lg:text-xl">Total payable amount</span>
                            <span className="font-semibold text-base lg:text-xl">
                              {currencyByCountry(formatPrice(finalAmount ?? 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 lg:flex justify-center hidden">
                        <button
                          className="px-10 py-2 text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize text-lg font-semibold"
                          onClick={handleCheckout}
                        >
                          Proceed to Buy
                        </button>
                      </div>
                      <div className="block lg:hidden w-full bg-white">
                        <div className="flex justify-between gap-5 px-3">
                          <div className="flex flex-col">
                            <span className="text-sm italic text-[#31313188] font-semibold relative after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-[112%] after:bg-[#EA002A]">
                              {currencyByCountry(formatPrice(totalCartMRP))}
                            </span>
                            <span className="text-lg font-bold">{currencyByCountry(formatPrice(totalCartPrice))}</span>
                          </div>
                          <button
                            className="px-3 flex-1 text-sm py-1 text-center bg-[#EA002A] border-0 outline-0 text-white rounded-md capitalize font-semibold"
                            onClick={handleCheckout}
                          >
                            Proceed to Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Container>
          ) : (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;

// ProductDetailCartCard with proper typing
interface ProductDetailCardProps {
  productName: string;
  shortDescription: string;
  price: number;
  oldPrice: number;
  cartId: number;
  encryptedCartId: string;
  DiscountName: any;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  personId?: any;
  encryptProductId?: string;
  quantity?: number;
  brandName?: string;
  categoryName?: string;
  ImagePath?: string;
  PartnerCompanyName?: string;
}

export const ProductDetailCartCard = ({
  cartId,
  encryptedCartId,
  productName,
  shortDescription,
  price,
  oldPrice,
  setRefresh,
  DiscountName,
  personId,
  encryptProductId,
  quantity = 1,
  brandName,
  categoryName,
  ImagePath,
  PartnerCompanyName
}: ProductDetailCardProps) => {
  const [delet, setDelete] = useState<boolean>(false);
  const navigate = useRouter();
  const CdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "";

  const imageUrl = ImagePath ? `${CdnUrl}${ImagePath}` : "/placeholder.jpg";

  const handleDelete = () => {
    if (personId) {
      CartService.deleteCartItem(encryptedCartId).then((res: any) => {
        if (res.status === 200) {
          setDelete(false);
          setRefresh((prev) => !prev);
          window.location.reload();
        }
      });
    } else {
      const storedProductIds = localStorage.getItem("ProductId");
      if (storedProductIds) {
        const productIdsArray = storedProductIds.split(",").map((id) => id.trim());
        const updatedProductIds = productIdsArray.filter((productId) => productId !== encryptedCartId);
        if (updatedProductIds.length > 0) {
          localStorage.setItem("ProductId", updatedProductIds.join(","));
        } else {
          localStorage.removeItem("ProductId");
        }
        window.location.reload();
      }
      localStorage.removeItem("cartItem");
      setRefresh((prev) => !prev);
    }
  };

  const itemTotalPrice = price * quantity;
  const itemTotalMRP = oldPrice * quantity;

  return (
    <><div className="flex justify-start items-start gap-3 lg:gap-6 py-4 border-b lg:border-b-2">
      <div className="w-32 lg:w-40 h-24 lg:h-32 bg-[#efefef] p-2 lg:p-3 rounded-lg">
        <img src={imageUrl.toLowerCase()} alt={productName} className="w-full h-full object-contain" />
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex justify-between items-start">
          <Link href={`/buy/appleDeals/${encryptProductId}`}>
            <div className="font-semibold text-base lg:text-xl cursor-pointer">{productName}</div>
          </Link>
          <div className="cursor-pointer" onClick={handleDelete}>
            <DeleteIcon />
          </div>
        </div>

        {(brandName || categoryName) && (
          <div className="flex gap-2 text-xs text-gray-600">
            {brandName && <span>Brand: {brandName}</span>}
            {categoryName && <span>Category: {categoryName}</span>}
          </div>
        )}

        <p className="text-[#252525] text-xs lg:text-sm font-medium">{shortDescription}</p>

        {quantity > 1 && <p className="text-xs text-gray-600 mt-1">Quantity: {quantity}</p>}

        <div className="mt-1 lg:mt-2 flex flex-col gap-1 lg:gap-2">
          {DiscountName !== null && DiscountName > 0 && (
            <p className="text-[#EA002A] text-xs lg:text-sm font-bold">{DiscountName}% Offer applied</p>
          )}

          <div className="flex gap-2 lg:gap-4 items-center justify-start">
            <span className="text-base lg:text-lg font-bold">
              {currencyByCountry(formatPrice(itemTotalPrice))}
              {quantity > 1 && (
                <span className="text-xs text-gray-500 ml-1">
                  ({currencyByCountry(formatPrice(price))} × {quantity})
                </span>
              )}
            </span>

            {price !== oldPrice && oldPrice !== 0 && (
              <span className="text-sm lg:text-base italic text-[#31313188] font-semibold relative after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-[112%] after:bg-[#EA002A]">
                {currencyByCountry(formatPrice(itemTotalMRP))}
                {quantity > 1 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({currencyByCountry(formatPrice(oldPrice))} × {quantity})
                  </span>
                )}
              </span>
            )}
          </div>
          {PartnerCompanyName && (
            <div className="mt-auto py-2 flex items-center gap-2 border-t border-[#EFEFEF]">
              <Store size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 truncate">
                {PartnerCompanyName}
              </span>
            </div>
          )}
        </div>
      </div>
    </div></>
  );
};