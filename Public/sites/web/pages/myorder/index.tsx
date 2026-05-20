import { ISEOModel } from "shared/src/models/SEO.Model";
import MyOrders from "shared/src/pages/myorders";
import BuyTrackOrder from "shared/src/pages/trackOrder";

type TrackOrderProps = {
    metaTags: ISEOModel
}

export default function index({}: TrackOrderProps) {

    return (
        <MyOrders  isSSR={true} filtertype={""} trackOrder={[]}/>
    );
}
