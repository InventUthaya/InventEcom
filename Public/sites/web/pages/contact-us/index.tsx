import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { Direction, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { IContactUsConfigModel } from "shared/src/models/ContactUsConfigModel.Model";
import { ISEOModel } from "shared/src/models/SEO.Model";
import Contact from "shared/src/pages/Contact";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import ContactUsConfigServices from "shared/src/services/ContactUsConfig.Services";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";

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
    contactUsConfig: IContactUsConfigModel = {} as IContactUsConfigModel;

}

const fetchData = async (): Promise<ContactUs> => {
    let direction = Direction();
    let language = getUserLanguage();
    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data);

    let contactUsConfigs = await ContactUsConfigServices.GetContactUsConfigList();
    let contactUsConfig = await (contactUsConfigs.status === 200 && contactUsConfigs.data)

    // static meta tags (API call avoided)
    let metaTags = getStaticMeta(HelperConstant.metaPages.ContactUs);

    return { address, direction, language, contactUsConfig, metaTags };
};

export default function Index({ address, direction, language, contactUsConfig, metaTags }: ContactUs) {

    return (
        <Contact address={address} direction={direction} language={language} isSSR={true} contactUsConfig={contactUsConfig} metaTags={metaTags} />
    );
}

export const getServerSideProps: GetServerSideProps<ContactUs> = async () => {
    const { address, direction, language, contactUsConfig, metaTags } = await fetchData();
    return { props: { address, direction, language, contactUsConfig, metaTags } }
}