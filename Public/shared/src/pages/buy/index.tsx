import { useEffect, useState } from "react";
import Footer from "shared/src/components/utils/Footer";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import DesktopSubMenu from "shared/src/components/utils/Menus/DesktopSubMenu";
import { MobileMenuSell } from "shared/src/components/utils/Menus/MobileSubMenu";
import Container from "shared/src/components/animation/Container";
import DownloadSection from "shared/src/components/utils/DownloadSection/downloadSection";
import Testimonials from "shared/src/components/utils/testimonials/Testimonials";
import BannerRow from "shared/src/components/web/buy/home/BannerBig/BannerRow";
import BannerBig from "shared/src/components/web/buy/home/BannerBig/banners";
import BannerRefurbished from "shared/src/components/web/buy/home/BannerRefurbished/refurbished";
import BrandScroll from "shared/src/components/web/buy/home/BrandScroll/BrandScroll";
import { Herobanner } from "shared/src/components/web/buy/home/BuyHero/herobanner";
import GradeQualityLayout from "shared/src/components/web/buy/home/GradeQualityLayout/gradequality";
import HalfBannerGrid from "shared/src/components/web/buy/home/HalfBannerGrid/halfBanner";
import { PhoneSlider } from "shared/src/components/web/buy/home/HomeCardSlider/phoneSlider";
import OurAssuranceTemplate from "shared/src/components/web/buy/home/OurAssuranceTemplate/Assurance";
import { Capacitor } from "@capacitor/core";
import React from "react";
import ProductService from "shared/src/services/Product.Service";
import { Direction, getUserLanguage, SSRDetection } from "shared/src/components/helper/Helper";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import CategoryService from "shared/src/services/CategoryService";
import { useRecoilValue } from "recoil";
import { MenuContentZindex } from "shared/src/recoil/styleState";
import QuickLinks from "shared/src/components/web/buy/home/QuickLink/QuickLinks";
import { ISEOModel } from "shared/src/models/SEO.Model";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import MetaTags from "shared/src/components/utils/metatags/MetaTags";
import SEOContent from "shared/src/components/utils/seocontent/SEOContent";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";
import MostVisitedProducts from "shared/src/components/web/buy/home/MostVisitedProducts/MostVisitedProducts";
import { IBannerResponseData } from "shared/src/models/Banner.Model";
import { getStaticBanners } from "shared/src/components/utils/banners/staticBanners";
import Breadcrumbs from "shared/src/components/utils/BreadCrumb/Breadcrumbs";
import { IProductModel } from "shared/src/models/Product.Model";
import { ProductCard } from "shared/src/components/utils/Cards/productCard/productCard";
import { IDealsProductModel } from "shared/src/models/DealsProduct.Model";
import Link from "next/link";
import router from "next/dist/client/router";
class HomeProps {
  address?: { Address: string, Email: string, Phone: string, PromotionLinks: { faceBook: string, instagram: string, linkedIn: string, tikTok: string, youTube: string, Twitter: string } } =
    {
      Address: "", Email: "", Phone: "",
      PromotionLinks: {
        faceBook: "",
        instagram: "",
        linkedIn: "",
        youTube: "",
        tikTok: "",
        Twitter: ""
      }
    };
  direction?: string = "";
  language?: "in_en" | "ae_en" | "ae_ar" = "in_en";
  RelatedProducts?: any;
  metaTags: ISEOModel | undefined;
  footerdatares?: any;
  isSSR?: true;
  IsMostVisitedProductDisplayEnabled?: boolean;
  bannerResData?: IBannerResponseData;

}

