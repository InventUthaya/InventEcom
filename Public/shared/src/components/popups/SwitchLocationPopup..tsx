import React, { useState } from 'react'
import { localStorageClearHandler, getUserLanguage, findWindow, resetLocation, NoCache } from '../helper/Helper';
import { useRecoilState } from 'recoil';
import IndiaIcon from "public/assets/images/lanugage/india.png"
import UAEIcon from "public/assets/images/lanugage/uae.png"
import Image from 'next/image';


type SwitchProps = {
    handleLocationChoice: (value: any) => void
}

function SwitchLocationPopup({ handleLocationChoice }: SwitchProps) {
    const country = [{
        title: "India",
        countryCode: "in_en",
        defaultLocationParam: "india",
        icon: IndiaIcon
    },
    {
        title: "UAE",
        countryCode: "ae_en",
        defaultLocationParam: "uae",
        icon: UAEIcon
    }];
    const country_code = findWindow() && localStorage.getItem("Ln");
    // const [__, setSwitchLocation] = useRecoilState(SwitchCountry);

    const switchLanguage = () => {
        let defaultPath = window.location.pathname.split('/').splice(2).toString().replaceAll(',', '/');
        localStorageClearHandler();
        if (getUserLanguage() == "ae_ar" || getUserLanguage() == "ae_en") {
            let constructedPath = window.location.pathname.split('/').splice(1)[0] = "in_en".toString().replaceAll(',', '/');
            window.location.href = `/${constructedPath}/${defaultPath}`;
        }
        else {
            let constructedPath = window.location.pathname.split('/').splice(1)[0] = "ae_en".toString().replaceAll(',', '/');
            window.location.href = `/${constructedPath}/${defaultPath}`;
        }
    }

    const selectCountry = (countryCode: any, defaultLocationParam: any) => {
        NoCache();
        findWindow() && localStorage.removeItem('Ln');
        findWindow() && localStorage.removeItem('userLocationId');
        findWindow() && localStorage.removeItem('userLocation');
        findWindow() && localStorage.removeItem('userLocation_ar');
        findWindow() && window.localStorage.setItem('Ln', countryCode);
        let constructedPath = window.location.pathname.split('/').splice(1)[0] = countryCode.toString().replaceAll(',', '/');
        window.location.href = `/${constructedPath}/${defaultLocationParam}`;
        handleLocationChoice(countryCode)
        // setSwitchLocation({
        //     IsSwitched: true,
        //     SwitchedLocation: countryCode,
        //     IsOpen: false
        // });
        localStorage.removeItem('geoStatus');
    }


    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"

        >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div
                className="bg-white rounded-2xl animate-slide-down z-10"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="overflow-hidden relative p-4">
                    <h1 className="text-lg sm:text-xl font-semibold">
                        Please Provide Your Country
                    </h1>
                    <h5 className="text-xs color-[#050505]">
                        Kindly Select Your Country to Use Our DOFY
                    </h5>
                    <div className="absolute right-0 top-0">
                        <svg
                            width="80"
                            height="120"
                            viewBox="0 0 100 146"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="134.566"
                                cy="116.501"
                                r="132.579"
                                transform="rotate(72.8457 134.566 116.501)"
                                stroke="url(#paint0_linear_109_77655)"
                                strokeWidth="2"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_109_77655"
                                    x1="34.6533"
                                    y1="29.6197"
                                    x2="117.842"
                                    y2="258.334"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#EA002A" />
                                    <stop offset="1" stopColor="#EA002A" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="w-[100px] lg:block hidden h-[100px] bg-[#1E54c9] rounded-[50%] absolute left-20 bottom-[60px] blur-[220px]"></div>
                    <div className="w-[120px] h-[100px] bg-[#EA002A] rounded-[50%] absolute right-10 bottom-[40px] blur-[100px] overflow-hidden"></div>
                </div>
                <div className="items-center justify-start p-4 gap-8">
                    <div className="w-full px-4">
                        {country.map((val, i) => (
                            <span className={`flex items-center rounded py-2 px-[18px] text-sm font-medium my-2 cursor-pointer ${val.countryCode == country_code ? 'text-[#EA002A] border border-[#EA002A]' : 'text-gray-600 border border-gray-200'}`} onClick={() => selectCountry(val.countryCode, val.defaultLocationParam)}>
                                <Image height={1000} width={1000} src={val.icon.src} alt="" className='w-[50px]' />
                                <span className='font-semibold text-xl ml-3'> {val.title}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SwitchLocationPopup
