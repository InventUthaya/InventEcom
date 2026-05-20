import { GetServerSideProps } from "next";
import { Direction, SSRDetection, getUserLanguage } from "shared/src/components/helper/Helper";
import { IFooterModel } from "shared/src/models/Footer.Model";
import ProductSearch from "shared/src/pages/buy/chooseProduct/ProductSearch";
import ContactUsServices from "shared/src/services/ContactUs.Services";

class FooterProps {
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
    footerData?: IFooterModel | undefined;
}

const fetchData = async (context: any): Promise<FooterProps> => {
    let direction = context ? SSRDetection(context, "dir") : Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data);
    
    return { address, direction, language }
}
export default function index({ address, direction, language }: FooterProps) {

    return (
        <ProductSearch address={address} direction={direction} language={language} />
    );
}

export const getServerSideProps: GetServerSideProps<FooterProps> = async (context) => {
    const { address, direction, language } = await fetchData(context);
    return { props: { address, direction, language } }
}