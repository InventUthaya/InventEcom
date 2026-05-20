import { ISEOModel } from "shared/src/models/SEO.Model";
import TermsComponent from "shared/src/pages/Terms";

export default function index() {

  return (
    <TermsComponent direction={""} language={"in_en"} isSSR={false} address={{
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

