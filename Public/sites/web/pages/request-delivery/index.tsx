import { GetServerSideProps } from "next";
import { Direction, SSRDetection, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import RequestComponent from "shared/src/pages/request";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";

class RequestDelivery {
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
    metaTags: any;
}

const fetchData = async (context: any): Promise<RequestDelivery> => {
    let direction = context ? SSRDetection(context, "dir") : Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data);

    // static meta tags (API call avoided)
    let metaTags = getStaticMeta(HelperConstant.metaPages.RequestForDelivery);

    return { address, direction, language, metaTags }
}
export default function index({ address, direction, language, metaTags }: RequestDelivery) {

    return (
        <RequestComponent address={address} direction={direction} language={language} metaTags={metaTags} isSSR={true} />
    );
}
export const getServerSideProps: GetServerSideProps<RequestDelivery> = async (context) => {
    const { address, direction, language, metaTags } = await fetchData(context);
    return { props: { address, direction, language, metaTags } }
}
