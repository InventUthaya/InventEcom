import React, { useEffect, useState } from "react";
import Container from "shared/src/components/animation/Container";
import { Direction, SSRDetection, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import Footer from "shared/src/components/utils/Footer";
import DesktopSubMenu from "shared/src/components/utils/Menus/DesktopSubMenu";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import MetaTags from "shared/src/components/utils/metatags/MetaTags";
import { ISEOModel } from "shared/src/models/SEO.Model";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import SEOServices from "shared/src/services/SEO.Services";
import { MobileMenuSell } from "shared/src/components/utils/Menus/MobileSubMenu";
import { Capacitor } from "@capacitor/core";
import { BuyFooterData } from "./buy";
import { policyContents } from "../Languages/PolicyLanguage";
import CategoryService from "../services/CategoryService";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";

class PrivacyPolicyProps {
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
  metaTags: ISEOModel = {} as ISEOModel;
  isSSR?: boolean;
}

const fetchData = async (context: any): Promise<PrivacyPolicyProps> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);

  // static meta tags (API call avoided)
  let metaTags = getStaticMeta(HelperConstant.metaPages.PrivacyPolicy);

  return { address, direction, language, metaTags }
}

function PrivacyPolicyComponent({ direction, language, address, isSSR, metaTags }: PrivacyPolicyProps) {
  const [policydata, setPolicyeData] = useState<PrivacyPolicyProps>({
    address, direction, language, metaTags
  });
  const [footerData, setFooterData] = useState(BuyFooterData);


  useEffect(() => {
    if (!isSSR) {
      fetchData("").then(res => {
        setPolicyeData({
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
      <MetaTags metaTags={policydata.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={policydata.language} />

      {/* ------- START ---------This is the top menu section------------ */}
      <Menu needSearch={false} language={policydata.language} direction={policydata.direction} />
      {/* -------------------------------------------------- END ---- */}

      {/* ------- START ---------This is the subMenu section------------ */}
      {/* <DesktopSubMenu /> */}
      <MobileMenuSell ActiveId={1} />
      {/* -------------------------------------------------- END ---- */}
      <div className="lg:px-16 px-5" dir={policydata.direction}>
        <div className="max-w-[1300px] mx-auto pb-20">
          <Container>
            <Policy direction={policydata.direction} language={policydata.language} />
          </Container>
        </div>
      </div>
      {/* --------------- START-------------------Footer component for sell---------------------------------- */}
      {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} address={policydata.address} direction={policydata.direction} language={policydata.language} />}
      {/* ----------------------FOOTER component---------------------------- END ---------------------------- */}
    </>
  );
}

export default PrivacyPolicyComponent;

type props = {
  direction: string;
  language: "in_en" | "ae_en" | "ae_ar";
}


function Policy({ direction, language }: props) {
  const content = policyContents[language as keyof typeof policyContents];

  function markup(descVal: any) {
    return { __html: descVal.desc };
  }

  return (
    <>
      <div className="w-full lg:w-[80%]" dir={direction}>
        <div>
          <h1 className="text-2xl 2xl:text-3xl">{content[0].title}</h1>
        </div>
        {content.slice(1).map((val, i) => (
          <>
            <div className="text-lg mt-5 text-gray-500">{val.title}</div>
            {"SubTitle" in val && val.SubTitle && <div className="text-md mt-1 text-gray-500">{val.SubTitle}</div>}
            <div className="mt-1" key={i}>
              {val.description.map((descVal, descI) => (
                <React.Fragment key={descI}>
                  <div key={descI} className="text-md mt-2 2xl:text-base" dangerouslySetInnerHTML={markup(descVal)}></div>
                </React.Fragment>
              ))}
            </div>
          </>
        ))}
      </div>
    </>
  );
}