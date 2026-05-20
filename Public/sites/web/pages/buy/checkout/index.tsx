import { GetServerSideProps } from "next";
import { Direction, getUserLanguage } from "shared/src/components/helper/Helper";
import BuyCheckoutComponent from "shared/src/pages/buy/checkout/buycheckout";

type ProductSearchProps = {
    direction: string,
    language: "in_en" | "ae_en" | "ae_ar",
    // metaTags: ISEOModel
}

const fetchData = async (): Promise<ProductSearchProps> => {
    let direction =  Direction();
    let language = getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

    // let metaTagsData = await SEOServices.GetSEOList(HelperConstant.metaPages.PrivacyPolicy, header.LanguageCode, header.CountryCode);
    // let metaTags = await (metaTagsData.status === 200 && metaTagsData.data);

    return { direction, language }
}

export default function index({ direction, language }: ProductSearchProps) {

    return (
        <BuyCheckoutComponent direction={direction} language={language} isSSR={true} />
    );
}

export const getServerSideProps: GetServerSideProps<ProductSearchProps> = async (context) => {
    const { direction, language } = await fetchData();
    return { props: { direction, language } }
}