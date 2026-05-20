import Footer from "shared/src/components/utils/Footer";
import { MobileMenuSell } from "shared/src/components/utils/Menus/MobileSubMenu";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import { ISEOModel } from "shared/src/models/SEO.Model";
import { Direction, SSRDetection, getCookiesFromServer, getUserLanguage } from "shared/src/components/helper/Helper";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { useEffect, useState } from "react";
import Container from "shared/src/components/animation/Container";
import Language from "shared/src/Languages/AboutLanguage.json";
import { Capacitor } from "@capacitor/core";
import Objective from "../components/web/about/components/Objective/Objective";
import Founders from "../components/web/about/components/Founders/Founders";
import AboutHero from "../components/web/about/components/Hero/Hero";
import TimeLine from "../components/web/about/components/TimeLine/TimeLine";
import VersatileTeam from "../components/web/about/components/VersatileTeam/VersatileTeam";
import { BuyFooterData } from "./buy";
import CategoryService from "../services/CategoryService";
import { HelperConstant } from "../components/helper/HelperConstant";
import SEOServices from "../services/SEO.Services";
import MetaTags from "../components/utils/metatags/MetaTags";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";

class AboutUsData {
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
  metaTags?: ISEOModel = {} as ISEOModel;
  personId: any;
  isSSR?: boolean;
}

const fetchData = async (context: any): Promise<AboutUsData> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
  let personId = getCookiesFromServer(context.req).personId != undefined ? getCookiesFromServer(context.req).personId : 0;

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);
  // static meta tags (API call avoided)
  let metaTags = getStaticMeta(HelperConstant.metaPages.About);

  return { address, direction, language, personId, metaTags }
}

const AboutUs = ({ direction, language, address, metaTags, personId, isSSR }: AboutUsData) => {
  const [aboutData, setAboutData] = useState<AboutUsData>({
    address, direction, language, metaTags, personId
  });
  const [footerData, setFooterData] = useState(BuyFooterData);

  let dataLocalization = Language[language];

  useEffect(() => {
    if (!isSSR) {
      fetchData("").then(res => {
        setAboutData({
          address: res.address,
          direction: res.direction,
          language: res.language,
          metaTags: res.metaTags,
          personId: res.personId
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
      <MetaTags metaTags={aboutData.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={language} />
      {/* ------- START ---------This is the top menu section------------ */}
      <Menu needSearch={false} language={aboutData.language} direction={aboutData.direction} />
      {/* -------------------------------------------------- END ---- */}

      {/* ------- START ---------This is the subMenu section------------ */}
      {/* <DesktopSubMenu /> */}
      <MobileMenuSell ActiveId={1} />
      {/* -------------------------------------------------- END ---- */}
      <div className="lg:px-16 md:px-5 px-2" dir={aboutData.direction} lang={aboutData.language}>
        <div className="max-w-[1300px] mx-auto">
          <Container>
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mt-8 lg:mt-16">
              <h2 className="text-base md:text-lg 2xl:text-xl font-medium text-red-500">
                {dataLocalization.About_Us}
              </h2>
              <p className="text-3xl lg:text-5xl 2xl:text-6xl md:text-4xl font-medium lg:leading-tight text-center">
                {dataLocalization.Transforming_the_Way_You_Sell_Used_Devices_with_Ease_and_Trust}
              </p>
            </div>
          </Container>
        </div>
      </div>
      <Container>
        <AboutHero direction={aboutData.direction} language={aboutData.language} />
      </Container>
      <div className="lg:px-16 px-5" dir={aboutData.direction} lang={aboutData.language}>
        <div className="max-w-[1300px] mx-auto">
          <Container>
            <Objective language={aboutData.language} />
            <Founders language={aboutData.language} />
            <VersatileTeam language={aboutData.language} />
          </Container>
        </div>
      </div>
      {/* <Riders language={language} direction={aboutData.direction} /> */}
      {/* <TimeLine language={aboutData.language} direction={aboutData.direction} /> */}
      {/* <div className="lg:px-16" >
        <div className="max-w-[1300px] mx-auto pb-20">
          <PressRelease title={dataLocalization.Press_Release} cards={cards} direction={aboutData.direction} lanugage={aboutData.language} />
        </div>
      </div> */}
      {/* --------------- START-------------------Footer component for sell---------------------------------- */}
      {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} address={aboutData.address} direction={aboutData.direction} language={aboutData.language} />}
      {/* ----------------------FOOTER component---------------------------- END ---------------------------- */}
    </>
  );
};

export default AboutUs;

const cards = [
  {
    id: "1",
    content:
      "Discover the latest fashion trends on Invent – premium styles, top brands, and everyday comfort delivered to your doorstep.",
  },
  {
    id: "2",
    content:
      "Shop trusted global brands on Invent with assured quality, perfect fits, and affordable prices for men, women, and kids.",
  },
  {
    id: "3",
    content:
      "From casual wear to statement outfits, Invent brings carefully curated collections designed for modern lifestyles.",
  },
  {
    id: "4",
    content:
      "Enjoy a seamless shopping experience on Invent with secure payments, fast delivery, and easy returns across India.",
  },
];
