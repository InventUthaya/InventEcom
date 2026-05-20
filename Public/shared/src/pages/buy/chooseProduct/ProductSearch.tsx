import Menu from "shared/src/components/utils/Menus/TopMenu";
import { useState, useEffect } from "react";
import Container from "shared/src/components/animation/Container";
import { SSRDetection, Direction, getUserLanguage } from "shared/src/components/helper/Helper";
import Footer from "shared/src/components/utils/Footer";
import { MobileMenuBuy } from "shared/src/components/utils/Menus/MobileSubMenu";
import useScrollToTop from "shared/src/components/utils/scroll/ScrollToTop";
import ChooseProduct from "shared/src/components/web/buy/chooseProduct";
import { BuyFooterData } from "..";
import DesktopSubMenu from "shared/src/components/utils/Menus/DesktopSubMenu";
import { IFooterModel } from "shared/src/models/Footer.Model";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import CategoryService from "shared/src/services/CategoryService";
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
function ProductSearch({ address, direction, language, isSSR }: FooterProps) {
  const [productData, setProductData] = useState({ address, direction, language });
  const [footerData, setFooterData] = useState(BuyFooterData);
  const [loading, setLoading] = useState(false);

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
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchCategories();
  }, []);

  return (
    <>
      <Menu />
      <DesktopSubMenu />
      <MobileMenuBuy />
      {/* {loading && <Loader />} */}
      <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto pb-10">
          <Container>
            {/* <BannerBig /> */}
            <ChooseProduct />
          </Container>
        </div>
      </div>
      <Footer footerData={footerData} address={productData.address} direction={productData.direction} language={productData.language} />
    </>
  );
}

export default ProductSearch;
