import Container from "shared/src/components/animation/Container";
import useScrollToTop from "shared/src/components/utils/scroll/ScrollToTop";
import { BuyCardSlider } from "shared/src/components/web/buy/home/HomeCardSlider/cardSlider";
import DetailView from "shared/src/components/web/buy/ProductDetails/DetailView";
import { useState, useEffect } from "react";
import { SSRDetection, Direction, getUserLanguage } from "shared/src/components/helper/Helper";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import DesktopSubMenu from "shared/src/components/utils/Menus/DesktopSubMenu";
import { MobileMenuBuy } from "shared/src/components/utils/Menus/MobileSubMenu";
import { Faq } from "../../Faq";
import CategoryService from "shared/src/services/CategoryService";
import Footer from "shared/src/components/utils/Footer";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { IFooterModel } from "shared/src/models/Footer.Model";
import { BuyFooterData } from "..";
import { useRouter } from "next/router";
import { IProductModel } from "shared/src/models/Product.Model";
import ProductService from "shared/src/services/Product.Service";
import ProductReview from "shared/src/components/utils/ProductReview/ProductReview";
import Link from "next/link";
import { ProductCard } from "shared/src/components/utils/Cards/productCard/productCard";

class FooterProps {
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
  direction?: string;
  language?: "in_en" | "ae_en" | "ae_ar" = "in_en";
  footerData?: IFooterModel;
  isSSR?: boolean
}
const fetchData = async (context: any): Promise<FooterProps> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);
  return { address, direction, language }
}

function ProductDetails({ address, direction, language, isSSR }: FooterProps) {
  const [productData, setProductData] = useState({ address, direction, language });
  const [footerData, setFooterData] = useState(BuyFooterData);
  const [product, setProduct] = useState<IProductModel | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Array<IProductModel>>([]); // New state for related products
  const router = useRouter();
  const { productId, productdetailId } = router.query;

  useEffect(() => {
    if (!isSSR) {
      fetchData("").then(res => {
        setProductData({
          address: res.address,
          direction: res.direction,
          language: res.language,
        });
      });
    }
  }, []);
  useScrollToTop();

  const getAllProducts = (category: string | null) => {
    // Only fetch products if we have a category
    if (!category) return;

    const filterObject: Record<string, string[]> = {};
    filterObject['Category'] = [category]; // Use the passed category parameter

    ProductService.getCategoryBrandByFilter(filterObject)
      .then((res: any) => {
        if (res.status === 200) {
          setRelatedProducts(res.data.Items); // Set to relatedProducts state
        }
      })
      .catch((e: string) => {
        console.log(e);
      });
  };

  const getProductById = () => {
    ProductService.GetProductDetailbyId(productdetailId).then((res: any) => {
      if (res.status === 200) {
        const productData = res.data.Items[0];
        setProduct(productData);

        // After setting product, fetch related products based on its category
        if (productData && productData.CategoryName) {
          getAllProducts(productData.CategoryName);
        }
      }
    }).catch((e: string) => {
      console.log(e);
    })
  };

  const createFilterUrl = (filterType: string, value: string, additionalParams = {}) => {
    const params: Record<string, string> = {
      productId: filterType,
      [value]: ''
    };

    Object.entries(additionalParams).forEach(([key, val]) => {
      if (val) {
        params[key] = val as string;
      }
    });

    const queryString = new URLSearchParams(params).toString();
    return `/buy?${queryString}`;
  };


  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategoryList();
      if (response.status === 200 && response.data) {
        const allCategories = response.data;

        const popularCategories = allCategories.map((category: any) => ({
          title: `Buy ${category.CategoryName}`,
          link: `/buy/${category.EncryptedId}_Category`,
        }));

        setFooterData({
          ...footerData,
          PopularCategories: popularCategories,
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (productdetailId) {
      getProductById();
    }
  }, [productdetailId]);

  useEffect(() => {
    fetchCategories();
    // Remove getAllProducts() from here since it will be called after getProductById
  }, []);

  return (
    <>
      <Menu />
      <DesktopSubMenu />
      <MobileMenuBuy />
      <div className="lg:px-16 px-5" key={productdetailId as string}>
        <div className="max-w-[1300px] mx-auto pb-10">
          <Container>
            <DetailView language={language} />
            {/* <BuyCardSlider title="" price={product?.Price} /> */}
            {/* <Faq direction={""} language={"in_en"} address={productData.address} /> */}
            <ProductReview productId={productdetailId} />
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="flex md:flex-row flex-col-reverse gap-[8px] md:gap-0 justify-between items-center mb-[24px] md:mb-[40px]">
                <h2 className="font-medium text-[22px] leading-[32px] md:text-[36px] md:leading-[66px]">
                  You Might Also Like
                </h2>
              </div>
            )}
            <ProductList grid={true} data={relatedProducts} createFilterUrl={createFilterUrl} />
          </Container>
        </div>
      </div>
      <Footer footerData={footerData} address={productData.address} direction={productData.direction} language={productData.language} />
    </>
  );
}

const ProductList = (props: any) => {
  const data = props.data || [];

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
        <div className="col-span-full text-center text-sm md:text-lg text-[#939393] py-10">
          No matching results for the applied filter
        </div>
      )}
    </div>
  );
};

export default ProductDetails;