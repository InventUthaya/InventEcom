import { LogoIcon, ContactIcon, ShoppingIcon, LocationIcon } from "./assets";
import Link from "next/link";
import { UserIcon } from "./assets/topMenuAssets";
import OpacityLoad from "../../animation/opacityLoad";
import Signup from "../../web/auth";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  LoginModalHandler,
  ShowLoginPage,
  UserLoginDetails
} from "shared/src/recoil/userAuth";
import {
  findWindow,
  getLocalStorage,
  getProductIdwithoutLogin,
  getUserLanguage,
  getUserLocation,
  localStorageClearHandler
} from "../../helper/Helper";
import GlobalSearch from "./GlobalSearch";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { getPersonDetail } from "../../helper/TokenHelper";
import { UserLocation } from "shared/src/recoil/sell/UserLocation";
import { IItemModel } from "shared/src/models/Cart.Model";
import { IProductModel } from "shared/src/models/Product.Model";
import ProductService from "shared/src/services/Product.Service";
import CartService from "shared/src/services/Cart.Service";
import { LocationModal } from "../LocationModal/LocationModal";
import RequestDelivery from "../Request/RequestDelivery";
import Logo from "../../../../../public/image.png";
import NextImage from "next/image";

interface TopMenuProps {
  needSearch?: boolean;
  zIndex?: any;
  direction?: any;
  language?: "in_en" | "ae_en" | "ae_ar";
}

