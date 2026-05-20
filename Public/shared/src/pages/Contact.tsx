import { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "../components/utils/Menus/TopMenu";
import { MobileMenuSell } from "../components/utils/Menus/MobileSubMenu";
import Container from "../components/animation/Container";
import Footer from "../components/utils/Footer";
import { Direction, findBrowser, findWindow, getUserLanguage, onKeyDown, restrictInput } from "../components/helper/Helper";
import { ISEOModel } from "../models/SEO.Model";
import { HelperConstant } from "../components/helper/HelperConstant";
import SEOServices from "../services/SEO.Services";
import { SubmitHandler, useForm } from "react-hook-form";
import MetaTags from "../components/utils/metatags/MetaTags";
import Language from "shared/src/Languages/ContactLanguage.json";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import ContactUsServices from "../services/ContactUs.Services";
import { IContactUsModel } from "../models/ContactUs.Model";
import ConfirmaitonPopup from "../components/utils/Cards/confirmation-popup";
import { BuyFooterData } from "./buy";
import CategoryService from "../services/CategoryService";
import { IContactUsConfigModel } from "../models/ContactUsConfigModel.Model";
import ContactUsConfigServices from "../services/ContactUsConfig.Services";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";

class ContactUs {
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
  metaTags?: ISEOModel = {} as ISEOModel;
  isSSR?: boolean;
  contactUsConfig?: IContactUsConfigModel = {} as IContactUsConfigModel;
}

const fetchData = async (): Promise<ContactUs> => {
  let direction = Direction();
  let language = getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);

  let contactUsConfigs = await ContactUsConfigServices.GetContactUsConfigList();
  let contactUsConfig = await (contactUsConfigs.status === 200 && contactUsConfigs.data);

  // static meta tags (API call avoided)
  let metaTags = getStaticMeta(HelperConstant.metaPages.ContactUs);

  return { address, direction, language, contactUsConfig, metaTags };
};

