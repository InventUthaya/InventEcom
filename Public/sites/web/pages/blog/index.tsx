import { GetServerSideProps } from "next";
import { Direction, SSRDetection, getCookiesFromServer, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { IBlogModel } from "shared/src/models/Blog.Model";
import { ISEOModel } from "shared/src/models/SEO.Model";
import { Blogs } from "shared/src/pages/blogs/Blogs";
import BlogServices from "shared/src/services/Blog.Services";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";

type BlogsData = {
    allBlogList: Array<IBlogModel>,
    direction: string,
    language: "in_en" | "ae_en" | "ae_ar",
    address: any,
    metaTags: any
    personId: any,
    recordsCount: number,
    isSSR?: boolean
}

const fetchData = async (context: any): Promise<BlogsData> => {
    let direction = context ? SSRDetection(context, "dir") : Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
    let personId = getCookiesFromServer(context.req).personId != undefined ? getCookiesFromServer(context.req).personId : 0;

    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data);
    // static meta tags (API call avoided)
    let metaTags = getStaticMeta(HelperConstant.metaPages.Blogs);

    let data: any = {
        OffsetStart: 0,
        RowsPerPage: 9,
        SortOrder: 'desc',
        SortOrderColumn: 'EditionDate',
        SearchText: null,
        createdStartDate: null,
        createdEndDate: null
    };
    let BlogList = await BlogServices.GetAllBlogs(data, header.LanguageCode, header.CountryCode);
    let allBlogList = await (BlogList.status === 200 && BlogList.data.Items);
    let recordsCount = await (BlogList.status === 200 && BlogList.data.RecordsCount);

    return { allBlogList, address, direction, language, metaTags, personId, recordsCount }
}

export default function index({ allBlogList, direction, language, address, metaTags, personId, recordsCount, isSSR }: BlogsData) {
    return (
        <Blogs allBlogList={allBlogList} direction={direction} language={language} address={address} recordsCount={recordsCount} metaTags={metaTags} personId={personId} isSSR={false} />
    );
}

// export const getServerSideProps: GetServerSideProps<BlogsData> = async (context) => {
//     const { allBlogList,address, direction, language, metaTags, personId,recordsCount } = await fetchData(context);
//     return { props: { allBlogList, address, direction, language, metaTags, personId,recordsCount } }
// }