export default function Menu({
  needSearch = true,
  zIndex,
  direction,
  language,
}: TopMenuProps) {
  const [IsUserLoggedIn, setIsUserLoggedIn] = useRecoilState(UserLoginDetails);
  const [showLogin, setShowLogin] = useRecoilState(ShowLoginPage);
  const [loginHandler, setLoginHandler] = useRecoilState(LoginModalHandler);
  const [logout, setLogout] = useState(false);
  const [LocationEnable, setLocationEnable] = useState(false);
  const [pickupEnable, setPickupEnable] = useState(false);

  const router = useRouter();
  const isActive = router.asPath;
  const [mounted, setMounted] = useState(false);
  const personDetail = mounted ? getPersonDetail() : null;
  const personId = personDetail?.PersonId;
  const userName = personDetail?.name;
  const [enabled, setEnabled] = useState(false);
  const PersonId = mounted ? getLocalStorage()?.PersonId : null;
  const productId = getProductIdwithoutLogin() as string;
  const [product, setProduct] = useState<IProductModel[]>([]);
  const [shoppingCartList, setShoppingCartList] = useState<IItemModel[]>([]);
  const isLocation = useRecoilValue(UserLocation);
  const selectedLocation = getUserLocation() || isLocation.UserLocation;

  const getProductwithoutlogin = () => {
    ProductService.GetProductbyId(productId).then((res: any) => {
      if (res.status === 200) {
        setProduct(res.data.Items);
      }
    });
  };

  const getProductlogin = () => {
    CartService.getAllCart(PersonId).then((res: any) => {
      if (res.status === 200) {
        setShoppingCartList(res.data.Items);
      }
    });
  };

  const getValidLocation = (validLocation: boolean) => {
    if (validLocation) {
      const selectedLocation = getUserLocation() || isLocation.UserLocation;
      const newUrl = `/${getUserLanguage()}${selectedLocation ? `/${encodeURIComponent(selectedLocation)}` : ""}/`;
      // navigate.push(newUrl);
    }
  }

  const capitalizeFirstLetter = (string: string) => {
    if (string.startsWith('-')) {
      string = string.substring(1);
    }
    string = string.replace(/-/g, ' ');
    return string.replace(/\b\w/g, char => char.toUpperCase());
  };

  useEffect(() => {
    setMounted(true);
    const CityId = findWindow() && localStorage.getItem("CityId");
    const CityName = findWindow() && localStorage.getItem("CityName");

    if (!CityId || !CityName) {
      setLocationEnable(true);
    }
    if (!PersonId && productId) {
      getProductwithoutlogin();
    } else if (PersonId) {
      getProductlogin();
    }
  }, [productId]);

  return (
    <>
      <OpacityLoad load="animation-delay-100" zIndex={zIndex || "z-[51]"} language={language} direction={direction}>
        <div id="search-bar" className="flex justify-center items-center px-5 lg:px-16 py-2 lg:py-4 2xl:py-5 z-30 whitespace-nowrap bg-[#F9FAFA] border-b border-solid border-b-neutral-200">
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-between w-full max-w-[1300px] max-md:flex-wrap max-md:max-w-full">
            <div className="flex flex-1 gap-2 sm:gap-3 md:gap-4 lg:gap-8 justify-start items-center text-base max-md:flex-wrap">
              <Link href="/" className="cursor-pointer">
                <NextImage
                  src={Logo}
                  alt="Logo"
                  width={120}
                  height={40}
                  priority
                />
              </Link>

              {needSearch && <GlobalSearch />}
            </div>
            <div className="flex gap-0 lg:gap-5 items-center text-sm font-medium text-center text-[#050505]">
              {/* <div dir={direction} lang={language} className="flex gap-2 items-center cursor-pointer" onClick={() => setLocationEnable(true)}>
                <LocationIcon />
                <div className="text-xs 2xl:text-sm font-normal hover:text-[#EA002A] transition-colors">
                  {selectedLocation ? (
                    <>
                      <span className="font-semibold">Deliver To</span> <br />
                      {selectedLocation}
                    </>
                  ) : (
                    "Select your location"
                  )}
                </div>
              </div> */}
              {pickupEnable && <RequestDelivery />}
              {personId && (
                <Link href="/myorder" className={`${isActive === "/myorder" ? "text-[#EA002A]" : "text-[#050505]"} cursor-pointer text-base hidden lg:block`}>
                  My Order
                </Link>
              )}
              <div className="relative">
                <Link href="/cart" className="rounded-lg w-10 h-10 border bg-[#fff] hidden lg:flex lg:justify-center lg:items-center" >
                  <ShoppingIcon color={isActive === `/cart` ? "EA002A" : "050505"} />
                </Link>
                {(shoppingCartList.length > 0 && personId) && (
                  <span className="hidden sm:inline-block absolute -top-2 -right-1 bg-[#EA002A] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {shoppingCartList.length}
                  </span>
                )}
                {(!personId && product.length > 0) && (
                  <span className="hidden sm:inline-block absolute -top-2 -right-1 bg-[#EA002A] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {product.length}
                  </span>
                )}
              </div>
              {personId ? (
                <div onClick={() => setLogout((a) => !a)} className="cursor-pointer hidden lg:block">
                  <div className="flex justify-start items-center gap-2 px-3 py-2 border border-[#EFEFEF] bg-[#fff] rounded-lg">
                    <UserIcon />
                    <div>{userName}</div>
                  </div>
                </div>
              ) : (
                <div onClick={() => { setShowLogin(true); setLoginHandler({ handler: "login", isOpen: true }) }} className="hidden lg:block px-5 py-2 rounded-lg border border-solid border-[#050505] cursor-pointer text-[#050505] text-sm font-semibold">
                  Login / Sign up
                </div>
              )}
            </div>
          </div>
        </div>
      </OpacityLoad>
      {showLogin && <Signup />}
      {logout && <LogoutLayer setLogout={setLogout} personId={personId} direction={direction} />}
      {/* {LocationEnable && <LocationModal isValid={getValidLocation} setLocationEnable={setLocationEnable} LocationEnable={LocationEnable} setPickupEnable={setPickupEnable} PickupEnable={pickupEnable} />} */}

    </>
  );
}

const LogoutLayer = ({ setLogout, personId, direction }: { setLogout: any, personId: any, direction: any }) => {
  const router = useRouter()
  const [__, setUserLocation] = useRecoilState(UserLocation);

  const logout = () => {
    localStorageClearHandler();
    setUserLocation({
      UserLocation: "",
      UserLocationId: 0
    })
    window.location.href = "/";
  };

  return (
    <div dir={direction}
      className={`overflow-hidden absolute top-16 ${direction == "rtl" ? "left-16" : "right-16"} transition-all duration-500 bg-white border h-fit rounded-xl z-[60]
       lg:flex flex-col justify-start items-start gap-2 p-2 logout-layer`}
      onClick={() => setLogout((a: any) => !a)}
    >
      <div className={`font-medium text-sm text-center px-2`}>
        <Link
          href={`/profile/${personId}`}
          className="hidden lg:flex gap-2 justify-center items-center capitalize"
        >
          <CgProfile className="mt-1" />
          <span>profile</span>
        </Link>
      </div>
      <div onClick={logout}
        className={`font-medium text-sm text-center px-2 flex gap-2 justify-center items-center capitalize cursor-pointer`}
      >
        <LuLogOut className="mt-1" onClick={logout} />
        <span onClick={logout}>logout</span>
      </div>
    </div>
  );
};
