import React, { useEffect, useState } from "react";
import Container from "shared/src/components/animation/Container";
import { Direction, SSRDetection, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import Footer from "shared/src/components/utils/Footer";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import MetaTags from "shared/src/components/utils/metatags/MetaTags";
import { ISEOModel } from "shared/src/models/SEO.Model";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { MobileMenuSell } from "shared/src/components/utils/Menus/MobileSubMenu";
import { Capacitor } from "@capacitor/core";
import { BuyFooterData } from "./buy";
import { termsContents } from "../Languages/FAQ_TermsContent";
import CategoryService from "../services/CategoryService";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";

interface PromotionLinks {
  faceBook: string;
  instagram: string;
  linkedIn: string;
  tikTok: string;
  youTube: string;
  Twitter: string;
}

interface AddressData {
  Address: string;
  Email: string;
  Phone: string;
  PromotionLinks: PromotionLinks;
}

class TermsOfUse {
  address: AddressData = {
    Address: "",
    Email: "",
    Phone: "",
    PromotionLinks: {
      faceBook: "",
      instagram: "",
      linkedIn: "",
      youTube: "",
      tikTok: "",
      Twitter: "",
    },
  };
  direction: string = "";
  language: "in_en" | "ae_en" | "ae_ar" = "in_en";
  metaTags: ISEOModel = {} as ISEOModel;
  isSSR?: boolean;
}

const fetchData = async (context: any): Promise<TermsOfUse> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();

  let addressRes = await ContactUsServices.getAddress();
  let address = (addressRes.status === 200 && addressRes.data) || {
    Address: "",
    Email: "",
    Phone: "",
    PromotionLinks: { faceBook: "", instagram: "", linkedIn: "", youTube: "", tikTok: "", Twitter: "" },
  };

  let metaTags = getStaticMeta(HelperConstant.metaPages.TermsOfUse);

  return {
    address,
    direction,
    language: language as "in_en" | "ae_en" | "ae_ar",
    metaTags,
  };
};

function TermsComponent({ direction, language, address, isSSR, metaTags }: TermsOfUse) {
  const [termsofusedata, setTermofuseData] = useState<TermsOfUse>({
    address,
    direction,
    language,
    metaTags,
    isSSR,
  });
  const [footerData, setFooterData] = useState(BuyFooterData);

  useEffect(() => {
    if (!isSSR) {
      fetchData("").then((res) => {
        setTermofuseData({
          address: res.address,
          direction: res.direction,
          language: res.language,
          metaTags: res.metaTags,
        });
      });
    }
  }, [isSSR]);

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
      <MetaTags
        metaTags={termsofusedata.metaTags}
        environment={process.env.NEXT_PUBLIC_ENV}
        language={termsofusedata.language}
      />

      <Menu needSearch={false} language={termsofusedata.language} direction={termsofusedata.direction} />

      <MobileMenuSell ActiveId={1} />

      <div className="lg:px-16 px-5" dir={termsofusedata.direction}>
        <div className="max-w-[1300px] mx-auto pb-20">
          <Container>
            <Terms direction={termsofusedata.direction} language={termsofusedata.language} />
          </Container>
        </div>
      </div>

      {Capacitor.isNativePlatform() ? null : (
        <Footer
          footerData={footerData}
          address={termsofusedata.address}
          direction={termsofusedata.direction}
          language={termsofusedata.language}
        />
      )}
    </>
  );
}

export default TermsComponent;

interface DescriptionItem {
  desc: string;
  point?: string;
}

interface SectionItem {
  title: string;
  SubTitle?: string;
  description: DescriptionItem[];
}

// Full terms content type covering all languages
interface TermsContent {
  in_en: [SectionItem & { title: string }, ...SectionItem[]];
  ae_en: [SectionItem & { title: string }, ...SectionItem[]];
  ae_ar: [SectionItem & { title: string }, ...SectionItem[]];
}

// IMPORTANT: Apply this type in your FAQ_TermsContent.ts file
// Example:
// export const termsContents = { ... } as const satisfies TermsContent;

// If you can't modify that file right now, use type assertion here:
const typedTermsContents = termsContents as TermsContent;

interface TermsProps {
  direction: string;
  language: "in_en" | "ae_en" | "ae_ar";
}

function Terms({ direction, language }: TermsProps) {
  const content = typedTermsContents[language]; // Now fully typed and safe

  const markup = (descVal: DescriptionItem) => ({ __html: descVal.desc });

  return (
    <div className="w-full lg:w-[80%]" dir={direction}>
      <div>
        <h1 className="text-2xl 2xl:text-3xl font-bold">{content[0].title}</h1>
      </div>

      {content.slice(1).map((val: SectionItem, i: number) => (
        <div className="mt-8" key={i}>
          <h2 className="text-lg font-semibold text-gray-800">{val.title}</h2>
          {val.SubTitle && (
            <h3 className="text-md mt-2 text-gray-600 font-medium">{val.SubTitle}</h3>
          )}
          {val.description.map((descVal: DescriptionItem, descI: number) => (
            <React.Fragment key={descI}>
              <div
                className="text-base mt-3 text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={markup(descVal)}
              />
              {descVal.point && (
                <div className="text-base mt-3 text-gray-700 pl-6">
                  <span className="font-medium">• </span>
                  {descVal.point}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}