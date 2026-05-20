import Container from "../components/animation/Container";
import Footer from "../components/utils/Footer";
import { MobileMenuSell } from "../components/utils/Menus/MobileSubMenu";
import Menu from "../components/utils/Menus/TopMenu";
import ProfileForm from "../components/web/Profile/components/ProfileForm/ProfileForm";
import SavedAddress from "../components/web/Profile/components/SavedAddress/SavedAddress";
import ContactUsServices from "../services/ContactUs.Services";
import {
  SSRDetection,
  Direction,
  getUserLanguage,
  getLocalStorage,
  findWindow,
} from "../components/helper/Helper";
import { useEffect, useState } from "react";
import { IRegistrationModel } from "../models/Registration.Model";
import { IProductTypeModel } from "../models/ProductType.Model";
import DesktopSubMenu from "../components/utils/Menus/DesktopSubMenu";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { MenuContentZindex } from "../recoil/styleState";
import Loader from "../components/utils/Loader/Loader";
import { Capacitor } from "@capacitor/core";
import { Reloader } from "../recoil/Reloader";
import UserAddressServices from "../services/UserAddress.Services";
import { BuyFooterData } from "./buy";
import CategoryService from "../services/CategoryService";
import { ISEOModel } from "../models/SEO.Model";
import { HelperConstant } from "../components/helper/HelperConstant";
import MetaTags from "../components/utils/metatags/MetaTags";
import { getStaticMeta } from "../components/utils/metatags/staticMeta";
import { IAddressModel } from "shared/src/models/Address.Model";

interface AddressProps {
  address: any;
  direction: string;
  language: "in_en" | "ae_en" | "ae_ar";
  personId?: any;
  isSSR?: boolean;
  person?: IRegistrationModel;
  productList?: Array<IProductTypeModel>;
  userAddresses?: IAddressModel[];  // ← Changed to array
  metaTags?: ISEOModel;
}

const fetchData = async (context: any): Promise<AddressProps> => {
  const direction = context ? SSRDetection(context, "dir") : Direction();
  const language = context ? SSRDetection(context, "lan") : getUserLanguage();
  const personId = findWindow() && getLocalStorage()?.PersonId;

  let address = {
    Address: "",
    Email: "",
    Phone: "",
    PromotionLinks: { faceBook: "", instagram: "", linkedIn: "", youTube: "", tikTok: "", Twitter: "" },
  };

  try {
    const addressRes = await ContactUsServices.getAddress();
    if (addressRes.status === 200 && addressRes.data) {
      address = addressRes.data;
    }
  } catch (err) {
    console.error("Failed to fetch contact address:", err);
  }

  let userAddresses: IAddressModel[] = [];

  if (personId) {
    try {
      const res = await UserAddressServices.GetAddressByCustomerId(personId);
      if (res.status === 200 && res.data) {
        const data = res.data;

        // Current API: returns array of addresses
        if (Array.isArray(data)) {
          userAddresses = data.filter((addr: any) => addr.DisplayInList && addr.IsActive);
        }
        // Legacy: single object
        else if (data.Id && data.UserId && data.AddressLine1) {
          userAddresses = [data];
        }
        // Legacy wrapped format
        else if (data.HasAddress && data.Address) {
          userAddresses = [data.Address];
        }
      }
    } catch (err) {
      console.error("Failed to fetch user addresses:", err);
    }
  }

  const metaTags = getStaticMeta(HelperConstant.metaPages.Profile);

  return {
    language: language || "in_en",
    direction,
    address,
    personId,
    userAddresses,
    metaTags,
  };
};

const Profile = ({
  language: initialLanguage,
  direction: initialDirection,
  address: initialAddress,
  isSSR,
  personId: initialPersonId,
  person,
  productList,
  userAddresses: initialUserAddresses = [],
  metaTags: initialMetaTags,
}: AddressProps) => {
  const [profileData, setProfileData] = useState({
    language: initialLanguage || "in_en",
    direction: initialDirection || "ltr",
    address: initialAddress || {
      Address: "", Email: "", Phone: "",
      PromotionLinks: { faceBook: "", instagram: "", linkedIn: "", youTube: "", tikTok: "", Twitter: "" }
    },
    personId: initialPersonId,
    userAddresses: initialUserAddresses,
    person,
    productList,
    metaTags: initialMetaTags,
  });

  const menuContentZindex = useRecoilValue(MenuContentZindex);
  const reload = useRecoilValueLoadable(Reloader);
  const [footerData, setFooterData] = useState(BuyFooterData);

  useEffect(() => {
    if (!isSSR) {
      fetchData("").then((res) => {
        setProfileData((prev) => ({
          ...prev,
          language: res.language,
          direction: res.direction,
          address: res.address,
          personId: res.personId,
          userAddresses: res.userAddresses ?? [],
          metaTags: res.metaTags,
        }));
      });
    }
  }, [reload.contents, isSSR]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategoryList();
      if (response.status === 200 && response.data) {
        const popularCategories = response.data.map((category: any) => ({
          title: `Buy ${category.CategoryName}`,
          link: `/buy/${category.EncryptedId}_Category`,
        }));
        setFooterData((prev) => ({ ...prev, PopularCategories: popularCategories }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <MetaTags
        metaTags={profileData?.metaTags}
        environment={process.env.NEXT_PUBLIC_ENV}
        language={profileData.language}
      />

      <Menu needSearch={false} />
      <DesktopSubMenu />
      <MobileMenuSell ActiveId={3} zIndex={menuContentZindex.Z_Index} />

      <ProfileForm
        persons={person}
        isSSR={false}
        language={profileData.language}
        direction={profileData.direction}
      />

      <Container>
        <div className="lg:px-16 px-5">
          <div className="max-w-[1300px] mx-auto pb-10">
            <SavedAddress
              direction={profileData.direction}
              language={profileData.language}
              addresses={profileData.userAddresses ?? []}
              personId={profileData.personId}
              person={person}
            />
          </div>
        </div>
      </Container>

      {Capacitor.isNativePlatform() ? null : (
        <Footer
          footerData={footerData}
          address={profileData.address}
          direction={profileData.direction}
          language={profileData.language}
        />
      )}
    </>
  );
};

export default Profile;