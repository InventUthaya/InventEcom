import { ISEOModel } from "shared/src/models/SEO.Model";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";

const cdn = process.env.NEXT_PUBLIC_CDN_URL ?? "";
const publicUrl = process.env.NEXT_PUBLIC_PUBLIC_URL ?? "";

const buildDefaultMeta = (pageName: string): ISEOModel => {
  const slug = pageName?.toLowerCase() || "page";
  const title = `${pageName} | Invent`;
  const description = `Discover ${pageName} on Invent.`;
  const ogImage = `${cdn}/seo/default.png`;

  return {
    PageName: pageName,
    Title: title,
    Description: description,
    Keywords: "",
    OGTitle: title,
    OGType: "website",
    OGUrl: `${publicUrl}/${slug}`,
    OGImage: ogImage,
    OGDescription: description,
    TwitterCard: "summary_large_image",
    TwitterSite: "@dofyofficial",
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
};

const staticMeta: Record<string, ISEOModel> = {
  [HelperConstant.metaPages.Home]: {
    ...buildDefaultMeta(HelperConstant.metaPages.Home),
    Title: "Invent | Buy Premium Industrial Bearings & Parts",
    Description: "Shop certified bearings, tools and industrial components with warranty, great prices, and fast delivery.",
    OGDescription: "Shop certified bearings, tools and industrial components with warranty, great prices, and fast delivery."
  },
  [HelperConstant.metaPages.About]: {
    ...buildDefaultMeta(HelperConstant.metaPages.About),
    Title: "About Invent | Our Story",
    Description: "Learn about Invent and how we bring quality industrial bearings and components to you.",
    OGDescription: "Learn about Invent and how we supply precision industrial parts and bearings to you."
  },
  [HelperConstant.metaPages.ContactUs]: {
    ...buildDefaultMeta(HelperConstant.metaPages.ContactUs),
    Title: "Contact Us | Invent Industrial Parts",
    Description: "Get in touch with Invent for industrial bearings, tools and component enquiries."
  },
  [HelperConstant.metaPages.Faq]: {
    ...buildDefaultMeta(HelperConstant.metaPages.Faq),
    Title: "FAQ | Invent Industrial Parts",
    Description: "Frequently asked questions about our bearings, delivery, warranty and returns."
  },
  [HelperConstant.metaPages.PrivacyPolicy]: {
    ...buildDefaultMeta(HelperConstant.metaPages.PrivacyPolicy),
    Title: "Privacy Policy | Invent Industrial Parts",
    Description: "Read our privacy policy for Invent industrial parts and bearings platform."
  },
  [HelperConstant.metaPages.TermsOfUse]: {
    ...buildDefaultMeta(HelperConstant.metaPages.TermsOfUse),
    Title: "Terms of Use | Invent Industrial Parts",
    Description: "Terms and conditions for using Invent industrial parts and bearings platform."
  },
  [HelperConstant.metaPages.ViewOrder]: {
    ...buildDefaultMeta(HelperConstant.metaPages.ViewOrder),
    Title: "My Orders | Invent Industrial Parts",
    Description: "Track and manage your industrial parts and bearings orders."
  },
  [HelperConstant.metaPages.Cart]: {
    ...buildDefaultMeta(HelperConstant.metaPages.Cart),
    Title: "Cart | Invent Industrial Parts",
    Description: "Review your selected bearings and industrial components before checkout."
  },
  [HelperConstant.metaPages.Profile]: {
    ...buildDefaultMeta(HelperConstant.metaPages.Profile),
    Title: "My Profile | Invent Industrial Parts",
    Description: "Manage your Invent account and industrial parts order history."
  },
  [HelperConstant.metaPages.MyOrders]: {
    ...buildDefaultMeta(HelperConstant.metaPages.MyOrders),
    Title: "My Orders | Invent Industrial Parts",
    Description: "View and track all your industrial parts and bearing orders."
  },
  [HelperConstant.metaPages.BulkPurchase]: {
    ...buildDefaultMeta(HelperConstant.metaPages.BulkPurchase),
    Title: "Bulk Purchase | Invent Industrial Parts",
    Description: "Order bearings and industrial components in bulk at competitive prices."
  },
  [HelperConstant.metaPages.OurStores]: {
    ...buildDefaultMeta(HelperConstant.metaPages.OurStores),
    Title: "Our Stores | Invent Industrial Parts",
    Description: "Find Invent industrial parts and bearing stores near you."
  },
  [HelperConstant.metaPages.Blogs]: {
    ...buildDefaultMeta(HelperConstant.metaPages.Blogs),
    Title: "Blogs | Invent Industrial Parts",
    Description: "Read expert articles on bearings, industrial maintenance and component guides."
  },
  [HelperConstant.metaPages.RequestForDelivery]: {
    ...buildDefaultMeta(HelperConstant.metaPages.RequestForDelivery),
    Title: "Request Delivery | Invent Industrial Parts",
    Description: "Schedule delivery for your industrial parts and bearing orders."
  },
};

export const getStaticMeta = (pageName: string): ISEOModel =>
  staticMeta[pageName] ?? buildDefaultMeta(pageName);