import { GetServerSideProps } from "next";
import { SiteMapGenerator } from "shared/src/components/sitemap/SiteMapGenerator";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const URL = context.req.headers.host;
    const environment = process.env.NEXT_PUBLIC_ENV as "testing" | "production" | "local";
    const isIN = URL?.includes('in');
    const isAE = URL?.includes('ae');
    const productionURLIndia = 'http://localhost:3000';
    const productionURLDubai_EN = 'http://localhost:3000';
    const productionURLDubai_AR = 'http://localhost:3000';
    const devURLIndia = 'http://dofyecommuat.inventsoftlabs.in';
    const devURLDubai_EN = 'http://dofyecommuat.inventsoftlabs.in';
    const devURLDubai_AR = 'http://dofyecommuat.inventsoftlabs.in';
    const localurl = 'http://localhost:3000';

    let sitemap: string = "";

    if (environment == "local") {
        sitemap = await SiteMapGenerator(localurl, context);
    }

    if (isAE && environment == "testing") {
        sitemap = await SiteMapGenerator(devURLDubai_AR, context);
    }

    if (isAE && environment == "testing") {
        sitemap = await SiteMapGenerator(devURLDubai_EN, context);
    }

    if (isIN && environment == "testing") {
        sitemap = await SiteMapGenerator(devURLIndia, context);
    }

    if (isAE && environment == "production") {
        sitemap = await SiteMapGenerator(productionURLDubai_AR, context);
    }

    if (isAE && environment == "production") {
        sitemap = await SiteMapGenerator(productionURLDubai_EN, context);
    }

    if (isIN && environment == "production") {
        sitemap = await SiteMapGenerator(productionURLIndia, context);
    }
    else {
        sitemap = await SiteMapGenerator(productionURLIndia, context);
    }

    // Set headers and write the response
    context.res.setHeader("Content-Type", "text/xml");
    context.res.write(sitemap);
    context.res.end();

    return {
        props: {},
    };
};

export default function SiteMap() { }