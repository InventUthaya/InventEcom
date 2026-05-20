import { getUserLanguage } from "shared/src/components/helper/Helper";
import AboutUs from "shared/src/pages/AboutUs";

export default function index() {
    return (
        <AboutUs direction={""} language={getUserLanguage()} metaTags={{} as any} personId={0} isSSR={false} address={{
            Address: "",
            Email: "",
            Phone: "",
            PromotionLinks: {
                faceBook: "",
                instagram: "",
                linkedIn: "",
                tikTok: "",
                youTube: "",
                Twitter: ""
            }
        }}/>
    );
}
