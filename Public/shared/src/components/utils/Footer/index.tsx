import { findBrowser, getUserLanguage, getUserLocationForParam } from "../../helper/Helper";
import {
  facebook,
  XsocialIcons,
  WhatsappIcons,
  YoutubeIcon,
  LinkedInIcon,
  InstaIcons,
  AppStoreIcon,
  PlaystoreIcon,
} from "./assets";
import Link from "next/link";
import { HelperConstant } from "../../helper/HelperConstant";
import { useRouter } from "next/router";
import Language from "shared/src/Languages/Footer.json";
import { LogoIcon } from "../Menus/assets/topMenuAssets";
import { IFooterModel } from "shared/src/models/Footer.Model";
import { useEffect, useState } from "react";
import CategoryService from "shared/src/services/CategoryService";
import ContactUsConfigServices from "shared/src/services/ContactUsConfig.Services";
import { IContactUsConfigModel } from "shared/src/models/ContactUsConfigModel.Model";
import Logo from "../../../../../public/image.png";
import NextImage from "next/image";

class Props {
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
  footerData?: IFooterModel | any;
}

const Footer = (props: Props) => {
  const router = useRouter()
  const facebookSite = () => {
    if (findBrowser()) {
      window.open(props?.address?.PromotionLinks?.faceBook);
    }
  };

  const instagramSite = () => {
    if (findBrowser()) {
      window.open(props?.address?.PromotionLinks?.instagram);
    }
  };

  const twitterSite = () => {
    if (findBrowser()) {
      window.open(props?.address?.PromotionLinks?.Twitter);
    }
  };

  const linkedInSite = () => {
    if (findBrowser()) {
      window.open(props?.address?.PromotionLinks?.linkedIn);
    }
  };

  const tikTokSIte = () => {
    if (findBrowser()) {
      window.open(props?.address?.PromotionLinks?.tikTok);
    }
  };

  const youtubeSite = () => {
    if (findBrowser()) {
      window.open(props?.address?.PromotionLinks?.youTube);
    }
  };

  const linkHandler = (type: "android" | "ios") => {
    if (findBrowser()) {
      if (type === "android") {
        window.open(HelperConstant.androidAppLink);
      }
      if (type === "ios") {
        window.open(HelperConstant.iosAppLink);
      }
    }
  }

  let dataLocalization = Language["in_en"];
  const [filteredCategories, setFilteredCategories] = useState<Array<any>>([]);
  const [contactUsConfig, setcontactUsConfig] = useState<IContactUsConfigModel>();

  const getCategory = () => {
    CategoryService.getCategoryList().then((res: any) => {
      if (res.status === 200) {
        const allCategories = res.data;
        setFilteredCategories(allCategories);
      }
    }).catch((e: string) => {
      console.log(e);
    })
  };

  const GetContactUsConfigList = () => {
    ContactUsConfigServices.GetContactUsConfigList().then((res: any) => {
      if (res.status === 200) {
        const allContactUs = res.data;
        setFilteredCategories(allContactUs);
        setcontactUsConfig(allContactUs)
      }
    }).catch((e: string) => {
      console.log(e);
    })
  };

  useEffect(() => {
    getCategory();
    GetContactUsConfigList();
  }, [])


  return (
    <>
      <div className="reponse" dir={props.direction} lang={props.language}>
        <div className=" flex flex-col bg-[#EAEAEA]">
          <div className="Footer  w-full px-[26px] md:px-[120px] py-[24px] flex-col md:flex md:flex-row justify-between">
            <div id="AboutContent">
              <h1 className="font-bold text-[24px] leading-[28.8px] tracking-[4px]">
                <Link href={`/`} className="cursor-pointer">
                <NextImage
                  src={Logo}
                  alt="Logo"
                  width={120}
                  height={40}
                  priority
                />
                </Link>
              </h1>
              <p dangerouslySetInnerHTML={{ __html: dataLocalization.We_promise_our_users }} className=" font-[400]  text-[14px] md:text-[12px] leading-[22px] md:leading-[20px] mt-[6px]">
              </p>
              <div className="Abouticon flex gap-[11px] mt-6 md:mt-[32px]">
                {props?.address?.PromotionLinks?.faceBook != "" && <img src={facebook.src} className="social-icon" alt="" onClick={() => { facebookSite() }} />}
                {props?.address?.PromotionLinks?.Twitter != "" && <img src={XsocialIcons.src} className="social-icon" alt="" onClick={() => { twitterSite() }} />}
                {props?.address?.PromotionLinks?.instagram != "" && <img src={InstaIcons.src} className="social-icon" alt="" onClick={() => { instagramSite() }} />}
                {props?.address?.PromotionLinks?.linkedIn != "" && <img src={LinkedInIcon.src} className="social-icon" alt="" onClick={() => { linkedInSite() }} />}
                {props?.address?.PromotionLinks?.youTube != "" && <img src={YoutubeIcon.src} className="social-icon" alt="" onClick={() => { youtubeSite() }} />}
                {props?.address?.PromotionLinks?.tikTok != "" && <img src={WhatsappIcons.src} className="social-icon" alt="" onClick={() => { tikTokSIte() }} />}
              </div>
              <div className="Abouticon flex gap-[11px] mt-6 md:mt-[32px]">
                {contactUsConfig?.FaceBookLink && (
                  <img
                    src={facebook.src}
                    className="social-icon"
                    alt="Facebook"
                    onClick={() => window.open(contactUsConfig.FaceBookLink, "_blank")}
                  />
                )}
                {contactUsConfig?.TwitterLink && (
                  <img
                    src={XsocialIcons.src}
                    className="social-icon"
                    alt="Twitter"
                    onClick={() => window.open(contactUsConfig.TwitterLink, "_blank")}
                  />
                )}
                {contactUsConfig?.InstagramLink && (
                  <img
                    src={InstaIcons.src}
                    className="social-icon"
                    alt="Instagram"
                    onClick={() => window.open(contactUsConfig.InstagramLink, "_blank")}
                  />
                )}
                {contactUsConfig?.LinkedInLink && (
                  <img
                    src={LinkedInIcon.src}
                    className="social-icon"
                    alt="LinkedIn"
                    onClick={() => window.open(contactUsConfig.LinkedInLink, "_blank")}
                  />
                )}
                {contactUsConfig?.YouTubeLink && (
                  <img
                    src={YoutubeIcon.src}
                    className="social-icon"
                    alt="YouTube"
                    onClick={() => window.open(contactUsConfig.YouTubeLink, "_blank")}
                  />
                )}
                {contactUsConfig?.TikTokLink && (
                  <img
                    src={WhatsappIcons.src}
                    className="social-icon"
                    alt="TikTok"
                    onClick={() => window.open(contactUsConfig.TikTokLink, "_blank")}
                  />
                )}
              </div>
              <h3 className=" text-[14px] md:text-[14px] font-medium mt-6 2xl:text-[16px]">
                {dataLocalization.Download_Now}
              </h3>
              <div className="StoreIcon flex gap-[6.97px] mt-[15.2px] md:mt-[32.41px] ">
                <img src={AppStoreIcon.src} alt="" onClick={() => linkHandler("ios")} />
                <img src={PlaystoreIcon.src} alt="" onClick={() => linkHandler("android")} />
              </div>
            </div>
            <div
              id="AboutContent"
              className=" flex-col md:flex md:flex-row mt-6  md:mt-0 gap-[60px] "
            >
              <div
                id="QuickLinks"
                className=" font-[600] flex flex-col gap-[12px]"
              >
                <h1 className=" QuickLinksMenu font-[600] text-[16px] 2xl:text-[20px] text-[#EA002A] ">
                  {dataLocalization.Site_Map}
                </h1>
                <div className="font-normal leading-[30px] text-[16px]">
                  {props?.footerData?.QuickLinks.map((e: any) => (
                    <Link href={e.link} key={e.title}>
                      <h5 className="text-[15px] 2xl:text-[20px]">{e.title}</h5>
                    </Link>
                  ))}
                </div>
              </div>
              {/* <div id="Sitemap" className=" font-[600] flex flex-col gap-[12px]">
                <h1 className=" QuickLinksMenu font-[600] text-[16px] 2xl:text-[20px] text-[#EA002A] ">
                  Site Map
                </h1>
                <div className="font-normal leading-[30px] text-[16px]">
                  {props?.footerData?.Sitemap.map((e: any) => (
                    <Link href={e.link} key={e.title}>
                      <h5 className="text-[15px] 2xl:text-[20px]">{e.title}</h5>
                    </Link>
                  ))}
                </div>
              </div> */}
              {/* <div
                id="PopularCategories"
                className="  flex gap-[12px] flex-col mt-[24px] md:mt-0"
              >
                <h1 className=" font-[600] text-[16px] 2xl:text-[20px] text-[#EA002A]">
                  {dataLocalization.PopularCategories}
                </h1>
                <div className="font-normal leading-[30px] text-[16px]">
                  {props?.footerData?.PopularCategories.map((e: any) => (
                    <Link href={e.link} key={e.title} onClick={() => window.location.href = e.link}>
                      <h5 className="text-[15px] 2xl:text-[20px]">{e.title}</h5>
                    </Link>
                  ))} */}
              {/* {ServicesBuy.map((e: any) => (
                    <div key={e.Id} onClick={() => sellServiceRouterHandler(e.Router)} className="cursor-pointer">
                      <h5 className="text-[15px] 2xl:text-[20px]">{e.Name}</h5>
                    </div>
                  ))} */}
              {/* </div>
              </div> */}
            </div>
          </div>
          <div className="mb-16 lg:m-0">
            <h5 className="text-center pb-3 font-[400] leading-[22px] text-[#939393] text-[14px] ">
              Copyrights © 2025 All rights reserved
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
