import { ISEOModel } from "shared/src/models/SEO.Model";
import PrivacyPolicyComponent from "shared/src/pages/PrivacyPolicy";

export default function index() {

    return (
        <PrivacyPolicyComponent direction={""} language={"in_en"} isSSR={false} address={{
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
        }} metaTags={{} as ISEOModel} />
    );
}


