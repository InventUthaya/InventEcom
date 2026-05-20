import { GetServerSideProps } from "next";
import { Direction, SSRDetection, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { ILocateOurStoresModel } from "shared/src/models/LocateOurStores";
import { ISEOModel } from "shared/src/models/SEO.Model";
import Store from "shared/src/pages/Store";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import LocateOurStoresService from "shared/src/services/LocateOurStores.Service";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";

type StoreProps = {
    locateOurStoresList: Array<ILocateOurStoresModel>,
    direction: string,
    language: "in_en" | "ae_en" | "ae_ar",
    metaTags: ISEOModel,
    address: any
}

const fetchData = async (context: any): Promise<StoreProps> => {
    let direction = context ? SSRDetection(context, "dir") : Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

    let data: any = {
        OffsetStart: 0,
        SortOrder: '',
        SortOrderColumn: '',
        SearchText: '',
    };

    let storeList = await LocateOurStoresService.GetLocateOurStoresList(data, header.LanguageCode, header.CountryCode);
    let locateOurStoresList = await (storeList.status === 200 && storeList.data?.Items)

    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data);

    // static meta tags (API call avoided)
    let metaTags = getStaticMeta(HelperConstant.metaPages.OurStores);
    return { locateOurStoresList, direction, language, metaTags, address }
}

export default function index({ locateOurStoresList, direction, language, metaTags, address }: StoreProps) {

    return (
        <Store locateOurStoresList={locateOurStoresList} direction={direction} language={language} metaTags={metaTags} isSSR={true} address={address}/>
    );
}

export const getServerSideProps: GetServerSideProps<StoreProps> = async (context) => {
    const { locateOurStoresList, direction, language, metaTags, address } = await fetchData(context);
    return { props: { locateOurStoresList, direction, language, metaTags, address } }
}
