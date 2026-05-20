import { ISEOModel } from "shared/src/models/SEO.Model";
import Profile from "shared/src/pages/Profile";

export default function Index() {
    return (
        <Profile 
            direction={""} 
            language={"in_en"} 
            productList={[]} 
            isSSR={false} 
            address={{
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
            }} 
            userAddresses={[]}  // Changed from undefined to null
            metaTags={{} as ISEOModel}
        />
    );
}