import { SSRDetection } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import MasterServices from "shared/src/services/Master.Services";
import { GetServerSideProps } from "next";
import CategoryService from "shared/src/services/CategoryService";

function generateSiteMap(URL: any, pages: Array<any>) {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>${URL}</loc>
       </url>
     </urlset>
   `;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  let language = SSRDetection(context as any, "lan");
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };

  let branddata = await CategoryService.getCategoryList();
  let selectBrand = await (branddata.status === 200 && branddata.data);

  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const findedURL = `${protocol}://${context.req.headers.host}${context.req.url}`;

  let url = findedURL.replace('/sitemap.xml', '');

  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap(url, selectBrand);

  context.res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {},
  };
}

export default function SiteMap() { }