import { GetServerSideProps } from 'next';
import React from 'react'
import { Direction, getUserLanguage, SSRDetection } from 'shared/src/components/helper/Helper';
import { ISEOModel } from 'shared/src/models/SEO.Model';
import CorporateTradeIn from 'shared/src/pages/CorporateTradeIn'
import ContactUsServices from 'shared/src/services/ContactUs.Services';
class CorporateInTrade {
  address?: { Address: string, Email: string, Phone: string, Timing: string, PromotionLinks: { faceBook: string, instagram: string, linkedIn: string, tikTok: string, youTube: string, Twitter: string } } =
    {
      Address: "", Email: "", Phone: "", Timing: "",
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
  isSSR?: boolean;
}

const fetchData = async (context:any): Promise<CorporateInTrade> => {
  let direction = Direction();
  let language = context ? SSRDetection(context, "lan") : getUserLanguage();
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

  let addressRes = await ContactUsServices.getAddress();
  let address = await (addressRes.status === 200 && addressRes.data);

  return { address, direction, language }
}
export default function index({ address, direction, language, metaTags, isSSR }: CorporateInTrade) {
  return (
    <CorporateTradeIn address={address} direction={''} language={'in_en'} isSSR={false} metaTags={metaTags}/>
  )
}
export const getServerSideProps: GetServerSideProps<CorporateInTrade> = async (context) => {
    const { address, direction, language } = await fetchData(context);
    return { props: { address, direction, language } }
}