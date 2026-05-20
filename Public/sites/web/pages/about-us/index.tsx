import { GetServerSideProps } from "next";
import { Direction, getCookiesFromServer, getUserLanguage, SSRDetection } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { ISEOModel } from "shared/src/models/SEO.Model";
import AboutUs from "shared/src/pages/AboutUs";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";

class AboutUsData {
  address: { Address: string, Email: string, Phone: string, PromotionLinks: { faceBook: string, instagram: string, linkedIn: string, tikTok: string, youTube: string, Twitter: string } } =
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
  direction: string = "";
  language: "in_en" | "ae_en" | "ae_ar" = "in_en";
  metaTags?: ISEOModel = {} as ISEOModel;
  personId?: any;
  isSSR?: boolean;
}
const fetchData = async (context: any): Promise<AboutUsData> => {
  let direction = context ? SSRDetection(context, "dir") : Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  let personId = getCookiesFromServer(context.req).personId != undefined ? getCookiesFromServer(context.req).personId : 0;

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);
  // static meta tags (API call avoided)
  let metaTags = getStaticMeta(HelperConstant.metaPages.About);

  return { address, direction, language, personId, metaTags }
}

export default function index({ direction, language, address, personId, isSSR, metaTags }: AboutUsData) {
  return (
    <AboutUs direction={direction} language={language} address={address} personId={personId} isSSR={true} metaTags={metaTags} />
  );
}
export const getServerSideProps: GetServerSideProps<AboutUsData> = async (context) => {
  const { address, direction, language, personId, metaTags } = await fetchData(context);
  return { props: { address, direction, language, personId, metaTags } }
}