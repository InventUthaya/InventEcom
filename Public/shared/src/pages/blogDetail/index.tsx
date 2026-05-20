import React from "react";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import MetaTags from "shared/src/components/utils/metatags/MetaTags";
import DesktopSubMenu from "shared/src/components/utils/Menus/DesktopSubMenu";
import { MobileMenuSell } from "shared/src/components/utils/Menus/MobileSubMenu";
import Menu from "shared/src/components/utils/Menus/TopMenu";
import BlogServices from "shared/src/services/Blog.Services";
import Footer from "shared/src/components/utils/Footer";
import { IBlogModel } from "shared/src/models/Blog.Model";
import { Direction, findWindow, getCookiesFromServer, getDatalocalization, getUserLanguage, SSRDetection } from "shared/src/components/helper/Helper";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import Language from "shared/src/Languages/AboutLanguage.json";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { facebook, XsocialIcons, LinkedInIcon } from "shared/src/components/utils/Footer/assets";
import PageNotFound from "shared/src/components/utils/PageNotFound/PageNotFound";
import { BuyFooterData } from "../buy";

type BlogsData = {
    allBlogList: IBlogModel,
    allBlogs: Array<IBlogModel>
    direction: string,
    language: any,
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
    // let metaTagsRes = await SEOServices.GetSEOList(HelperConstant.metaPages.Blogs, header.LanguageCode, header.CountryCode);
    let metaTags = "";
    let blogurl: string = context ? context.query.id : findWindow() && window.location.pathname.split('/').at(-1) as string;

    let BlogList = await BlogServices.GetBlogDetailByBlogId(blogurl, header.LanguageCode, header.CountryCode);
    let allBlogList = await (BlogList.status === 200 && BlogList.data);

    let data: any = {
        OffsetStart: 0,
        RowsPerPage: 9,
        SortOrder: 'desc',
        SortOrderColumn: 'EditionDate',
        SearchText: null,
        createdStartDate: null,
        createdEndDate: null,
        StatusId: null,
        Ispublic: true
    };
    let AllBlogs = await BlogServices.GetAllBlogs(data, header.LanguageCode, header.CountryCode);
    let allBlogs = await (AllBlogs.status === 200 && AllBlogs.data.Items);

    return { allBlogList, allBlogs, address, direction, language, metaTags, personId }
}

