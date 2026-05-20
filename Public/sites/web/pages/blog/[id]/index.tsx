import { all } from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Direction, SSRDetection, findWindow, getCookiesFromServer, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { IBlogModel } from "shared/src/models/Blog.Model";
import { ISEOModel } from "shared/src/models/SEO.Model";
import { BlogDetail } from "shared/src/pages/blogDetail";
import { Blogs } from "shared/src/pages/blogs/Blogs";
import BlogServices from "shared/src/services/Blog.Services";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import SEOServices from "shared/src/services/SEO.Services";

type BlogsData = {
    allBlogList: IBlogModel,
    allBlogs: Array<IBlogModel>
    direction: string,
    language: "in_en" | "ae_en" | "ae_ar",
    address: any,
    metaTags: any
    personId: any,
    isSSR?: boolean
}

const fetchData = async (context: any): Promise<BlogsData> => {
    let direction = context ? SSRDetection(context, "dir") : Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
    let personId = getCookiesFromServer(context.req).personId != undefined ? getCookiesFromServer(context.req).personId : 0;
    let blogId: string = context ? context.query.id : findWindow() && window.location.pathname.split('/').at(-1) as string;
    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data);
    let metaTags = '';
    let blogurl: string = context ? context.query.id : findWindow() && window.location.pathname.split('/').at(-1) as string;
    let BlogList = await BlogServices.GetBlogDetailByBlogId(blogurl, header.LanguageCode, header.CountryCode);
    let allBlogList = BlogList.status === 200 ? BlogList.data : null;
    let data: any = {
        OffsetStart: 0,
        RowsPerPage: 9,
        SortOrder: 'desc',
        SortOrderColumn: 'EditionDate',
        SearchText: null,
        createdStartDate: null,
        createdEndDate: null
    };
    let AllBlogs = await BlogServices.GetAllBlogs(data, header.LanguageCode, header.CountryCode);
    let allBlogs = await (BlogList.status === 200 && AllBlogs.data.Items);
    return { allBlogList, allBlogs, address, direction, language, metaTags, personId }
}

export default function index({ allBlogList, allBlogs, direction, language, address, metaTags, personId, isSSR }: BlogsData) {
    return (
        <BlogDetail allBlogList={allBlogList} allBlogs={allBlogs} direction={direction} language={language} address={address} metaTags={metaTags} personId={personId} isSSR={true} />
    );
}

export const getServerSideProps: GetServerSideProps<BlogsData> = async (context) => {
    const { allBlogList, allBlogs, address, direction, language, metaTags, personId } = await fetchData(context);
    return { props: { allBlogList, allBlogs, address, direction, language, metaTags, personId } }
}
