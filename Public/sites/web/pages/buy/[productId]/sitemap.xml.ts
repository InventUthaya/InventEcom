import { SSRDetection } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import MasterServices from "shared/src/services/Master.Services";
import { GetServerSideProps } from "next";
import CategoryService from "shared/src/services/CategoryService";
import ProductService from "shared/src/services/Product.Service";
import { object } from "underscore";

function generateSiteMap(URL: any, pages: any, topDeals: any, brandName: any, price: any) {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>${URL}</loc>
       </url>
       ${pages.Items.map((item: any) => {
    return `
            <url>
             <loc>${URL}/${item.ProductId}</loc>
           </url>`
  }).join('')}
     </urlset>
   `;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let language = SSRDetection(context as any, "lan");
  let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
  let catagoryId = context.query.productId
  const id = catagoryId?.slice(0, catagoryId.indexOf('_'));
  let Productdata = await ProductService.getCategoryByFilter(id);
  let selectProduct = await (Productdata.status === 200 && Productdata.data);

  let TopDeals = await ProductService.getAllProductForFilter();
  let selectTopDeals = await (TopDeals.status === 200 && TopDeals.data);

  let BrandName = await CategoryService.getBrandList();
  let selectBrandName = await (BrandName.status === 200 && BrandName.data.Items);
  let Price = await CategoryService.getShopByPrice();
  let selectPrice = await (Price.status === 200 && Price.data);
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const findedURL = `${protocol}://${context.req.headers.host}${context.req.url}`;

  let url = findedURL.replace('/sitemap.xml', '');

  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap(url, selectProduct, selectTopDeals, selectBrandName, selectPrice);

  context.res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {},
  };
}

export default function SiteMap() { }