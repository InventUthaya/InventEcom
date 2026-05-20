import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import Container from "shared/src/components/animation/Container";
import { SSRDetection, Direction, getUserLanguage } from "shared/src/components/helper/Helper";
import Footer from "shared/src/components/utils/Footer";
import DesktopSubMenu from "shared/src/components/utils/Menus/DesktopSubMenu";
import { MobileMenuSell } from "shared/src/components/utils/Menus/MobileSubMenu";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { BuyFooterData } from "./buy";
import CategoryService from "../services/CategoryService";
import RequestDelivery from "../components/utils/Request/RequestDelivery";
import MetaTags from "../components/utils/metatags/MetaTags";
import { HelperConstant } from "../components/helper/HelperConstant";
import SEOServices from "../services/SEO.Services";
import { ISEOModel } from "../models/SEO.Model";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";

class Request {
  address: { Address: string, Email: string, Phone: string, Timing: string, PromotionLinks: { faceBook: string, instagram: string, linkedIn: string, tikTok: string, youTube: string, Twitter: string } } =
    {
      Address: "", Email: "", Phone: "", Timing: "",
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
  metaTags: ISEOModel = {} as ISEOModel;
  isSSR?: boolean
}

const fetchData = async (context: any): Promise<Request> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);

  // static meta tags (API call avoided)
  let metaTags = getStaticMeta(HelperConstant.metaPages.RequestForDelivery);

  return { address, direction, language, metaTags }
}

export default function RequestComponent({ address, direction, language, metaTags, isSSR }: Request) {
  const [partnerdata, setPartnerData] = useState<Request>({
    address, direction, language, metaTags,
  });
  const [footerData, setFooterData] = useState(BuyFooterData);

  useEffect(() => {
    if (!isSSR) {
      fetchData("").then(res => {
        setPartnerData({
          address: res.address,
          direction: res.direction,
          language: res.language,
          metaTags: res.metaTags,
        });
      });
    }
  }, []);

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
    fetchCategories();
  }, []);

  return (
    <>
      <MetaTags metaTags={partnerdata.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={partnerdata.language} />
      <Menu needSearch={false} />
      <DesktopSubMenu />
      <MobileMenuSell ActiveId={1} />
      <div className="lg:px-16 px-5" dir={direction}>
        <div className="max-w-[1300px] mx-auto pb-20">
          <Container>
            <RequestDelivery address={address} direction={partnerdata.direction} language={partnerdata.language} metaTags={metaTags} isSSR={true} />
          </Container>
        </div>
      </div>
      {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} address={address} />}
    </>
  );
}
