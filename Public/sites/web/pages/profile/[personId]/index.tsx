import { GetServerSideProps } from "next";
import { useParams } from "next/navigation";
import { Direction, getUserLanguage, SSRDetection } from "shared/src/components/helper/Helper";
import { HelperConstant } from "shared/src/components/helper/HelperConstant";
import { IProductTypeModel } from "shared/src/models/ProductType.Model";
import { IRegistrationModel } from "shared/src/models/Registration.Model";
import { ISEOModel } from "shared/src/models/SEO.Model";
import Profile from "shared/src/pages/Profile";
import ContactUsServices from "shared/src/services/ContactUs.Services";
import UserAddressServices from "shared/src/services/UserAddress.Services";
import { getStaticMeta } from "shared/src/components/utils/metatags/staticMeta";
class AddressProps {
    address: { Address: string, Email: string, Phone: string, PromotionLinks: { faceBook: string, instagram: string, linkedIn: string, tikTok: string, youTube: string, Twitter: string } } =
        {
            Address: "", Email: "", Phone: "",
            PromotionLinks: {
                faceBook: "",
                instagram: "",
                linkedIn: "",
                youTube: "",
                tikTok: "",
                Twitter: ""
            }
        };
    direction: string = "";
    language: "in_en" | "ae_en" | "ae_ar" = "in_en";
    metaTags: ISEOModel = {} as ISEOModel;
    personId?: any;
    isSSR?: boolean;
    userAddress: any;
    // person?: IRegistrationModel
    // productList: Array<IProductTypeModel>,
}
const fetchData = async (context: any): Promise<AddressProps> => {
    let direction = context ? SSRDetection(context, "dir") : Direction();
    let language = context ? SSRDetection(context, "lan") : getUserLanguage();
    let personId = context.query.personId;
    let addressRes = await ContactUsServices.getAddress();
    let address = await (addressRes.status === 200 && addressRes.data );

    let userAddressRes = await UserAddressServices.GetAddressByCustomerId(personId);
    let userAddress = await(userAddressRes.status === 200 && userAddressRes.data.Items);
    
    // static meta tags (API call avoided)
    let metaTags = getStaticMeta(HelperConstant.metaPages.Profile);

    return { language, direction, address, personId, userAddress, metaTags }
}
export default function index({ language, direction, address, personId, userAddress, metaTags }: AddressProps) {
    return (
        <Profile direction={direction} language={language} address={address} productList={[]} userAddresses={userAddress} isSSR={false} metaTags={metaTags}/>
    );
}

// export const getServerSideProps: GetServerSideProps<AddressProps> = async (context) => {
//     const { language, direction, address, personId, userAddress, metaTags } = await fetchData(context);
//     return { props: { language, direction, address, personId, userAddress, metaTags } }
// }