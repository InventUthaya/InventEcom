import React, { useEffect, useRef, useState } from 'react'
import Container from '../components/animation/Container'
import Image from "next/image";
import { ISEOModel } from '../models/SEO.Model';
import { Direction, getUserLanguage, isIn, onKeyDown, restrictInput, SSRDetection } from '../components/helper/Helper';
import Language from "shared/src/Languages/CorporateLanguage.json";
import { SubmitHandler, useForm } from 'react-hook-form';
import { ICorporateTradeInModel } from '../models/CorporateTradeInModel';
import { HelperConstant } from '../components/helper/HelperConstant';
import ContactUsServices from '../services/ContactUs.Services';
import { MobileMenuSell } from '../components/utils/Menus/MobileSubMenu';
import Menu from '../components/utils/Menus/TopMenu';
import { Capacitor } from '@capacitor/core';
import Footer from '../components/utils/Footer';
import { BuyFooterData } from './buy';
import CategoryService from '../services/CategoryService';
import CommonService from '../services/CommonService';
import ConfirmaitonPopup from '../components/utils/Cards/confirmation-popup';
import DofyGeoService from '../services/DofyGeo.Service';
import SEOServices from '../services/SEO.Services';
import MetaTags from '../components/utils/metatags/MetaTags';
import { getStaticMeta } from "../components/utils/metatags/staticMeta";
class CorporateInTrade {
    address?: { Address: string, Email: string, Phone: string, Timing: string, PromotionLinks: { faceBook: string, instagram: string, linkedIn: string, tikTok: string, youTube: string, Twitter: string } } =
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
}
const fetchData = async (context: any): Promise<CorporateInTrade> => {
    let direction = Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data);

    // static meta tags (API call avoided)
    let metaTags = getStaticMeta(HelperConstant.metaPages.BulkPurchase);

    return { address, direction, language, metaTags }
}
const CorporateTradeIn = ({ address, direction, language, metaTags, isSSR }: CorporateInTrade) => {
    const call = `${HelperConstant.imageAPI}/uae/contact/call.png`
    const message = `${HelperConstant.imageAPI}/uae/contact/mess.png`
    const arrow = `${HelperConstant.imageAPI}/uae/test/arrow.png`
    const pattern = HelperConstant.emailPattern.pattern;
    const { register, handleSubmit, formState: { errors }, clearErrors, reset, setValue } = useForm<ICorporateTradeInModel>({});
    const [corporateData, setcorporateData] = useState<CorporateInTrade>({ address, direction, language, metaTags });
    const [footerData, setFooterData] = useState(BuyFooterData);
    const [disabled, setDisabled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const formRef = useRef(null);
    const [state, setState] = useState<Array<any>>([]);
    const [dofyGeoList, setDofyGeoList] = useState<Array<any>>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedCityName, setSelectedCityName] = useState("");
    const [selectedAreaName, setSelectedAreaName] = useState("");
    let dataLocalization = Language["in_en"];

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

    const handleClosePopup = () => {
        setShowPopup(false);
        reset();
        setSelectedCity("");
        setSelectedArea("");
        setSelectedCityName("");
        setSelectedAreaName("");
        setDofyGeoList([]);
    };

    const getStateList = () => {
        DofyGeoService.GetStateList(HelperConstant.serviceTypeId.SELL).then(res => {
            if (res.status === 200) {
                setState(res.data);
            }
        }).catch(e => {
            console.log(e);
        });
    };

    const cityHandler = (selectedCityId: any) => {
        setSelectedCity(selectedCityId);
        const selectedCity = state.find((city) => city.Id === Number(selectedCityId));
        if (selectedCity) {
            setSelectedCityName(selectedCity.Name);
            setValue("state", selectedCity.Name);
            GetAllDofyGeoBysearch(selectedCity.EncryptedId, '', '', '');
        }
    };

    const handleDofyGeoChange = (selectedGeoId: any) => {
        setSelectedArea(selectedGeoId);
        const selectedGeo = dofyGeoList.find((geo) => geo.Id === Number(selectedGeoId));
        if (selectedGeo) {
            setSelectedAreaName(selectedGeo.Name);
            setValue("district", selectedGeo.Name);
            clearErrors("district");
        }
    };

    const GetAllDofyGeoBysearch = (stateId?: any, searchText?: any, LanguageCode?: any, CountryCode?: any) => {
        DofyGeoService.GetDofyGeoListBysearch(stateId, searchText ? searchText : null, LanguageCode, CountryCode).then(res => {
            if (res.status === 200) {
                setDofyGeoList(res.data.Items);
            }
        }).catch(e => {
            console.log(e);
        });
    };

    const onCorporateSubmit: SubmitHandler<ICorporateTradeInModel> = (data: any) => {
        setDisabled(true);
        data.state = selectedCityName;
        data.district = selectedAreaName;
        data.active = true;
        data.MarkAsRead = true
        data.FeedbackStatusId = HelperConstant.FeedbackStatus.Open;
        CommonService.post("CorporateTradeIn", "SubmitCorporateTradeIn", data).then((res: any) => {
            if (res.status === 200) {
                setShowPopup(true);
            }
            setDisabled(false);
        }).catch((e: string) => {
            console.log(e);
            setDisabled(false);
        });
    };

    const convertToLowerCase = (text: string) => {
        if (text === text.toUpperCase()) {
            return text
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        return text;
    };

    useEffect(() => {
        if (!isSSR) {
            fetchData("").then(res => {
                setcorporateData({
                    address: res.address,
                    direction: res.direction,
                    language: res.language,
                    metaTags: res.metaTags,
                });
            });
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        getStateList();
    }, []);

    return (
        <>
            <MetaTags environment={process.env.NEXT_PUBLIC_ENV} language={corporateData.language} metaTags={corporateData.metaTags} />
            {showPopup && (
                <ConfirmaitonPopup handleClosePopup={handleClosePopup} />
            )}
            <Menu />
            <MobileMenuSell ActiveId={1} /><div className="max-w-[1300px] mx-auto pb-20">
                <Container>
                    <style>
                        {`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }

        .backdrop-blur-sm {
            backdrop-filter: blur(5px);
        }

        @keyframes slide-down {
            from {
            transform: translateY(-100%);
            opacity: 0;
            }
            to {
            transform: translateY(0);
            opacity: 1;
            }
        }

        .animate-slide-down {
            animation: slide-down 0.5s ease-out forwards;
        }
        `}
                    </style>

                    <div
                        className={`flex flex-col lg:flex-row  rounded-[12px] border border-[#EFEFEF]  bg-white ${showPopup ? "blur-sm" : ""}`}
                        ref={formRef}
                    >
                        <div className="relative w-full lg:w-1/2 px-8 py-10 overflow-hidden  bg-white min-h-[250px]">
                            <h1 className="lg:text-2xl 2xl:text-3xl text-base font-semibold">
                                {dataLocalization.Corporate_in_trade}
                            </h1>
                            <p className="font-light lg:text-md 2xl:text-base sm:text-base text-sm lg:mt-2">
                                {dataLocalization.Describe_our_queries_in_the_form_well_get_back_to_you_soon}
                            </p>
                            <div className="absolute lg:left-0 lg:top-[27%] left-[-50px] bottom-100">
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
                                        strokeWidth="2" />
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
                                            <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
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
                                        strokeWidth="2" />
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
                                            <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="w-[200px] lg:block hidden h-[200px] bg-[#1E54c9] rounded-[50%] absolute left-0 bottom-[-150px] blur-[500px]"></div>
                            <div className="w-[200px] h-[200px] bg-[#EA002A] rounded-[50%] absolute right-[-120px] bottom-[70px] blur-[221px]"></div>

                            <div className=" bg-[#ffffff] w-full lg:flex justify-between  gap-4 border-2-green absolute right-0 lg:py-10 py-6 px-6  bottom-0 ">
                                <div className={`w-full ${direction == "rtl" ? "ml-0" : "mr-40"} flex flex-col gap-2`}>
                                    <h3 className="text-md 2xl:text-base">{dataLocalization.For_business_queries}</h3>
                                    {/* <div className="flex">
                                        <div className={`flex ${direction == "rtl" ? "lg:border-l-2 " : "lg:border-r-2"} border-[#ea200a]`}>
                                            <Image height={1000} width={1000} src={call} alt="" className="w-[20px]" />
                                            <a href={`tel:${address?.Phone}`} className="text-sm 2xl:text-base mr-2 cursor-pointer">{address?.Phone}</a>
                                        </div>
                                        <div className="flex ml-2">
                                            <Image height={1000} width={1000} src={message} alt="" className="w-[20px]" />
                                            <a href={`mailto:${corporateData.address?.Email}`} className="text-sm 2xl:text-base cursor-pointer">{corporateData.address?.Email}</a>
                                        </div>
                                    </div> */}
                                    <div className="flex flex-col lg:flex-row">
                                        <div
                                            className={`flex items-center ${direction === "rtl" ? "lg:border-l-2" : "lg:border-r-2"
                                                } border-[#ea200a] mb-2 lg:mb-0`}
                                        >
                                            <Image
                                                height={1000}
                                                width={1000}
                                                src={call}
                                                alt=""
                                                className="w-[20px] mr-2"
                                            />
                                            <a
                                                href={`tel:${address?.Phone}`}
                                                className="text-sm 2xl:text-base mr-2 cursor-pointer"
                                            >
                                                {address?.Phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center ml-0 lg:ml-2">
                                            <Image
                                                height={1000}
                                                width={1000}
                                                src={message}
                                                alt=""
                                                className="w-[20px] mr-2"
                                            />
                                            <a
                                                href={`mailto:${corporateData.address?.Email}`}
                                                className="text-sm 2xl:text-base cursor-pointer"
                                            >
                                                {corporateData.address?.Email}
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="lg:w-[50%] flex flex-col  px-2 lg:px-12 py-10">
                            <form onSubmit={handleSubmit(onCorporateSubmit)}>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col">
                                        <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Name} <span className="text-red-600">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                                            {...register("name", { required: true, maxLength: 100 })} onChange={() => { clearErrors("name"); }} />
                                        {errors.name?.type === "required" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_Name}</p>}
                                        {errors.name?.type === "maxLength" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Your_Name_Must_Be_Within_50_words}</p>}
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Email_ID} <span className="text-red-600">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Enter your Email"
                                            className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                                            {...register("email", { required: true, pattern: pattern })}
                                            onChange={() => { clearErrors("email"); }} />
                                        {errors.email?.type === "required" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_Email_Address}</p>}
                                        {(errors.email?.type === "pattern") && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_valid_Email_Address}</p>}
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Mobile_number} <span className="text-red-600">*</span></label>
                                        <div className="flex items-center justify-start mt-2  bg-white border border-[#DFDFDF] px-2 rounded-lg">
                                            <div className="flex items-center">
                                                <input
                                                    placeholder="+91"
                                                    className="w-[40px] py-3 bg-transparent outline-0 border-0 text-sm"
                                                    value={"+91"} />
                                                <Image
                                                    height={1000} width={1000}
                                                    src={arrow}
                                                    alt=""
                                                    className="w-[8px] h-[10px] object-contain" />
                                            </div>
                                            <input
                                                inputMode="numeric"
                                                placeholder="Enter your mobile number"
                                                className="flex-1 lg:w-[400px] 2xl:w-[460px] h-[40px] p-2 lg:py-2 2xl:py-4 w-[300px] bg-transparent outline-0 border-0 rounded-lg px-5 py-6 outline-none border-[#DFDFDF] text-xs 2xl:text-smrounded-lg 2xl:text-sm"
                                                {...register("mobile", { required: true, minLength: 9, maxLength: 9, onChange: (e: any) => { restrictInput(e, 10); setValue("mobile", HelperConstant.numberOnlyRegex.regex.test(e.target.value) ? e.target.value : ""); clearErrors("mobile"); } })}
                                                onKeyDown={onKeyDown} />
                                        </div>
                                        {errors.mobile?.type === "required" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_Mobile_Number}</p>}
                                        {(errors.mobile?.type === "minLength" || errors.mobile?.type === "maxLength") && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_valid_Mobile_Number}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor="state"
                                                className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                            >
                                                City: <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                id="state"
                                                value={selectedCity}
                                                className="border text-xs 2xl:text-sm border-[#DFDFDF] bg-transparent rounded-md block w-full p-2.5"
                                                {...register("state", { required: true })}
                                                onChange={(e: any) => {
                                                    setValue("state", e.target.value);
                                                    cityHandler(e.target.value);
                                                }}
                                            >
                                                <option value="" disabled selected>Select City</option>
                                                {state.map((el, i) => (
                                                    <option key={i} value={el.Id}>{el.Name}</option>
                                                ))}
                                            </select>
                                            {errors.state && <p className="text-xs font-semibold text-red-700">Please select a City</p>}
                                        </div>
                                        <div className="flex flex-col  gap-2">
                                            <label
                                                htmlFor="districti"
                                                className="text-sm lg:text-md 2xl:text-base font-semibold capitalize"
                                            >
                                                Area/District:<span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                id="district"
                                                value={selectedArea}
                                                className="border text-xs 2xl:text-sm border-[#DFDFDF] bg-transparent rounded-md block w-full p-2.5"
                                                {...register("district", { required: true })}
                                                onChange={(e) => handleDofyGeoChange(e.target.value)}
                                            >
                                                <option value="" disabled selected>Select Area/District</option>
                                                {dofyGeoList.map((geo) => (
                                                    <option key={geo.Id} value={geo.Id}>{convertToLowerCase(geo.Name)}</option>
                                                ))}
                                            </select>
                                            {errors.district && <p className="text-xs text-red-700 font-semibold">Please Enter Area/District</p>}
                                        </div>
                                    </div>
                                    {/* <div className="flex-row lg:flex gap-3">
                                    <div className="flex flex-col lg:w-1/2">
                                        <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.State}</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your State"
                                            className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                                            {...register("state", { required: true, maxLength: 100 })}
                                            onChange={() => { clearErrors("state"); }} />
                                        {errors.state?.type === "required" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_State}</p>}
                                        {errors.state?.type === "maxLength" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Your_Location_Must_Be_Within_100_words}</p>}
                                    </div>

                                    <div className="flex flex-col lg:w-1/2">
                                        <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.District}</label>
                                        <input
                                            type="text"
                                            placeholder="District"
                                            className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                                            {...register("district", { required: true, maxLength: 100 })}
                                            onChange={() => { clearErrors("district"); }} />
                                        {errors.district?.type === "required" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_District}</p>}
                                        {errors.district?.type === "maxLength" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Your_Location_Must_Be_Within_100_words}</p>}
                                    </div>
                                </div> */}

                                    <div className="flex flex-col">
                                        <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.Subject} <span className="text-red-600">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Enter your query about"
                                            className="w-[100%] h-[40px] rounded-lg px-5 py-6 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm"
                                            {...register("subject", { required: true, maxLength: 250 })} onChange={() => { clearErrors("subject"); }} />
                                        {errors.subject?.type === "required" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_Subject}</p>}
                                        {(errors.subject?.type === "maxLength") && <p className="text-xs text-red-700 mt-1">{dataLocalization.Your_Subject_should_be_less_than_250_words}</p>}
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold capitalize text-sm 2xl:text-md">{dataLocalization.query} <span className="text-red-600">*</span></label>
                                        <textarea
                                            placeholder="Describe your Order Requirements in detail."
                                            className="w-[100%] h-[100px] rounded-lg px-5 py-3 outline-none border border-[#DFDFDF] text-xs 2xl:text-sm "
                                            {...register("description", { required: true, maxLength: 500 })} onChange={() => { clearErrors("description"); }} />
                                        {errors.description?.type === "required" && <p className="text-xs text-red-700 mt-1">{dataLocalization.Enter_Your_Query}</p>}
                                        {(errors.description?.type === "maxLength") && <p className="text-xs text-red-700 mt-1">{dataLocalization.Your_Queries_Must_Be_Within_500_words}</p>}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={disabled}
                                    className=" w-full p-[8px] 2xl:p-[10px] bg-[#EA002A] text-white rounded-[8px] mt-4"
                                >
                                    {dataLocalization.Submit}
                                </button>
                            </form>
                        </div>
                    </div >
                </Container >
            </div >
            {/* --------------- START-------------------Footer component for sell---------------------------------- */}
            {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} address={corporateData.address} direction={corporateData.direction} language={corporateData.language} />}
            {/* ----------------------FOOTER component---------------------------- END ---------------------------- */}
        </>
    )
}
export default CorporateTradeIn
