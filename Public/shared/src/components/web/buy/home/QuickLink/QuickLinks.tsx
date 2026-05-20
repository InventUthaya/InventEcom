import Link from 'next/link';
import React from 'react'
import Language from "shared/src/Languages/Footer.json";
import { getDatalocalization, getUserLanguage, getUserLocationForParam } from 'shared/src/components/helper/Helper';
import { IFooterModel } from 'shared/src/models/Footer.Model';

type QuickLinksData = {
    direction: string,
    language: "in_en" | "ae_en" | "ae_ar",
    footerData?: IFooterModel | undefined;
}

function QuickLinks({ direction, language, footerData }: QuickLinksData) {
    let dataLocalization = Language[getDatalocalization(language)];
    return (
        <div className="w-full" dir={direction} lang={language}>
            <p className="text-lg lg:text-2xl font-medium">{dataLocalization.Quick_Links}</p>
            <div
                className="flex flex-wrap justify-start mt-4"
            >
                {footerData?.PopularCategories.map((e: any) => (
                    <Link className={`mx-2 text-[#939393] transition ease-in-out hover:scale-110 hover:font-semibold hover:duration-300`} key={e.title} href={e.link}>
                        {e.title}</Link>
                ))}
            </div>
        </div>
        
    )
}

export default QuickLinks