const fetchData = async (context: any): Promise<HomeProps> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();

  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

  let address: any = null;
  try {
    const addressRes = await ContactUsServices.getAddress();
    address = addressRes.status === 200 ? addressRes.data : null;
  } catch (err) {
    address = null;
  }

  // let RelatedProducts: any[] = [];
  // try {
  //   const relatedProductsRes = await ProductService.getRelatedProduct("iphone15");
  //   RelatedProducts = relatedProductsRes.status === 200 ? relatedProductsRes.data?.Items ?? [] : [];
  // } catch (err) {
  //   RelatedProducts = [];
  // }
  let RelatedProducts: any[] = [];

  try {
    const allProductsRes = await ProductService.GetAllProducts();
    if (allProductsRes.status === 200 && allProductsRes.data.length > 0) {
      const productName = allProductsRes.data.ProductName;
      const relatedProductsRes =
        await ProductService.getRelatedProduct(productName);
      RelatedProducts =
        relatedProductsRes.status === 200
          ? relatedProductsRes.data?.Items ?? []
          : [];
    }
  } catch (err) {
    RelatedProducts = [];
  }


  // static meta tags (API call avoided)
  let metaTags = getStaticMeta(HelperConstant.metaPages.Home);

  let footerdata = await CategoryService.getCategoryList();
  let footerdatares = await (footerdata.status === 200 && footerdata.data.Items)

  // static banners (API call avoided)
  let bannerResData = getStaticBanners();

  // hardcoded: do not show MostVisitedProducts on Home (no API call)
  let IsMostVisitedProductDisplayEnabled = false;

  return { address, direction, language, RelatedProducts, metaTags, footerdatares, IsMostVisitedProductDisplayEnabled, bannerResData }
}
const HomeBuy = ({ address, direction, language, RelatedProducts, footerdatares, metaTags, isSSR, IsMostVisitedProductDisplayEnabled, bannerResData }: HomeProps) => {

  const [relatedProducts, setRelatedProducts] = useState<HomeProps>({ address, direction, language, RelatedProducts, footerdatares, metaTags, IsMostVisitedProductDisplayEnabled, bannerResData });
  const [footerData, setFooterData] = useState(BuyFooterData);
  const [quickLinksData, setQuickLinksData] = useState(BuyFooterData);
  const menuContentZindex = useRecoilValue(MenuContentZindex);
  const [product, setProduct] = useState<Array<IProductModel>>([]);

  useEffect(() => {
    if (!isSSR) {
      fetchData("").then((res => {
        setRelatedProducts({
          address: res.address,
          language: res.language,
          direction: res.direction,
          RelatedProducts: res.RelatedProducts,
          footerdatares: res.footerdatares,
          metaTags: res.metaTags,
          IsMostVisitedProductDisplayEnabled: res.IsMostVisitedProductDisplayEnabled,
          bannerResData: res.bannerResData ?? getStaticBanners(),
        })
      }))
    }
  }, []);

  const getAllProducts = () => {
    const filterObject: Record<string, string[]> = {};;
    filterObject['Brand'] = ["Levis"];
    ProductService.getCategoryBrandByFilter(filterObject)
      .then((res: any) => {
        if (res.status === 200) {
          setProduct(res.data.Items);
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategoryList();

      if (response.status === 200 && response.data) {
        const allCategories = response.data;

        // 1️⃣ Popular categories (from all categories)
        const popularCategories = allCategories.map((category: any) => ({
          title: `Buy ${category.CategoryName}`,
          link: `/buy/${category.EncryptedId}_Category`,
        }));

        setFooterData((prev: any) => ({
          ...prev,
          PopularCategories: popularCategories,
        }));

        // 2️⃣ Phone categories (filtered from same data)
        const phoneCategories = allCategories
          .filter((category: any) => category.ParentCategoryId === 1)
          .map((category: any) => ({
            title: `Buy ${category.CategoryName} Phone`,
            link: `/buy/${category.EncryptedId}_Category`,
          }));

        setQuickLinksData((prev: any) => ({
          ...prev,
          PopularCategories: phoneCategories,
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createFilterUrl = (filterType: string, value: string, additionalParams = {}) => {
    const params: Record<string, string> = {
      productId: filterType,
      [value]: '' // Empty string value for the filter
    };

    // Add any additional parameters
    Object.entries(additionalParams).forEach(([key, val]) => {
      if (val) {
        params[key] = val as string;
      }
    });

    const queryString = new URLSearchParams(params).toString();
    return `/buy?${queryString}`;
  };

  // const fetchCategories = async () => {
  //   try {
  //     const response = await CategoryService.getCategoryList();
  //     if (response.status === 200 && response.data) {
  //       const allCategories = response.data;

  //       const popularCategories = allCategories.map((category: any) => ({
  //         title: `Buy ${category.CategoryName}`,
  //         link: `/buy/${category.EncryptedId}_Category`,
  //       }));

  //       setFooterData({
  //         ...footerData,
  //         PopularCategories: popularCategories,
  //       });
  //     }

  //     const res = await CategoryService.getAllPhoneBrand();
  //     if (res.status === 200 && res.data) {
  //       const allPhoneCategories = res.data;
  //       const phoneCategories = allPhoneCategories
  //         .filter((category: any) => category.ParentCategoryId === 1)
  //         .map((category: any) => ({
  //           title: `Buy ${category.CategoryName} Phone`,
  //           link: `/buy/${category.EncryptedId}_Category`,
  //         }));

  //       setQuickLinksData({
  //         ...footerData,
  //         PopularCategories: phoneCategories,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  useEffect(() => {
    fetchCategories();
    getAllProducts();
  }, []);
  const breadcrumbItems = [
    { title: "Home Furnishing", path: "/buy/home-furnishing" },
    { title: "Runners", path: "/buy/home-furnishing/runners" },
    { title: "Home Furnishing", path: "#", active: true },
  ];

  return (
    <>

      {relatedProducts?.metaTags && (
        <MetaTags metaTags={relatedProducts.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={relatedProducts.language} />
      )}
      {relatedProducts?.metaTags?.SeocontentTitle &&
        <SEOContent SeocontentTitle={relatedProducts?.metaTags?.SeocontentTitle} SeoContent={relatedProducts.metaTags.SeoContent} />
      }
      <Menu />
      <DesktopSubMenu />
      <MobileMenuSell ActiveId={1} zIndex={menuContentZindex.Z_Index} />
      <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto pb-10">
          <Container>
            <h1 className="text-lg text-center font-semibold text-[#EA002A] uppercase w-full">
              POWER YOUR MACHINERY
            </h1>
            <h3 className="font-normal text-lg text-md text-center">
              Precision bearings, durable tools, and industrial parts you can trust
            </h3>

            <Herobanner bannerResData={relatedProducts.bannerResData} />
            <PhoneSlider title="" />
            <BannerRefurbished />
            <BrandScroll />
            {/* <HalfBannerGrid
              AppleProducts={relatedProducts.RelatedProducts}
              bannerResData={relatedProducts.bannerResData}
              reverse={false}
            /> */}
            {relatedProducts.IsMostVisitedProductDisplayEnabled && <MostVisitedProducts />}
            {/* <BannerRow bannerResData={relatedProducts.bannerResData} /> */}
            <OurAssuranceTemplate />
            <GradeQualityLayout />
            {product && product.length > 0 && (
              <div className="flex md:flex-row flex-col-reverse gap-[8px] md:gap-0 justify-between items-center mb-[24px] md:mb-[40px]">
                <h2 className="font-medium text-[22px] leading-[32px] md:text-[36px] md:leading-[66px]">
                  Suggested Products
                </h2>
              </div>
            )}
            {product && product.length > 0 && (<ProductList grid={true} data={product} createFilterUrl={createFilterUrl} />)}
          </Container>
        </div>
      </div>
      {Capacitor.isNativePlatform() ? null :
        <React.Fragment>
          <div className="lg:px-16">
            <div className="max-w-[1300px] mx-auto">
              {/* <Testimonials /> */}
            </div>
          </div>
          <div className="lg:px-16 bg-white">
            {/* <div className="max-w-[1300px] mx-auto py-10">
              <ReviewsWrapper title="What you can hear about us!" cards={cards} />
            </div> */}
          </div>
        </React.Fragment>
      }
      {/* <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto pb-24 lg:pb-14">
          <DownloadSection />
        </div>
      </div> */}
      {/* <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto pb-24 lg:pb-14">
          <QuickLinks footerData={quickLinksData} direction={""} language={"in_en"} />
        </div>
      </div> */}
      {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} address={relatedProducts.address} direction={relatedProducts.direction} language={relatedProducts.language} />}
    </>
  );
};

export default HomeBuy;

export const BuyFooterData = {
  QuickLinks: [
    { title: "About Us", link: "/about-us" },
    // { title: "Buy in Bulk", link: "/corporate" },
    { title: "FAQ", link: "/faq" },
    { title: "Contact Us", link: "/contact-us" },
    // { title: "Find our stores", link: "/our-store" },
    { title: "Terms & Conditions", link: "/terms-of-use" },
    { title: "Privacy Policy", link: "/privacy-policy" },
    // { title: "Blogs", link: "/blog" },
  ],
  Sitemap: [
    { title: "Home", link: "/" },
    { title: "Shop", link: "/shop" },
    { title: "Categories", link: "/categories" },
    { title: "Refurbished Phones", link: "/refurbished-phones" },
    { title: "Brands", link: "/brands" },
    { title: "Offers", link: "/offers" },
    { title: "Sell Your Device", link: "/sell-device" },
    { title: "Customer Support", link: "/support" },
  ],
  PopularCategories: [],
};

const ProductList = (props: any) => {
  // const [product, setProduct] = useState<Array<IDealsProductModel>>([]);
  // const getProduct = () => {
  //   ProductService.getDiscountAppliedProducts()
  //     .then(res => {
  //       if (res.status === 200) {
  //         setProduct(res.data.Items);
  //       }
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // };

  // useEffect(() => {
  //   getProduct();
  // }, []);

  const data = props.data || [];

  // Extract current filter type from query
  // const filterType = query.productId as string || '';
  // const filterValues = Object.keys(query)
  //   .filter(key => key !== 'productId' && query[key] === '')
  //   .map(key => key);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6 px-4 lg:px-0">
      {data.length > 0 ? (
        data
          ?.filter((a: any) => a.Price != 0)
          .map((a: any, i: number) => {

            return (
              <Link
                href={{
                  pathname: `/buy/products/${a.ProductId}`,
                }}
                key={i}
              >
                <ProductCard
                  EncryptedProductId={a.EncryptedProductId}
                  key={a.ProductId + i}
                  title={a.ProductName}
                  price={a.Price}
                  discount={a.DiscountAmount}
                  needTag={true}
                  isGrid={props.grid}
                  OrginalPrice={a.OldPrice}
                  TotalPrice={a.TotalPrice}
                  DiscountName={a.DiscountPricePercentage}
                  Image={a.ImagePath}
                  FullDescription={a.FullDescription}
                  DealName={""}
                  PartnerCompanyName={a.PartnerCompanyName}
                  taxRate={a.TaxRate}
                  isInclusive={a.IsInclusive}
                />
              </Link>
            );
          })
      ) : (
        <div className="text-sm md:text-lg text-[#939393]">
          No matching results for the applied filter
        </div>
      )}

      {/* Display current active filters */}
      {/* {filterValues.length > 0 && (
        <div className="w-full mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              Type: {filterType}
            </span>
            {filterValues.map((value, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {value}
              </span>
            ))}
          </div>
        </div>
      )} */}
    </div>

  );
};
