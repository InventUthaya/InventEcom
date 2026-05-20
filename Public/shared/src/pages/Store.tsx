import call from "public/assets/images/contact/call.png";
import sto from "public/assets/images/contact/store.png";
import DirectionImage from "public/assets/images/contact/direction.png";
import Container from "../components/animation/Container";
import Footer from "../components/utils/Footer";
import { MobileMenuSell } from "../components/utils/Menus/MobileSubMenu";
import Menu from "../components/utils/Menus/TopMenu";
import { ILocateOurStoresModel } from "../models/LocateOurStores";
import { useEffect, useState } from "react";
import LocateOurStoresService from "../services/LocateOurStores.Service";
import Link from "next/link";
import { SSRDetection, Direction, getUserLanguage, isIn, getDatalocalization } from "../components/helper/Helper";
import { HelperConstant } from "../components/helper/HelperConstant";
import { ISEOModel } from "../models/SEO.Model";
import SEOServices from "../services/SEO.Services";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import Language from "shared/src/Languages/LocateOurStoreLanguage.json";
import ContactUsServices from "../services/ContactUs.Services";
import MetaTags from "../components/utils/metatags/MetaTags";
import { BuyFooterData } from "./buy";
import CategoryService from "../services/CategoryService";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";

type StoreProps = {
  locateOurStoresList: Array<ILocateOurStoresModel>,
  direction: string,
  language: "in_en" | "ae_en" | "ae_ar",
  metaTags: ISEOModel,
  isSSR?: boolean,
  address: any
}

const fetchData = async (context: any): Promise<StoreProps> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
  let data: any = {
    OffsetStart: 0,
    RowsPerPage: null,
    SortOrder: '',
    SortOrderColumn: '',
    SearchText: null,
  };

  let storeList = await LocateOurStoresService.GetLocateOurStoresList(data, header.LanguageCode, header.CountryCode);
  let locateOurStoresList = await (storeList.status === 200 && storeList.data.Items);

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);

  // static meta tags (API call avoided)
  let metaTags = getStaticMeta(HelperConstant.metaPages.OurStores);

  return { locateOurStoresList, direction, language, metaTags, address }
}

function Store({ locateOurStoresList, direction, language, metaTags, isSSR, address }: StoreProps) {
  const [LocateOurStoresList, setLocateOurStoresList] = useState<StoreProps>({
    locateOurStoresList, direction, language, metaTags, address
  });
  let dataLocalization = Language[getDatalocalization(language)];
  const [footerData, setFooterData] = useState(BuyFooterData);

  useEffect(() => {
    if (!isSSR) {
      fetchData("").then(res => {
        setLocateOurStoresList({
          locateOurStoresList: res.locateOurStoresList,
          direction: res.direction,
          language: res.language,
          metaTags: res.metaTags,
          address: res.address
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
      <MetaTags metaTags={metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={language} />
      {/* ------- START ---------This is the top menu section for this flow------------ */}
      <Menu language={"ae_en"} direction={direction} />
      {/* --------------------------------------------- END ---- */}
      <MobileMenuSell ActiveId={1} />
      <div className="lg:px-16 px-5" dir={direction} lang={language}>
        <div className="max-w-[1300px] mx-auto pb-20 lg:pb-10">
          <Container>
            <div className="w-full mt-4">
              <h1 className="text-3xl font-semibold">{dataLocalization.Locate_our_Store}</h1>
              <div className="mt-6 flex flex-col gap-4">
                {LocateOurStoresList?.locateOurStoresList?.map((s, i) => {
                  return (
                    <div key={i} className="relative bg-white flex lg:flex-row items-center border border-[#efefef] px-4 lg:px-6 py-4 lg:py-5 rounded-lg">
                      <div className="flex w-full lg:flex-row md:flex-row flex-col justify-center lg:justify-start gap-10 ">
                        <div className="relative">
                          <img
                            src={`${HelperConstant.imageAPI}/uae/${s.Image}`}
                            alt=""
                            className="w-full lg:w-80 h-52 rounded-md object-contain"
                          />
                          {/* {s.City !== "" && (
                            <span className="absolute top-3 right-3 py-1 px-2 rounded-md backdrop-blur-sm bg-[#00000077] outline-none text-white text-sm">
                              {s.City}
                            </span>
                          )} */}
                        </div>
                        <div className="flex flex-col gap-4 md:w-[60%]">
                          <div className="flex justify-between items-center">
                            <h2 className="lg:text-3xl text-base font-semibold ">
                              {s.Area}, {s.CityName}
                            </h2>
                            {/* <img src={share.src} alt="" className="w-8" /> */}
                          </div>

                          <p className="lg:w-[90%] font-medium w-[100%] ">
                            {/* {s.Address}<br></br>
                              {s.CityName}, &nbsp;
                              {s.StateName} - {s.Pincode}
                            </p> : <p className="font-medium w-[100%] "> */}
                            {s.Address}<br></br>
                            {s.StateName}&nbsp;-&nbsp;{s.CountryName}
                          </p>
                          <h2 className="mt-2 lg:text-base text-sm font-medium">
                            {s.Timing}
                          </h2>
                          <div className="flex gap-5 mt-4 lg:mt-3 justify-between lg:justify-start text-[#EA002A] font-semibold">
                            <div className="flex gap-2 items-center">
                              <Image height={1000} width={1000} src={DirectionImage.src} alt="" className="w-5" />
                              <Link className="lg:text-base text-sm font-normal" href={s.Location} target="_blank">
                                {dataLocalization.Get_Direction}
                              </Link>
                            </div>
                            <div className="flex items-center gap-2">
                              <Image height={1000} width={1000} src={call.src} alt="" className="w-5" />
                              <Link className="lg:text-base text-sm font-normal" href={`tel:${s.Contact1}`}>
                                {dataLocalization.Call_Store}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* --------------- START-------------------Footer component for sell---------------------------------- */}
      {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} direction={LocateOurStoresList.direction} language={language} address={LocateOurStoresList.address} />}
      {/* ----------------------FOOTER component---------------------------- END ---------------------------- */}
    </>
  );
}

export default Store;