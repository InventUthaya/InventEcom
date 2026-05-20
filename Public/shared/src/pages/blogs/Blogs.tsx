import React from "react";
import { useEffect, useState } from "react";
import Footer from "shared/src/components/utils/Footer";
import { IBlogModel } from "shared/src/models/Blog.Model";
import { Direction, getCookiesFromServer, getDatalocalization, getUserLanguage, getUserLocationForParam, SSRDetection } from "shared/src/components/helper/Helper";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { Capacitor } from "@capacitor/core";
import MetaTags from "shared/src/components/utils/metatags/MetaTags";
import DesktopSubMenu from "shared/src/components/utils/Menus/DesktopSubMenu";
import { MobileMenuSell } from "shared/src/components/utils/Menus/MobileSubMenu";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import BlogServices from "shared/src/services/Blog.Services";
import { useRouter } from "next/router";
import { Pagination } from "shared/src/components/utils/Pagination/Pagination";
import { BuyFooterData } from "../buy";
import CategoryService from "shared/src/services/CategoryService";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";

type BlogsData = {
    allBlogList: Array<IBlogModel>,
    direction: string,
    language: any,
    address: any,
    metaTags: any
    personId: any,
    recordsCount: number,
    isSSR?: boolean,
    zIndex?: any,
}

const fetchData = async (context: any, offsetStart: number, rowsPerPage: number): Promise<BlogsData> => {
    let direction = context ? SSRDetection(context, "dir") : Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
    let personId = getCookiesFromServer(context.req).personId != undefined ? getCookiesFromServer(context.req).personId : 0;
    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data);
    // static meta tags (API call avoided)
    let metaTags = getStaticMeta(HelperConstant.metaPages.Blogs);

    let data: any = {
        OffsetStart: offsetStart,
        RowsPerPage: rowsPerPage,
        SortOrder: 'desc',
        SortOrderColumn: 'EditionDate',
        SearchText: null,
        createdStartDate: null,
        createdEndDate: null
    };
    let BlogList = await BlogServices.GetAllBlogs(data, header.LanguageCode, header.CountryCode);
    let allBlogList = await (BlogList.status == 200 && BlogList.data.Items);
    let recordsCount = await (BlogList.status == 200 && BlogList.data.RecordsCount);

    return { allBlogList, address, direction, language, metaTags, personId, recordsCount }
}
export const Blogs = ({ zIndex, allBlogList, direction, language, address, metaTags, personId, isSSR, recordsCount }: BlogsData) => {
    const [blogData, setBlogData] = useState<BlogsData>({
        allBlogList, address, direction, language, metaTags, personId, recordsCount
    });
    const [loading, setLoading] = useState(false);
    const [offsetStart, setOffsetStart] = useState(0);
    const [isResponse, setIsResponse] = useState(false);
    const [footerData, setFooterData] = useState(BuyFooterData);
    const rowsPerPage = 9;

    const navigate = useRouter();

    useEffect(() => {
        // if (!isSSR) {
        const handleFetch = () => {
            setLoading(true)

            fetchData("", offsetStart, rowsPerPage).then(res => {
                setBlogData({
                    allBlogList: res.allBlogList,
                    address: res.address,
                    direction: res.direction,
                    language: res.language,
                    metaTags: res.metaTags,
                    personId: res.personId,
                    recordsCount: res.recordsCount
                });
                setLoading(false);
                setIsResponse(true);
            }).catch(() => setLoading(true));
        }
        handleFetch();
        // }
    }, [offsetStart]);

    const handlenavigate = (urltitle: any) => {
        setLoading(true);
        navigate.push(`/blog/${urltitle}`)
    }

    const fetchCategories = async () => {
        try {
            const response = await CategoryService.getCategoryList();
            if (response.status === 200 && response.data) {
                const allCategories = response.data;

                const popularCategories = allCategories.map((category: any) => ({
                    title: `Buy ${category.CategoryName}`,
                    link: `/buy/${category.EncryptedId}_Category`,
                }));

                setFooterData({
                    ...footerData,
                    PopularCategories: popularCategories,
                });
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <React.Fragment>

            <MetaTags metaTags={blogData.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={blogData.language} />
            <Menu />
            <DesktopSubMenu />
            <MobileMenuSell ActiveId={1} />
            {/* {loading && <Loader />} */}
            <div className="flex flex-col w-full items-center bg-white overflow-hidden">
                <main className="flex flex-col items-center max-w-[1300px] w-full bg-white p-8">
                    {((blogData?.allBlogList?.length === 0 && isResponse) || !blogData?.allBlogList) ? ("") : (
                        <div className="flex flex-col items-center gap-16 px-4 pt-2 pb-16">
                            <div className="text-center">
                                <h2 className="text-[#ea002a] font-semibold">BLOGS</h2>
                                <h1 className="text-[#101828] text-4xl font-semibold">
                                    The latest writings from our team
                                </h1>
                                <p className="text-[#475467] text-base">
                                    Tool and strategies modern teams need to help their companies
                                    grow.
                                </p>
                            </div>
                        </div>)}

                    {/* Blog Cards */}
                    {(!blogData?.allBlogList && loading === false) ? (
                        <div className="flex flex-col justify-center items-center h-46 sm:h-58 md:h-70 lg:h-78 px-4 py-8">
                            <h2 className="text-[#475467] text-base text-center mb-4">
                                Exciting updates are coming your way!
                            </h2>
                            <h2 className="text-[#475467] text-base text-center mb-4">
                                Stay tuned for insightful blogs, expert tips, and the latest trends.
                            </h2>
                            <h2 className="text-base text-center text-red-600">
                                Check back soon ...
                            </h2>
                        </div>) : (
                        <section className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-screen-xl px-4 lg:px-8 mb-4">
                            {blogData?.allBlogList?.map((s, i) => {
                                return (
                                    <article
                                        onClick={() => { handlenavigate(s.URLTitle) }}
                                        key={i}
                                        className="flex flex-col cursor-pointer w-80 bg-white rounded-lg overflow-hidden h-96 
               shadow-md transition-transform duration-500 hover:scale-105 hover:shadow-[0_10px_10px_rgba(128,128,128,0.5)]"
                                    >
                                        <img
                                            className="w-100 h-40 object-contain rounded-2xl cursor-pointer 
                       transition-transform duration-500 hover:scale-105"
                                            title={s?.ImageTitleName}
                                            alt={s?.ImageAltName}
                                            src={`${HelperConstant.imageAPI}/blog/${s?.Id}/${s?.ImagePath}`}
                                        />
                                        <div className="p-4 mb-2 overflow-hidden">
                                            <p className="text-xs text-[#475467]">{new Date(s.EditionDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}</p>
                                            <h3 className="text-xl py-2 font-semibold text-[#101828]">
                                                {s.Name}
                                            </h3>
                                            <p className="text-sm pb-2 text-[#475467]">
                                                {s.ShortDescription}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>)}
                    {blogData.recordsCount > 9 && <Pagination
                        recordsCount={blogData.recordsCount}
                        rowsPerPage={rowsPerPage}
                        offsetStart={offsetStart}
                        setOffsetStart={setOffsetStart} rowName={undefined}
                    />}
                </main>
            </div>
            {/* --------------- START-------------------Footer component for sell---------------------------------- */}
            {Capacitor.isNativePlatform() ? null : <Footer footerData={footerData} address={undefined} direction={undefined} language={undefined} />}
            {/* ----------------------FOOTER component---------------------------- END ---------------------------- */}

        </React.Fragment>
    );
};