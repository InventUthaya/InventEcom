import { GetServerSideProps } from "next";
import { Direction, SSRDetection, getUserLanguage } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { ISEOModel } from "shared/src/models/SEO.Model";
import BuyTrackOrder from "shared/src/pages/trackOrder";
import SEOServices from "shared/src/services/SEO.Services";

type TrackOrderProps = {
    metaTags: ISEOModel
}

export default function index({  metaTags }: TrackOrderProps) {

    return (
        <BuyTrackOrder  isSSR={true} trackOrder={[]} filtertype={""}/>
    );
}
