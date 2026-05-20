import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { ISEOModel } from "../models/SEO.Model";

class SEOServices {
    private serviceName = '/SEO';

    private defaultMeta(pageName: string): ISEOModel {
        const pageSlug = pageName?.toLowerCase() || "page";
        const title = `${pageName} | Invent`;
        const description = `Discover ${pageName} on Invent.`;
        const ogImage = `${process.env.NEXT_PUBLIC_CDN_URL ?? ""}/seo/default.png`;
        const urlBase = process.env.NEXT_PUBLIC_PUBLIC_URL ?? "";

        return {
            PageName: pageName,
            Title: title,
            Description: description,
            Keywords: "",
            OGTitle: title,
            OGType: "website",
            OGUrl: `${urlBase}/${pageSlug}`,
            OGImage: ogImage,
            OGDescription: description,
            TwitterCard: "summary_large_image",
            TwitterSite: "@inventofficial",
            TwitterTitle: title,
            TwitterDescription: description,
            TwitterImage: ogImage,
            SeocontentTitle: "",
            SeoContent: "",
            Id: 0,
            Created: null,
            CreatedBy: 0,
            Active: true,
            Modified: null,
            ModifiedBy: 0,
            IsValid: true,
            ProductName: "",
            BrandName: ""
        };
    }

    private readonly staticMeta: Record<string, ISEOModel> = {
        [HelperConstant.metaPages.Home]: {
            ...this.defaultMeta(HelperConstant.metaPages.Home),
            Title: "Invent | Shop Premium Fashion & Apparel",
            Description: "Discover stylish, high-quality clothing at great prices with fast and reliable delivery.",
            OGDescription: "Shop premium fashion apparel with quality craftsmanship and fast delivery."
        },
        
        [HelperConstant.metaPages.About]: {
            ...this.defaultMeta(HelperConstant.metaPages.About),
            Title: "About Invent | Our Fashion Story",
            Description: "Learn about Invent and our journey to bring quality, style, and comfort to everyday fashion.",
            OGDescription: "Discover the story behind Invent and our commitment to modern, accessible fashion."
        },
        
        [HelperConstant.metaPages.ContactUs]: this.defaultMeta(HelperConstant.metaPages.ContactUs),
        [HelperConstant.metaPages.Faq]: this.defaultMeta(HelperConstant.metaPages.Faq),
        [HelperConstant.metaPages.PrivacyPolicy]: this.defaultMeta(HelperConstant.metaPages.PrivacyPolicy),
        [HelperConstant.metaPages.TermsOfUse]: this.defaultMeta(HelperConstant.metaPages.TermsOfUse),
        [HelperConstant.metaPages.ViewOrder]: this.defaultMeta(HelperConstant.metaPages.ViewOrder),
        [HelperConstant.metaPages.OurStores]: this.defaultMeta(HelperConstant.metaPages.OurStores),
        [HelperConstant.metaPages.Blogs]: this.defaultMeta(HelperConstant.metaPages.Blogs),
        [HelperConstant.metaPages.Cart]: this.defaultMeta(HelperConstant.metaPages.Cart),
        [HelperConstant.metaPages.Profile]: this.defaultMeta(HelperConstant.metaPages.Profile),
        [HelperConstant.metaPages.MyOrders]: this.defaultMeta(HelperConstant.metaPages.MyOrders),
        [HelperConstant.metaPages.BulkPurchase]: this.defaultMeta(HelperConstant.metaPages.BulkPurchase),
        [HelperConstant.metaPages.RequestForDelivery]: this.defaultMeta(HelperConstant.metaPages.RequestForDelivery),
    };

    GetSEOList(pageName: string, _languageCode?: any, _countryCode?: any) {
        const meta = this.staticMeta[pageName] ?? this.defaultMeta(pageName);
        return Promise.resolve({ status: 200, data: meta });
    }
}

export default new SEOServices();