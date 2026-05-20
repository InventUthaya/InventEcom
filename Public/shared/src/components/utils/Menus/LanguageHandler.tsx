import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getUserLanguage } from '../../helper/Helper';
import flag_toggle from "public/assets/images/lanugage/language_switch_flag.png"

// SVG Icons for EN and Dubai
const DubaiIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="-4" width="52" height="26" fill="url(#pattern0_1608_8374)" />
        <defs>
            <pattern
                id="pattern0_1608_8374"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
            >
                <use
                    href="#image0_1608_8374"
                    transform="scale(0.00384615 0.00769231)"
                />
            </pattern>
            <image
                id="image0_1608_8374"
                width="260"
                height="130"
                href={flag_toggle.src}
            />
        </defs>
    </svg>
);

const LanguageHandler = () => {
    let router = useRouter();

    const languageHandler = () => {
        let defaultPath = window.location.pathname.split('/').splice(2).toString().replaceAll(',', '/');
        if (getUserLanguage() == "ae_ar") {
            let constructedPath = window.location.pathname.split('/').splice(1)[0] = "ae_en".toString().replaceAll(',', '/');
            localStorage.setItem("Ln", 'ae_en');
            window.location.href = `/${constructedPath}/${defaultPath}`;
            // router.push(`/${constructedPath}/${defaultPath}`)
        }
        else {
            let constructedPath = window.location.pathname.split('/').splice(1)[0] = "ae_ar".toString().replaceAll(',', '/');
            localStorage.setItem("Ln", 'ae_ar');
            window.location.href = `/${constructedPath}/${defaultPath}`;
            // router.push(`/${constructedPath}/${defaultPath}`)
        }
    } 

    return (
        <div
            className="flex justify-center items-center cursor-pointer"
            onClick={() => languageHandler()}
        >
            <div className="overflow-hidden rounded-full shadow-sm">
                <DubaiIcon />
            </div>
            <span className="mx-2">{getUserLanguage() == "ae_en" ? "أر" : "En"}</span>
        </div>

    )
}

export default LanguageHandler
