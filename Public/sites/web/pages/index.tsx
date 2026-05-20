import { GetServerSideProps } from "next";
import { Direction, getUserLanguage, SSRDetection } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { IBannerResponseData } from "shared/src/models/Banner.Model";
import { ISEOModel } from "shared/src/models/SEO.Model";
import HomeBuy from "shared/src/pages/buy";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import ProductService from "shared/src/services/Product.Service";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";
import { getStaticBanners } from "shared/src/components/utils/banners/staticBanners";

class HomeProps {
  address: { Address: string, Email: string, Phone: string, PromotionLinks: { faceBook: string, instagram: string, linkedIn: string, tikTok: string, youTube: string, Twitter: string } } =
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
  direction: string = "";
  language: "in_en" | "ae_en" | "ae_ar" = "in_en";
  RelatedProducts: any;
  metaTags: ISEOModel | undefined;
  isSSR?: boolean;
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
  //   const relatedProductsRes = await ProductService.getRelatedProduct("iPhone 14 Pro");
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
  
  // hardcoded: do not show MostVisitedProducts on Home (no API call)
  let IsMostVisitedProductDisplayEnabled  = false;

  // static banners (API call avoided)
  let bannerResData: IBannerResponseData = getStaticBanners();

  // static meta tags (API call avoided)
  let metaTags: ISEOModel | undefined = getStaticMeta(HelperConstant.metaPages.Home);

  return { address, direction, language, metaTags, RelatedProducts, IsMostVisitedProductDisplayEnabled, bannerResData }
}

export default function Home({ address, direction, language, RelatedProducts, metaTags, IsMostVisitedProductDisplayEnabled,bannerResData }: HomeProps) {
  return (
    <HomeBuy RelatedProducts={RelatedProducts} address={address} language={language} direction={direction} isSSR={true} metaTags={metaTags} IsMostVisitedProductDisplayEnabled={IsMostVisitedProductDisplayEnabled} bannerResData={bannerResData}/>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const { address, direction, language, metaTags, RelatedProducts, IsMostVisitedProductDisplayEnabled, bannerResData } = await fetchData(context);
  return { props: { address, direction, language, metaTags, RelatedProducts, IsMostVisitedProductDisplayEnabled, bannerResData } }
}