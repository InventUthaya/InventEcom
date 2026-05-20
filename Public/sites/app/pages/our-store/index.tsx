import { getUserLanguage } from "shared/src/components/helper/Helper";
import Store from "shared/src/pages/Store";

export default function index() {

    return (
        <Store locateOurStoresList={[]} direction={""} language={getUserLanguage()} metaTags={{} as any} address={[]}/>
    );
}
