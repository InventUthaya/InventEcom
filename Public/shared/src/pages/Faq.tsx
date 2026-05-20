import { useEffect, useState } from "react";
import Container from "shared/src/components/animation/Container";
import { Direction, getDatalocalization, getStateName, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import Footer from "shared/src/components/utils/Footer";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import { ISEOModel } from "shared/src/models/SEO.Model";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import SEOServices from "shared/src/services/SEO.Services";
import { MobileMenuSell } from "shared/src/components/utils/Menus/MobileSubMenu";
import { Capacitor } from "@capacitor/core";
import Loader from "shared/src/components/utils/Loader/Loader";
import { faqContents } from "../Languages/FAQ_TermsContent";
import MetaTags from "../components/utils/metatags/MetaTags";
import { BuyFooterData } from "./buy";
import CategoryService from "../services/CategoryService";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";

class FaqData {
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
  isSSR?: boolean
}

const fetchData = async (context: any): Promise<FaqData> => {
  let direction = Direction();
  let language = getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
  const stateName = getStateName();

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);

  // static meta tags (API call avoided)
  let metaTags = getStaticMeta(HelperConstant.metaPages.Faq);

  return { address, direction, language, metaTags }
}

function FaqComponent({ address, direction, language, metaTags, isSSR }: FaqData) {
  const [faqdata, setFaqData] = useState<FaqData>({
    address, direction, language, metaTags,
  });

  const [footerData, setFooterData] = useState(BuyFooterData);

  useEffect(() => {
    if (!isSSR) {
      fetchData("").then(res => {
        setFaqData({
          address: res.address,
          direction: res.direction,
          language: res.language,
          metaTags: res.metaTags,
        });
      });
    }
  }, []);

  if (!faqdata.language) {
    // return <Loader />
  }

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
      <MetaTags environment={process.env.NEXT_PUBLIC_ENV} language={faqdata.language} metaTags={faqdata.metaTags} />
      {/* ------- START ---------This is the top menu section------------ */}
      <Menu needSearch={false} language={faqdata.language} direction={faqdata.direction} />
      {/* -------------------------------------------------- END ---- */}
      {/* ------- START ---------This is the subMenu section------------ */}
      {/* <DesktopSubMenu /> */}
      <MobileMenuSell ActiveId={1} />
      {/* -------------------------------------------------- END ---- */}
      <div className="lg:px-16 px-5">
        <div className="max-w-[1300px] mx-auto pb-20">
          <Container>
            <Faq language={faqdata.language} address={faqdata.address} direction={faqdata.direction} />
          </Container>
        </div>
      </div>
      {/* --------------- START-------------------Footer component for sell---------------------------------- */}
      {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} address={faqdata.address} direction={faqdata.direction} language={faqdata.language} />}
      {/* ----------------------FOOTER component---------------------------- END ---------------------------- */}
    </>
  );
}

export default FaqComponent;

type props = {
  direction: string;
  language: "in_en" | "ae_en" | "ae_ar";
  address: any
}

export const Faq = ({ direction, language, address }: props) => {
  const faqContent = faqContents["in_en" as keyof typeof faqContents];
  return (
    <div className="w-full bg-slate-50 flex flex-col justify-center items-center mt-5" dir={direction}>
      <div className="w-full">
        <h1 className="text-xl md:text-xl 2xl:text-3xl font-semibold">{faqContent[0]?.title}</h1>
      </div>
      <div className="flex flex-col gap-5 mt-5">
        <h1 className="font-semibold text-base md:text-md lg:text-lg 2xl:text-xl">Have Questions? We’ve Got Answers!</h1>
        {faqContent.filter((x: { description: any; }) => x.description).map((item: any, index: any) => {
          return <Accordian {...item} key={index} language={language} direction={direction} address={address} />;
        })}
      </div>
    </div>
  )

};

const Accordian = (props: any) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <h2 className="font-semibold text-base md:text-md 2xl:text-xl">{props.SubTitle}</h2>
      <div
        onClick={() => setShow((a) => !a)}
        className="w-[100%] flex justify-between items-start p-4 md:p-6 2xl:p-8 bg-white rounded-xl cursor-pointer"
        dir={props.direction}>
        <div className="w-full flex flex-col justify-center gap-2">
          <div className=" flex justify-between items-start">
            <h2 className="font-semibold text-base md:text-md 2xl:text-xl">{props.title}</h2>
            <div
              className={`${show ? "rotate-0" : "rotate-180"
                } transition-transform duration-500 ease-in-out`}
            >
              {show ? <Faqdropicon color1="#EA002A" /> : <Faqdropicon />}
              {/* <Faqdropicon  color1={show ? "#EA002A" : "#050505"}/> */}
            </div>
          </div>
          <div
            className={`text-sm md:text-base w-[90%] md:w-[80%] ml-2 md:ml-5  ${show ? "max-h-[100vh]" : "max-h-0"
              } overflow-hidden transition-all duration-500 ease-in-out`}
          >
            <div dangerouslySetInnerHTML={{ __html: props.description?.replaceAll('faq-num', props?.address?.Phone) }}></div>
            <div className="w-[100%]">{props.point}</div>
            <div className="w-[100%]">{props.point1}</div>
            <div className="w-[100%]">{props.point2}</div>
            <div className="w-[100%]">{props.point3}</div>
          </div>
        </div>
      </div>
    </>
  );
};
const Faqdropicon = ({ color1 = "#050505" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 15L12 9L6 15"
      stroke={color1}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FooterData = {
  QuickLinks: [
    { title: "About Us", link: "/about-us" },
    // { title: "Buy in Bulk", link: "/corporate" },
    { title: "FAQ", link: "/faq" },
    { title: "Contact Us", link: "/contact-us" },
    { title: "Find our stores", link: "/our-store" },
    { title: "Terms & Conditions", link: "/terms-of-use" },
    { title: "Privacy Policy", link: "/privacy-policy" },
  ],
  PopularCategories: [],
};
