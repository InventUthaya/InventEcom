import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { MenuContentZindex } from "shared/src/recoil/styleState";

function OpacityLoad({ children, load, zIndex, direction, language }: { children: any; load: any, zIndex?: any, direction?: any, language?: "in_en" | "ae_en" | "ae_ar" }) {
  const menuContentZindex = useRecoilValue(MenuContentZindex);
  const [fakeLoad, setFakeLoad] = useState<boolean>(false);
  const router = useRouter();


  // useEffect(() => {
  //   if(!router.asPath.includes("sell-device-details") || !router.asPath.includes("profile")){

  //   }
  //   setFakeLoad(fakeLoad)
  // }, [MenuContentZindex])

  return (
    <div
      dir={direction} lang={language}
      className={`w-full opacity-0 relative top-3 animate-[opacity_0.5s_forwards_ease-in-out] ${load} ${zIndex ? zIndex : 'z-50'}`}
    >
      {children}
    </div>
  );
}

export default OpacityLoad;
