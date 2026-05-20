import { ISEOModel } from 'shared/src/models/SEO.Model';
import Head from 'next/head';

type PageProps = {
    metaTags?: ISEOModel,
    language?: "in_en" | "ae_en" | "ae_ar";
    environment: "production" | "testing" | any,
    pageName?: "Order-summary" | "",
    blogTitle?: string,
    SchemaContent?: string,
    blogDescription? : any,
}

function MetaTags({ metaTags, environment, language = "in_en", pageName, blogTitle, SchemaContent,blogDescription }: PageProps) {
      return (
        <>
            <Head>
                <title>{blogTitle ? blogTitle : metaTags?.Title}</title>
                <meta name="description" content={blogDescription ? blogDescription : metaTags?.Description} />
                <meta name="keywords"
                    content={metaTags?.Keywords} />
                <meta name="twitter:card" content={metaTags?.TwitterCard} />
                <meta name="twitter:site" content={metaTags?.TwitterSite} />
                <meta name="twitter:title" content={metaTags?.TwitterTitle} />
                <meta name="twitter:description" content={metaTags?.TwitterDescription} />
                <meta name="twitter:image" content={metaTags?.TwitterImage} />
                <meta property="og:title" content={metaTags?.OGTitle} />
                <meta property="og:type" content={metaTags?.OGType} />
                <meta property="og:url" content={metaTags?.OGUrl} />
                <meta property="og:image" content={metaTags?.OGImage} />
                <meta property="og:description" content={metaTags?.OGDescription} />
                {SchemaContent &&
                    <script type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: (SchemaContent?.replaceAll('<script type="application/ld+json">', '')?.replaceAll('</script>', '')) as string }}
                    />
                }
            </Head>
        </>

    )
}

export default MetaTags