import { ISEOModel } from "shared/src/models/SEO.Model";
import BuyTrackOrder from "shared/src/pages/trackOrder";

type TrackOrderProps = {
    metaTags: ISEOModel
}

export default function index({  metaTags }: TrackOrderProps) {

    return (
        <BuyTrackOrder  isSSR={false} trackOrder={[]} filtertype={""} metaTags={{} as ISEOModel}/>
    );
}
