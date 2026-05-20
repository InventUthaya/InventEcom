import { ISEOModel } from "shared/src/models/SEO.Model";
import FaqComponent from "shared/src/pages/Faq";

export default function index() {

    return (
        <FaqComponent address={{
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
        }} direction={""} language={"in_en"} isSSR={false} metaTags={{} as ISEOModel}/>
    );
}
