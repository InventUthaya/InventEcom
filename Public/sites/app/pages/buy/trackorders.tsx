import { ISEOModel } from "shared/src/models/SEO.Model";
import BuyTrackOrder from "shared/src/pages/trackOrder";

export default function index() {

    return (
        <BuyTrackOrder trackOrder={[]} filtertype={""} metaTags={{} as ISEOModel}/>
    );
}
