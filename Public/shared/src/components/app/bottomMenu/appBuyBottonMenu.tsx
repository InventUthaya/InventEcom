import { useState } from "react";
import {
  ProfileIcon,
  SearchIcon,
  SellIcon,
  ShoppingIcon,
} from "../../utils/Menus/assets";
import start from "../topMenu/assets/star.png";
import Link from "next/link";

const MenuDataBuy = [
  { id: 1, value: "Home", icon: SellIcon, link: "/" },
  { id: 2, value: "Search", icon: SearchIcon, link: "#search-bar" },
  { id: 3, value: "Profile", icon: ProfileIcon, link: "/profile" },
  { id: 4, value: "Cart", icon: ShoppingIcon, link: "/cart" },
];

export const AppBuyBottomMenu = ({ ActiveId = 1 }: { ActiveId?: number }) => {
  const [activaeMenu, setActiveMenu] = useState({
    index: ActiveId - 1,
    state: true,
  });
  const MenuHandler = (index: number) => {
    setActiveMenu((e: any) => {
      if (e.index === index) {
        return { index, state: !e.state };
      } else {
        return { index, state: true };
      }
    });

    switch (index) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        let searchSelect = document.getElementById("search-bar");
        if (searchSelect) {
          searchSelect.focus();
        }
        break;
      case 3:
        break;
      case 4:
        break;
    }
  };
  return (
    <div className={`w-full fixed bottom-0 left-0 z-40 backdrop-blur-sm h-screen`}>
      <div className="w-full fixed bottom-2 left-0">
        <div className="max-w-[380px] flex gap-3  mx-auto">
          <div className="w-full rounded-lg bg-white shadow-[0px_2px_10px_rgba(16,_16,_16,_0.06),_0px_-2px_24px_rgba(0,_0,_0,_0.1)] text-[#050505] overflow-hidden px-5 gap-[4px] text-sm">
            <div className="self-stretch flex flex-row items-center justify-between gap-3">
              {MenuDataBuy.map((item, index) => (
                <Link
                  href={item.link}
                  key={item.value + index}
                >
                  <div
                    className={`flex flex-col items-center gap-0.5 justify-between h-full py-3 ${
                      activaeMenu.index == index && "scale-110"
                    } transition-transform`}
                    onClick={() => MenuHandler(index)}
                  >
                    {activaeMenu.index == index
                      ? item.icon("E91D2D")
                      : item.icon("050505")}
                    <div
                      className={`${
                        activaeMenu.index == index && "text-[#E91D2D]"
                      } transition-colors capitalize text-xs`}
                    >
                      {item.value}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-lg p-2 flex flex-col justify-center items-center bg-white shadow-[0px_2px_10px_rgba(16,_16,_16,_0.06),_0px_-2px_24px_rgba(0,_0,_0,_0.1)]">
            <img src={start.src} alt="" className="w-6" />
            <h1 className="text-[10px] text-center font-semibold leading-3">
              buy devices
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