export const BlogDetail = ({ allBlogList, allBlogs, direction, language, address, metaTags, personId, isSSR }: BlogsData) => {
    const [blogData, setBlogData] = useState<BlogsData>({
        allBlogList, allBlogs, address, direction, language, metaTags, personId
    });
    const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
        null
    );
    const [copied, setCopied] = useState(false);
    let dataLocalization = Language[getDatalocalization(language)];
    const navigate = useRouter();
    const { id } = navigate.query;
    const [cardsPerView, setCardsPerView] = useState(2.15);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const updateCardsPerView = () => {
            setCardsPerView(window.innerWidth >= 720 ? 3.15 : 2.15);
        };

        updateCardsPerView();

        window.addEventListener("resize", updateCardsPerView);

        return () => {
            window.removeEventListener("resize", updateCardsPerView);
        };
    }, []);

    useEffect(() => {
        if (!isSSR) {
            setLoading(true)
            fetchData("").then(async res => {
                await setBlogData({
                    allBlogList: res.allBlogList,
                    allBlogs: res.allBlogs,
                    address: res.address,
                    direction: res.direction,
                    language: res.language,
                    metaTags: res.metaTags,
                    personId: res.personId
                });
                setLoading(false)
            });
        }
    }, [id]);

    const getBlogDetailsByBlogId = async (urltitle: any) => {
        setLoading(true)
        let language = getUserLanguage();
        let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
        let BlogList = await BlogServices.GetBlogDetailByBlogId(urltitle, header.LanguageCode, header.CountryCode);
        let allBlogList = await (BlogList.status === 200 && BlogList.data);
        setBlogData({ ...blogData, allBlogList })
        window.scrollTo(0, 0)
        setLoading(false)

    }

    const toggleAnswer = (index: number) => {
        setOpenQuestionIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    const handlenavigate = () => {
        navigate.push(`/${getUserLanguage()}/blog`)
    }
    const handlenavigateblogdetails = (urltitle: any) => {
        if (Capacitor.isNativePlatform()) {
            getBlogDetailsByBlogId(urltitle)
        }
        else {
            setLoading(true)
            window.location.href = (`/blog/${urltitle}`);
        }

    }
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        });
    };

    return (
        <React.Fragment>
            <MetaTags metaTags={blogData.metaTags} environment={process.env.NEXT_PUBLIC_ENV} language={blogData.language} />
            <Menu />
            <DesktopSubMenu />
            <MobileMenuSell ActiveId={1} />
            {/* -------------------------------------------------- END ---- */}
            {allBlogList.Id != 0 ? (
                <div className="flex flex-col w-full items-center bg-white overflow-hidden p-7 md:mb-0 mb-20">
                    {/* Main Content */}
                    <main className="w-full  flex-col justify-center max-w-[1300px] items-center ">

                        {/* Hero Section */}
                        <section className="flex flex-wrap flex-col-reverse md:flex-row w-full overflow-hidden">
                            {/* Left Section */}
                            <div className="flex flex-col justify-center px-4 sm:px-10 w-full md:w-1/2 mt-5">
                                <span className="text-sm text-gray-500">
                                    {new Date(blogData?.allBlogList?.EditionDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-2">
                                    {blogData?.allBlogList?.Name}
                                </h1>
                                <p className="text-base sm:text-lg text-gray-600 mt-4 md:hidden lg:block">
                                    {blogData?.allBlogList?.ShortDescription}
                                </p>
                            </div>

                            {/* Right Section */}
                            <div className="w-full md:w-1/2 h-50 md:h-60">
                                <img
                                    className="w-full h-60 md:h-full object-contain md:mt-5"
                                    alt={blogData?.allBlogList?.ImageAltName}
                                    title={blogData?.allBlogList?.ImageTitleName}
                                    src={`${HelperConstant.imageAPI}/blog/${blogData?.allBlogList?.Id}/${blogData?.allBlogList?.ImagePath}`}
                                />
                            </div>
                            <p className="hidden md:block lg:hidden text-base sm:text-lg text-gray-600 mt-4 p-4 sm:p-6 md:p-10">
                                {blogData?.allBlogList?.ShortDescription}
                            </p>
                        </section>


                        {/* Content Section */}
                        <div dangerouslySetInnerHTML={{ __html: blogData?.allBlogList?.ContentDetails }} className="p-4 sm:p-6 md:p-10 blog-detail-inline">
                        </div>

                        <div className="w-full p-4 px-10 ">
                            {blogData?.allBlogList?.BlogFAQ?.length > 0 && (
                                <>
                                    <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
                                    <div className="space-y-4">
                                        {blogData?.allBlogList?.BlogFAQ.map((faq, index) => (
                                            <div
                                                key={index}
                                                className="w-full border rounded-lg p-4 shadow-md bg-white"
                                            >
                                                <div
                                                    className="flex items-center justify-between cursor-pointer"
                                                    onClick={() => toggleAnswer(index)}
                                                >
                                                    <h2 className="text-lg font-medium">{faq.Question}</h2>
                                                    {openQuestionIndex === index ? (
                                                        <ChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5" />
                                                    )}
                                                </div>
                                                {openQuestionIndex === index && (
                                                    <>
                                                        <hr />
                                                        <p className="mt-2 text-gray-600 text-wrap">{faq.Answer}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 my-3 items-center  flex-wrap justify-center md:justify-end px-10">
                            <span className="text-sm mt-2 text-gray-600">Share this post</span>
                            <button
                                onClick={copyLink}
                                className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                <span className={copied ? "text-green-700 font-semibold" : ""}>
                                    {copied ? "Copied!" : "Copy link"}
                                </span>
                            </button>
                            <div className="flex ">
                                {/* Twitter Icon */}
                                {(blogData?.allBlogList?.XPath && blogData?.allBlogList?.XPath !== "string" && blogData?.allBlogList?.XPath.trim() !== "") && <a href={blogData?.allBlogList.XPath} target="_blank" rel="noopener noreferrer" className="p-2.5 ">
                                    <img src={XsocialIcons.src} className="social-icon" alt="" />
                                </a>}

                                {/* Facebook Icon */}
                                {(blogData?.allBlogList?.FacebookPath && blogData?.allBlogList?.FacebookPath !== "string" && blogData?.allBlogList?.FacebookPath.trim() !== "") && <a href={blogData?.allBlogList.FacebookPath} target="_blank" rel="noopener noreferrer" className="p-2.5">
                                    <img src={facebook.src} className="social-icon" alt="" />
                                </a>}

                                {/* LinkedIn Icon */}
                                {(blogData?.allBlogList?.LinkedInPath && blogData?.allBlogList?.LinkedInPath !== "string" && blogData?.allBlogList?.LinkedInPath.trim() !== "") && <a href={blogData?.allBlogList.LinkedInPath} target="_blank" rel="noopener noreferrer" className="p-2.5">
                                    <img src={LinkedInIcon.src} className="social-icon" alt="" />
                                </a>}
                            </div>

                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                spaceBetween={20}
                                slidesPerView={1}
                                breakpoints={{
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                }}
                                style={{ padding: "30px" }}
                            >
                                {blogData?.allBlogs?.map((writing, index) => (
                                    <SwiperSlide key={index} onClick={() => { handlenavigateblogdetails(writing.URLTitle) }}>
                                        <div className="bg-white shadow-lg rounded-lg cursor-pointer overflow-hidden h-full flex flex-col">
                                            <img
                                                className="w-full h-56 object-cover cursor-pointer"
                                                title={writing?.ImageTitleName}
                                                alt={writing?.ImageAltName}
                                                src={`${HelperConstant.imageAPI}/blog/${writing.Id}/${writing.ImagePath}`}
                                            />
                                            <div className="p-4 flex flex-col flex-grow">
                                                <p className="text-sm text-gray-500">
                                                    {new Date(writing.EditionDate).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}</p>
                                                <h3 className="text-xl py-2 font-semibold text-[#101828]">
                                                    {writing.Name}
                                                </h3>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </main>
                </div >) : <PageNotFound />}
            {/* --------------- START-------------------Footer component for sell---------------------------------- */}
            {Capacitor.isNativePlatform() ? null : <Footer footerData={BuyFooterData} address={undefined} direction={undefined} language={undefined} />}
            {/* ----------------------FOOTER component---------------------------- END ---------------------------- */}
        </React.Fragment >
    );
};