function Contact({ address, direction, language, isSSR, contactUsConfig, metaTags }: ContactUs) {
  const { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm<IContactUsModel>({});
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [chatBotShow, setChatBotShow] = useState(false);
  const pattern = HelperConstant.emailPattern.pattern;
  const [disabled, setDisabled] = useState(false);
  const [contactdata, setContactData] = useState<ContactUs>({ address, direction, language, contactUsConfig, metaTags });
  const [footerData, setFooterData] = useState(BuyFooterData);
  const whatsapp = `https://cdninventecom.inventsoftlabs.in/images/contact/Whatsapp.png`
  const live = `https://cdninventecom.inventsoftlabs.in/images/contact/live.png`
  const call = `https://cdninventecom.inventsoftlabs.in/images/contact/call.png`
  const mess = `https://cdninventecom.inventsoftlabs.in/images/contact/mess.png`
  const location = `https://cdninventecom.inventsoftlabs.in/images/contact/location.png`
  let dataLocalization = Language["in_en"];

  useEffect(() => {
    if (!isSSR) {
      fetchData().then(res => {
        setContactData({
          address: res.address,
          direction: res.direction,
          language: res.language,
          metaTags: res.metaTags,
          contactUsConfig: res.contactUsConfig,
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

  const onContactSubmit: SubmitHandler<IContactUsModel> = (data: any) => {
    data.PasswordFormatId = 0;
    data.IsTaxExempt = true;
    data.AffiliateId = 0;
    data.Deleted = true;
    data.IsSystemAccount = true;
    data.createdOnUtc = "2024-08-28T07:36:44.187Z";
    data.lastLoginDateUtc = "2024-08-28T07:36:44.187Z";
    data.lastActivityDateUtc = "2024-08-28T07:36:44.187Z";
    data.VatNumberStatusId = 0;
    data.TaxDisplayTypeId = 0;
    ContactUsServices.create(data).then((res: any) => {
      if (res.status === 200) {
        setShowConfirmationPopup(true);
      }
      setDisabled(false);
    }).catch((e: string) => {
      console.log(e);
      setDisabled(false);
    });
  }


  const whatsAppHandler = (number: any) => {
    if (findBrowser()) {
      var encodedUri = `https://api.whatsapp.com/send?phone=${number?.replaceAll('+91-', "")}`;
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
    }
  }

  const clickHandler = (number: any) => {
    if (findBrowser()) {
      var encodedUri = `tel:${number}`;
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      document.body.appendChild(link);
      link.click();
    }
  }

  const chatBot = () => {
    setChatBotShow(true)
  }

  const ContactDetails = [
    {
      id: 1,
      image: whatsapp,
      title: dataLocalization.Reach_us_on_WhatsApp,
      contact: contactdata.contactUsConfig?.WhatsAppPhone,
    },
    {
      id: 2,
      image: live,
      title: dataLocalization.Resolve_your_queries_by_live_chatting,
      contact: dataLocalization.Live_Chat,
    },
    {
      id: 3,
      image: call,
      title: dataLocalization.For_buy_related_queries,
      contact: contactdata.contactUsConfig?.BuyPhone,
    },
    {
      id: 4,
      image: call,
      title: dataLocalization.For_warranty_order_related_queries,
      contact: contactdata.contactUsConfig?.OrderPhone,
    },
  ];

  const ContaMailDetails = [
    {
      id: 1,
      image: mess,
      title: dataLocalization.For_buy_related_queries,
      contact: contactdata.contactUsConfig?.BuyEmail,
    },
    {
      id: 2,
      image: mess,
      title: dataLocalization.For_warranty_order_related_queries,
      contact: contactdata.contactUsConfig?.OrderEmail,
    },
    // {
    //   id: 3,
    //   image: mess,
    //   title: dataLocalization.For_business_queries,
    //   contact: contactdata.contactUsConfig?.BusinessEmail,
    // },
  ];


  const handleClosePopup = () => {
    setShowConfirmationPopup(false);
    findWindow() && window.location.reload();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {showConfirmationPopup && (
        <ConfirmaitonPopup handleClosePopup={handleClosePopup} />
      )}
      <MetaTags metaTags={contactdata.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={contactdata.language} />
      <Menu />
      {/* <DesktopSubMenu /> */}
      {/* --------------------------------------------- END ---- */}
      <MobileMenuSell ActiveId={1} />
      {/* {chatBotShow && <DofyChatBot setChatBotShow={setChatBotShow} />} */}
      <div className="lg:px-16 px-5" dir={contactdata.direction}>
        <div className="max-w-[1300px] 2xl:max-w-[1300px] mx-auto pb-20">
          <Container>
            <h1 className="text-xl 2xl:text-2xl font-semibold">{dataLocalization.Contact_Us}</h1>
            <div className="grid lg:grid-cols-2 grid-cols-1">
              {ContactDetails.map((item, index) => (
                <div onClick={() => item.title == dataLocalization.Reach_us_on_WhatsApp ? whatsAppHandler(item.contact) : clickHandler(item.contact)}
                  key={index}
                  className={`flex flex-col gap-3 p-8 items-start lg:items-center lg:p-6 2xl:p-10 bg-[#ffffff] border border-[#EFEFEF]
                  ${item.title == dataLocalization.Resolve_your_queries_by_live_chatting ? "cursor-default" : "cursor-pointer"}
                  ${index == 0 && "rounded-t-lg"}
                  ${index == ContactDetails.length - 1 && "rounded-b-lg"}
                  ${index == 0 && "lg:rounded-t-none lg:rounded-tl-lg"}
                  ${index == 1 && "lg:rounded-t-none lg:rounded-tr-lg"}
                  ${index == 2 && "lg:rounded-b-none lg:rounded-bl-lg"}
                  ${index == 3 && "lg:rounded-b-none lg:rounded-br-lg"}
                  `}
                >
                  <h2 className="text-lg 2xl:text-xl font-semibold">{item.title}</h2>
                  <div className="flex justify-center items-center text-lg gap-2">
                    <Image height={1000} width={1000} src={item.image} alt="" className="w-5 2xl:w-7 " />
                    <span className="2xl:text-md text-sm">{item.contact}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h1 className="text-xl 2xl:text-2xl font-semibold">{dataLocalization.Reach_Us}</h1>
            </div>
            <div className="flex  mt-5 flex-wrap lg:flex-row flex-col bg-white border border-[#EFEFEF] rounded-lg overflow-hidden justify-center">
              <div className="p-8 bg-[#ffffff] lg:w-[70%] w-full border-b lg:border-r border-[#EFEFEF]">
                <h2 className="text-md 2xl:text-lg font-semibold">
                  {dataLocalization.Our_Corporate_Office_Address}
                </h2>
                <div className="flex gap-2 lg:gap-2 mt-3 lg:mt-4 items-start">
                  <Image
                    height={1000} width={1000}
                    src={location}
                    alt=""
                    className="w-5 lg:w-4 2xl:w-7 object-contain"
                  />
                  <p className="lg:w-[80%]">
                    {contactdata.contactUsConfig?.Name} ,<span></span>
                    {contactdata.contactUsConfig?.Address}
                  </p>
                </div>
              </div>
              <div className="lg:w-[30%] w-full flex flex-col justify-center items-center p-8">
                <h1 className="text-md 2xl:text-lg font-semibold">
                  {dataLocalization.Find_our_store_nearby_you}
                </h1>
                <Link href={`/our-store`}>
                  <button className="border border-[#EA002A] text-[#EA002A] px-4 2xl:text-md text-sm py-1 mt-2 rounded-md">
                    {dataLocalization.view_our_stores}
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-xl 2xl:text-2xl font-semibold capitalize">{dataLocalization.mail_to_us}</h1>
            </div>
            <div className="grid lg:grid-cols-2 grid-col-1 border border-[#EFEFEF] rounded-lg bg-white">
              {ContaMailDetails.map((item, index) => (
                <div
                  className={`p-10  flex flex-col justify-center items-start lg:items-center font-semibold 
                    ${index !== ContaMailDetails.length - 1 &&
                    "border-b lg:border-b-0 lg:border-r border-[#EFEFEF]"
                    }`}
                  key={index}
                >
                  <h2 className="text-sm 2xl:text-md">{item.title}</h2>
                  <div className="flex gap-2 mt-2 items-center">
                    <Image height={1000} width={1000} src={item.image} alt="" className="w-5 lg:w-4 2xl:w-6" />
                    <Link href={`mailto:${item.contact}`}>
                      <span className="text-md 2xl:text-lg">{item.contact}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full bg-white flex justify-center items-center mt-5">
              <div className="flex flex-col lg:flex-row w-full rounded-lg border border-[#EFEFEF]">
                <div className="relative lg:w-[60%] px-6 lg:px-10 py-10 overflow-hidden ">
                  <h2 className="lg:text-3xl 2xl:text-4xl text-lg font-semibold">
                    {dataLocalization.Write_to_Us}
                  </h2>
                  <p className="font-medium lg:text-md 2xl:text-base w-[80%] lg:w-full sm:text-base text-sm lg:mt-2">
                    {dataLocalization.Describe_our_queries_in_the_form_well_get_back_to_you_soon}
                  </p>
                  <div className="absolute lg:left-0 lg:top-[27%] left-[-30px] -bottom-20">
                    <svg
                      className="lg:w-[267px] lg:h-[468px] w-[140px] h-[140px]"
                      viewBox="0 0 267 458"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="-60.705"
                        cy="327.298"
                        r="325.851"
                        transform="rotate(-170.882 -60.705 327.298)"
                        stroke="url(#paint0_linear_109_146104)"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_109_146104"
                          x1="-305.179"
                          y1="114.713"
                          x2="-101.628"
                          y2="674.345"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EA002A" />
                          <stop
                            offset="1"
                            stopColor="#EA002A"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="absolute lg:right-0 lg:top-[50%] top-[12px] right-[-40px]">
                    <svg
                      className="lg:w-[211px] lg:h-[289px] w-[140px] h-[140px] "
                      viewBox="0 0 211 289"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="227.566"
                        cy="227.501"
                        r="226.404"
                        transform="rotate(64.3948 227.566 227.501)"
                        stroke="url(#paint0_linear_109_146100)"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_109_146100"
                          x1="57.4754"
                          y1="79.5954"
                          x2="199.095"
                          y2="468.956"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EA002A" />
                          <stop
                            offset="1"
                            stopColor="#EA002A"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="w-[200px] lg:block hidden h-[200px] bg-[#1E54c9] rounded-[50%] absolute left-0 bottom-[-150px] blur-[500px]"></div>
                  <div className="w-[200px] h-[200px] bg-[#EA002A] rounded-[50%] absolute right-[-120px] bottom-[70px] blur-[221px]"></div>
                </div>
                <div className="lg:w-[80%] flex flex-col gap-2 px-4 lg:px-8 py-5 lg:py-10">
                  <form onSubmit={handleSubmit(onContactSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Name}<span className="text-red-500 ml-1">*</span></label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                        // value={name}
                        {...register("Username", { required: true, maxLength: 100 })} onChange={() => { clearErrors("Username"); }}
                      // onChange={(e) => SetName(e.target.value)}
                      />
                      {errors.Username?.type === "required" && <p className="text-red-700 text-xs">{dataLocalization.Enter_Your_Name}</p>}
                      {errors.Username?.type === "maxLength" && <p className="text-red-700 text-xs">{dataLocalization.Your_Name_Must_Be_Within_50_words}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold capitalize text-sm 2xl:text-md">
                        {dataLocalization.Email_ID}<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your Email Address"
                        className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                        {...register("Email", { required: true, pattern: pattern })} onChange={() => { clearErrors("Email"); }}
                      // value={email}
                      // onChange={(e) => SetEmail(e.target.value)}
                      />
                      {errors.Email?.type === "required" && <p className="text-red-700 text-xs">{dataLocalization.Enter_Your_Email_Address}</p>}
                      {(errors.Email?.type === "pattern") && <p className="text-red-700 text-xs">{dataLocalization.Enter_Your_valid_Email_Address}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold capitalize text-sm 2xl:text-md">
                        {dataLocalization.Mobile_number}<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        inputMode="numeric"
                        placeholder="Enter your mobile number"
                        className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                        onKeyDown={onKeyDown} {...register("MobileNumber", { required: true, minLength: 9, maxLength: 9 })}
                        onChange={(e: any) => { restrictInput(e, 10); clearErrors("MobileNumber"); setValue("MobileNumber", HelperConstant.numberOnlyRegex.regex.test(e.target.value) ? e.target.value : "") }}
                      // value={mobilenumber}
                      // onChange={(e) => SetMobilenumber(e.target.value)}
                      />
                      {errors.MobileNumber?.type === "required" && <p className="text-red-700 text-xs">{dataLocalization.Enter_Your_Mobile_Number}</p>}
                      {(errors.MobileNumber?.type === "minLength" || errors.MobileNumber?.type === "maxLength") && <p className="text-red-700 text-xs">{dataLocalization.Enter_Your_valid_Mobile_Number}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold capitalize text-sm 2xl:text-md">
                        {dataLocalization.Subject}<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your query about"
                        className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                        // value={subject}
                        // onChange={(e) => SetSubject(e.target.value)}
                        {...register("Subject", { required: true, maxLength: 200 })} onChange={() => { clearErrors("Subject"); }}
                      />
                      {errors.Subject?.type === "required" && <p className="text-red-700 text-xs">{dataLocalization.Enter_Your_Subject}</p>}
                      {(errors.Subject?.type === "maxLength") && <p className="text-red-700 text-xs">{dataLocalization.Your_Subject_Must_Be_Within_200_words}</p>}
                    </div>
                    <button type="submit" disabled={disabled} className=" w-ful p-[8px] 2xl:p-[10px] bg-[#EA002A] text-white rounded-[8px] mt-4">{dataLocalization.Submit}</button>
                  </form>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      {/* --------------- START-------------------Footer component for sell---------------------------------- */}
      {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} address={contactdata.address} direction={contactdata.direction} language={contactdata.language} />}
      {/* ----------------------FOOTER component---------------------------- END ---------------------------- */}
    </>
  );
}

export default Contact;
