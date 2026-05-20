import { useState, useEffect } from "react";
import { DropDownIcon } from "./assets";
import { ActiveMenuState } from "./SubMenutype";
import { getMenuDataSell, getMenuDataBuy, subMenudata } from "./SubMenuData";
import router, { useRouter } from "next/router";
import Link from "next/link";
import { LoginModalHandler, ShowLoginPage } from "shared/src/recoil/userAuth";
import { useRecoilState } from "recoil";
import { getLocalStorage, localStorageClearHandler } from "../../helper/Helper";
// -------------------------------------------------------------------------------
// Sell Mobile menu
// -------------------------------------------------------------------------------

export const MobileMenuSell = ({ ActiveId = 1 }: { ActiveId?: number, zIndex?: any }) => {
  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenuState>({
    index: ActiveId - 1,
    state: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [loginHandler, setLoginHandler] = useRecoilState(LoginModalHandler);
  const [showLogin, setShowLogin] = useRecoilState(ShowLoginPage);
  const PersonId = mounted ? getLocalStorage()?.PersonId : null;
  const MenuDataSell = getMenuDataSell(PersonId);

  const MenuHandler = (index: number) => {
    setActiveMenu((e: ActiveMenuState) => {
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
        let searchSelect = document.getElementById("search-bar");
        if (searchSelect) {
          searchSelect.focus();
        }
        break;
      case 2:
        break;
      case 3:
        if (activeMenu.state === true && activeMenu.index === MenuDataSell.length - 1) {
          setActiveMenu({ index: 0, state: true });
        }
        break;
    }
  };

  return (
    <div
      className={`lg:hidden w-full fixed bottom-0 left-0 ${activeMenu.index == MenuDataSell.length - 1 && activeMenu.state
        ? " z-50 bg-[#05050580] backdrop-blur-sm h-screen"
        : "z-40"
        } `}
      onClick={() => setActiveMenu({ index: 0, state: true })}
    >
      {activeMenu.index == 3 && activeMenu.state && (
        <MobSubMenuBox CloseMenu={setActiveMenu} />
      )}
     <div
        className="lg:hidden fixed bottom-2 w-full left-0 translate-y-10 opacity-0 animate-[mobmenu_0.5s_ease-in-out_forwards]"
        // className="lg:hidden w-[75%] fixed bottom-2 left-[40%] -translate-x-1/2"
        // className={getLocalStorage()?.PersonId ? "lg:hidden fixed bottom-2 left-[40%] -translate-x-1/2" : "w-full lg:hidden fixed left-0 bottom-2 translate-y-10 opacity-0 animate-[mobmenu_0.5s_ease-in-out_forwards]"}

        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-md:px-5 max-w-[400px] md:ml-[24%] mx-auto">
          <div className="w-full rounded-lg bg-white shadow-[0px_2px_10px_rgba(16,_16,_16,_0.06),_0px_-2px_24px_rgba(0,_0,_0,_0.1)] text-[#050505] overflow-hidden px-5 gap-[4px] text-sm">
            <div className="self-stretch flex flex-row items-center justify-between gap-3">
              {MenuDataSell.map((item: any, index) => (
                <Link href={item.link} key={item.value + index}>
                  <div
                    className={`flex flex-col items-center gap-0.5 justify-between h-full py-3 ${activeMenu.index == index && "scale-110"
                      } transition-transform`}
                    onClick={(e) => {
                      if (index === 2 && !PersonId) {
                        e.preventDefault();
                        setShowLogin(true);
                        setLoginHandler({ handler: "login", isOpen: true });
                        return;
                      }
                      MenuHandler(index);
                    }}
                  >
                    {activeMenu.index == index
                      ? activeMenu.index == MenuDataSell.length - 1
                        ? item.active && item.active()
                        : item.icon("E91D2D")
                      : item.icon("050505")}
                    <div
                      className={`${activeMenu.index == index && "text-[#E91D2D]"
                        } transition-colors capitalize text-xs`}
                    >
                      {(index === 2 && !PersonId) ? 'Login' : item.value}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobSubMenuBox = ({ CloseMenu }: { CloseMenu: any }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [ActiveMenu, setActiveMenu] = useState<ActiveMenuState>({
    index: undefined,
    state: undefined,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const PersonId = mounted ? getLocalStorage()?.PersonId : null;

  const ActiveMenuHandler = (index: number) => {
    setActiveMenu((e: ActiveMenuState) => {
      if (e.index === index) {
        return { index: undefined, state: undefined };
      } else {
        return { index, state: true };
      }
    });
  };

  const logout = () => {
    localStorageClearHandler();
    router.push('/');
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full lg:hidden fixed left-0 bottom-[74px] translate-y-10 opacity-0 animate-[mobmenu_0.5s_ease-in-out_forwards]"
    >
      <div className="max-md:px-5 max-w-[400px] mx-auto">
        <div className="bg-[#FFFFFF] rounded-lg">
          {subMenudata.map((a, i) => (
            <div
              key={a?.title}
              className={`${i == 0 && "rounded-t-lg pt-[4px]"} ${subMenudata.length - 1 == i && "rounded-b-lg pb-[4px]"
                } ${ActiveMenu.state
                  ? ActiveMenu.index == i
                    ? "bg-[#FFFFFF]"
                    : "bg-[#F5F5F5]"
                  : "bg-[#FFFFFF]"
                }  overflow-hidden py-[1px] transition-colors delay-150`}
            >
              <div
                className={`w-full px-3 flex justify-start items-center gap-1.5 cursor-pointer py-1.5 z-30`}
                onClick={() => {
                  if (a?.link) {
                    router.push(a.link);
                    CloseMenu({ index: 0, state: true });
                  }
                  ActiveMenuHandler(i);
                }}
              >
                <div
                  className={`font-medium transition-colors ${ActiveMenu.index == i && ActiveMenu.state
                    ? "text-[#EA002A]"
                    : "text-[#050505]"
                    }`}
                >
                  {a?.title}
                </div>
                {i == subMenudata.length - 1 && (
                  <div
                    className={`transition-transform  ${ActiveMenu.index == i && ActiveMenu.state
                      ? "rotate-180"
                      : "rotate-0"
                      }`}
                  >
                    <DropDownIcon
                      color={`${ActiveMenu.index == i && ActiveMenu.state
                        ? "EA002A"
                        : "050505"
                        }`}
                    />
                  </div>
                )}
              </div>
              {a?.items && (
                <div
                  className={`px-3 transition-all duration-500 ${ActiveMenu.index === i && ActiveMenu.state
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                  {/* This is for sub list title */}
                  {a.items.title && (
                    <div className="text-[#9E9D9D] text-sm py-1">
                      {a.items.title}
                    </div>
                  )}
                  {/* This is the actual sub list */}
                  {a.items?.list?.map((item, index) => (
                    <div
                      key={item.title}
                      className={`cursor-pointer font-medium py-2.5 ${a.items.list.length - 1 !== index &&
                        "border-b border-[#EBEBEB]"
                        }`}
                      onClick={() => {
                        router.push(item.link);
                        CloseMenu({ index: 0, state: true });
                      }}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {PersonId &&
            <div className={`${0 == 0 && "rounded-t-lg pt-[4px]"} ${subMenudata.length - 2 == 2 && "rounded-b-lg pb-[4px]"
              } ${ActiveMenu.state
                ? (ActiveMenu.index == 2)
                  ? "bg-[#FFFFFF]"
                  : "bg-[#F5F5F5]"
                : "bg-[#FFFFFF]"
              }  overflow-hidden py-[1px] transition-colors delay-150`} >
              <div
                className={`w-full px-3 flex justify-start items-center gap-1.5 cursor-pointer py-1.5 z-30`}
                onClick={() => logout()}
              >
                <div
                  className={`font-medium transition-colors ${ActiveMenu.index == 2 && ActiveMenu.state
                    ? "text-[#EA002A]"
                    : "text-[#050505]"
                    }`}
                >
                  LogOut
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------------
// Buy Mobile menu
// -------------------------------------------------------------------------------
export const MobileMenuBuy = ({ ActiveId = 2 }: { ActiveId?: number }) => {
  const [mounted, setMounted] = useState(false);
  const [activaeMenu, setActiveMenu] = useState(ActiveId - 1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const PersonId = mounted ? getLocalStorage()?.PersonId : null;
  const MenuDataBuy = getMenuDataBuy(PersonId);

  const MenuHandler = (index: number) => {
    setActiveMenu(index);

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
    <div className={`lg:hidden w-full fixed bottom-0 left-0 z-50`}>
      <div className="lg:hidden w-[100%] fixed bottom-2 left-[50%] -translate-x-1/2">
        <div className="max-md:px-5 max-w-[400px] mx-auto">
          <div className="w-full rounded-lg bg-white shadow-[0px_2px_10px_rgba(16,_16,_16,_0.06),_0px_-2px_24px_rgba(0,_0,_0,_0.1)] text-[#050505] overflow-hidden px-5 gap-[4px] text-sm">
            <div className="self-stretch flex flex-row items-center justify-between gap-3">
              {MenuDataBuy.map((item, index) => (
                <Link
                  href={item.link}
                  // className={({ isActive, isPending }) =>
                  //   isPending ? "" : isActive ? "" : ""
                  // }
                  key={item.value + index}
                >
                  <div
                    className={`flex flex-col items-center gap-0.5 justify-between h-full py-3 ${activaeMenu == index && "scale-110"
                      } transition-transform`}
                    onClick={() => MenuHandler(index)}
                  >
                    {activaeMenu == index
                      ? item.icon("E91D2D")
                      : item.icon("050505")}
                    <div
                      className={`${activaeMenu == index && "text-[#E91D2D]"
                        } transition-colors capitalize text-xs`}
                    >
                      {item.value}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
