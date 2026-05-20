import { GetServerSideProps } from "next";
import { Direction, SSRDetection, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { ISEOModel } from "shared/src/models/SEO.Model";
import PrivacyPolicyComponent from "shared/src/pages/PrivacyPolicy";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";

class PrivacyPolicyProps {
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
    metaTags: ISEOModel = {} as ISEOModel;
}
const fetchData = async (context: any): Promise<PrivacyPolicyProps> => {
    let direction = context ? SSRDetection(context, "dir") : Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data );

    // static meta tags (API call avoided)
    let metaTags = getStaticMeta(HelperConstant.metaPages.PrivacyPolicy);

    return { address, direction, language, metaTags }
}

export default function index({ direction, language, address, metaTags }: PrivacyPolicyProps) {

    return (
        <PrivacyPolicyComponent address={address} direction={direction} language={language} isSSR={true} metaTags={metaTags}/>
    );
}

export const getServerSideProps: GetServerSideProps<PrivacyPolicyProps> = async (context) => {
    const { address, direction, language, metaTags } = await fetchData(context);
    return { props: { address, direction, language, metaTags} }
}