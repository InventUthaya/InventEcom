import { HelperConstant } from "../helper/HelperConstant";
import { getUserLanguage, SSRDetection } from "../helper/Helper";
import { pageNames } from "public/assets/sitemap/SiteMapData";
import DofyGeoService from "shared/src/services/DofyGeo.Service";
import ProductService from "shared/src/services/Product.Service";
import CategoryService from "shared/src/services/CategoryService";
import BlogServices from "shared/src/services/Blog.Services";

// Utility function to escape XML special characters
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function SiteMapGenerator(url: string, context: any): Promise<string> {
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let header = { LanguageCode: language?.slice(3), CountryCode: language?.slice(0, 2) };
    let stateIndentifier: number[] = [];
    let apiResults: string[] = [];

    const getStateList = async () => {
        try {
            const res = await DofyGeoService.GetStateList(HelperConstant.serviceTypeId.SELL);
            if (res.status === 200) {
                const stateIds = res.data.map((item: any) => item.EncryptedIdentifier);
                stateIndentifier.push(...stateIds);
            }
        } catch (e: any) {
            console.error("Error fetching state list:", e.message || e);
        }
    };

    const GetAllDofyGeoBysearch = async () => {
        const promises = stateIndentifier.map(async (item) => {
            try {
                const res = await DofyGeoService.GetDofyGeoListBysearch(HelperConstant.serviceTypeId.SELL, item, header.LanguageCode, header.CountryCode);
                if (res.status === 200) {
                    const result = res.data as Array<any>;
                    return result.map((item) => {
                        const safeName = escapeXml(item.Name);
                        return `
                            <url>
                                <loc>${url}/${header.CountryCode}-${header.LanguageCode}/${safeName.toLowerCase().replace(' ', '-')}/${header.CountryCode == "in" ? "sell-old-" : "sell-used-"}device/sitemap.xml</loc>
                            </url>`;
                    })
                        .join('');
                } else {
                    console.warn(`Unexpected status ${res.status} for state ${item}`);
                    return '';
                }
            } catch (e: any) {
                console.error(`Error ${header.CountryCode}-${header.LanguageCode}-${item}:`, e.message || e);
                return '';
            }
        });

        const results = await Promise.all(promises);
        apiResults = results.filter(result => result !== '');
    };

    const GetAllCatagory = async () => {
        const res = await CategoryService.getAllCategory();
        try {
            if (res.status === 200) {
                const result = res.data as Array<any>;
                const Category = result.map((item) => {
                    const safeName = escapeXml(item.Name);
                    return `
                            <url>
                                <loc>${url}/${header.CountryCode == "in" ? "buy" : "buy"}/${item.EncryptedId}_Category</loc>
                            </url>`;
                })
                apiResults.push(...Category);
            }
        } catch (e: any) {
            console.error("Error fetching state list:", e.message || e);
            return '';
        }
    };

    const GetTopDeals = async () => {
        const res = await ProductService.getAllProductForFilter()
        try {
            if (res.status === 200) {
                const selectedTopDeals = res.data.Items as Array<any>;
                const TopDeals = selectedTopDeals.map((item) => {
                    return `
                            <url>
                                <loc>${url}/${header.CountryCode == "in" ? "buy" : "buy"}/topDeals</loc>
                            </url>`;
                })
                apiResults.push(...TopDeals);
            }
        } catch (e: any) {
            console.error("Error fetching state list:", e.message || e);
            return '';
        }
    }
    const GetAllBrand = async () => {
        const res = await CategoryService.getBrandList();
        try {
            if (res.status === 200) {
                const result = res.data.Items as Array<any>;
                const BrandName = result.map((item) => {
                    return `
                            <url>
                                <loc>${url}/${header.CountryCode == "in" ? "buy" : "buy"}/${item.Name}_Brand</loc>
                            </url>`;
                })
                apiResults.push(...BrandName);
            }
        } catch (e: any) {
            console.error("Error fetching state list:", e.message || e);
            return '';
        }
    }
    const GetPriceDetails = async () => {
        const res = await CategoryService.getShopByPrice();
        try {
            if (res.status === 200) {
                const result = res.data;
                const Price = Object.keys(result.Price).map((priceDetails: any) => {
                    return `
                            <url>
                                <loc>${url}/${header.CountryCode == "in" ? "buy" : "buy"}/${priceDetails}</loc>
                            </url>`;
                })
                apiResults.push(...Price);
            }
        } catch (e: any) {
            console.error("Error fetching state list:", e.message || e);
            return '';
        }
    }

    

    await getStateList();
    // await GetAllDofyGeoBysearch();
   // await GetAllCatagory();
    await GetTopDeals();
    await GetAllBrand();
    // await GetPriceDetails();
    
    return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
            ${pageNames.map((x) => `
                <url>
                    <loc>${url}/${x}</loc>
                </url>
            `).join('')}
            ${apiResults.join('')}
        </urlset>`;
}