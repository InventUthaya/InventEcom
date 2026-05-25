import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";

import {
  Scale,
  BadgePercent,
  DatabaseZap,
  MonitorCheck,
  ReceiptIndianRupee,
  ShieldUser,
  Link as LinkIcon,
  HandHeart,
  KeyRound,
  Ellipsis,
  FilePen,
  FilePenLine,
  FileLock2,
  GlobeLock,
  GitPullRequestCreate,
  ExternalLink,
  IndianRupee,
  BadgePercentIcon,
  Database,
  BookA,
  FileDown,
  ScanEye,
  Banknote,
  BookOpen,
  Wallet,
  PanelLeftClose,
  PanelRightClose,
  LogOut,
  Tag,
  BookCopy,
  Warehouse,
  UserCircle,
  Vegan,
  BadgeIndianRupee,
  Fan,
  Blend,
  FerrisWheel,
} from "lucide-react";

import { useSidebar } from "../context/SidebarContext";

import { jwtDecode } from "jwt-decode";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    icon?: React.ReactNode;
  }[];
};

interface ScreenAccess {
  path: string;
  roleName: string;
  screenName: string;
  groupName: string;
  parentScreenName: string;
  parentScreenId: number | null;
  canView: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  iconName: string;
}

interface TokenData {
  name?: string;
  email?: string;
  isAgent?: boolean;
  roleid?: number;
  RoleId?: number;
}

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    toggleSidebar,
    menuItems: dynamicMenuItems
  } = useSidebar();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "dialog";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(false);

  // User data state for bottom section
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [initials, setInitials] = useState<string>("");
  const [roleId, setRoleId] = useState<number | null>(null);

  const isActive = useCallback((p: string) => pathname === p, [pathname]);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.clear();
    navigate("/signin", { replace: true });
  };

  const getIcon = (name: string): React.ReactNode => {
    const map: Record<string, React.ReactNode> = {
      GridIcon: <GridIcon />,
      PieChartIcon: <PieChartIcon />,
      BoxCubeIcon: <BoxCubeIcon />,
      PlugInIcon: <PlugInIcon />,
      HandHeart: <HandHeart />,
      UserCircleIcon: <UserCircleIcon />,
      ShieldUserIcon: <ShieldUser />,
      LinkIcon: <LinkIcon />,
      BadgePercent: <BadgePercent />,
      ReceiptIndianRupee: <ReceiptIndianRupee />,
      MonitorCheck: <MonitorCheck />,
      DatabaseZap: <DatabaseZap />,
      KeyRound: <KeyRound />,
      FilePen: <FilePen />,
      FilePenLine: <FilePenLine />,
      FileLock2: <FileLock2 />,
      GlobeLock: <GlobeLock />,
      GitPullRequestCreate: <GitPullRequestCreate />,
      ExternalLink: <ExternalLink />,
      IndianRupee: <IndianRupee />,
      BadgePercentIcon: <BadgePercentIcon />,
      BadgeIndianRupee: <ScanEye />,
      Database: <Database />,
      BookA: <BookA />,
      Scale: <Scale />,
      FileDown: <FileDown />,
      Banknote: <Banknote />,
      ScanEye: <ScanEye />,
      Wallet: <Wallet />,
      Tag: <Tag />,
      BookCopy: <BookCopy />,
      Warehouse: <Warehouse />,
      UserCircle: <UserCircle />,
      Vegan: <Vegan />,
      BadgeIndianRupe: <BadgeIndianRupee />,
      Fan: <Fan />,
      Blend: <Blend />,
      FerrisWheel: <FerrisWheel />
    };
    return map[name] || <GridIcon className="w-8 h-8" />;
  };

  useEffect(() => {
    const loadRoleId = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("Token");
        if (token) {
          const decodedToken = jwtDecode(token) as any;
          const userRoleId = decodedToken.RoleId || decodedToken.roleid || decodedToken.roleId;
          if (userRoleId) {
            setRoleId(Number(userRoleId));
          }
        }
      } catch (error) {
        console.error('Error decoding JWT for RoleId:', error);
      }
    };

    loadRoleId();
  }, []);

  // Load user data from token
  useEffect(() => {
    const loadUserData = async () => {
      const token = sessionStorage.getItem("Token");
      let decodedToken = null;

      if (token) {
        try {
          decodedToken = jwtDecode(token);
          setTokenData({
            name: (decodedToken as any).name,
            email: (decodedToken as any).Email,
            RoleId: (decodedToken as any).RoleId
          });
        } catch (error) {
          console.error('Error decoding JWT:', error);
        }
      }
      setTokenData({ name: "", email: (decodedToken as any)?.Email });
    };

    loadUserData();
  }, []);

  // useEffect(() => {
  //   const generatedItems = dynamicMenuItems.map((item) => ({
  //     name: item.name,
  //     path: item.path,
  //     icon: getIcon(item.iconName),
  //     subItems: [],
  //   }));

  //   setNavItems(generatedItems);
  // }, [dynamicMenuItems]);

  useEffect(() => {
    const masterPaths = ["/menu", "/category", "/subcategory", "/brand"];

    const mastersSubItems = dynamicMenuItems
      .filter(item => masterPaths.includes(item.path))
      .map(item => ({
        name: item.name,
        path: item.path,
        icon: getIcon(item.iconName),
      }));

    const normalItems = dynamicMenuItems
      .filter(item => !masterPaths.includes(item.path))
      .map(item => ({
        name: item.name,
        path: item.path,
        icon: getIcon(item.iconName),
        subItems: [],
      }));

    const generatedItems: NavItem[] = [
      ...normalItems,
      ...(mastersSubItems.length
        ? [
          {
            name: "Masters",
            icon: <Database />,
            subItems: mastersSubItems,
          },
        ]
        : []),
    ];

    setNavItems(generatedItems);
  }, [dynamicMenuItems]);


  useEffect(() => {
    let matched = false;
    ["main", "dialog"].forEach((t) =>
      navItems.forEach((n, i) => {
        if (n.subItems && n.subItems.length > 0) {
          n.subItems.forEach((s) => {
            if (isActive(s.path)) {
              setOpenSubmenu({ type: t as "main" | "dialog", index: i });
              matched = true;
            }
          });
        }
      })
    );
    if (!matched) setOpenSubmenu(null);
  }, [pathname, navItems, isActive]);

  useEffect(() => {
    if (openSubmenu) {
      const k = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[k];
      if (el) setSubMenuHeight((p) => ({ ...p, [k]: el.scrollHeight || 0 }));
    }
  }, [openSubmenu]);


  const toggleSubmenu = (i: number, t: "main" | "dialog") => {
    setOpenSubmenu((p) =>
      p && p.type === t && p.index === i ? null : { type: t, index: i }
    );
    if (t !== "dialog") setIsMoreDialogOpen(false);
  };

  const renderMenuItems = (items: NavItem[], t: "main" | "dialog") => (
    <ul className="flex flex-col gap-2">
      {items
        .filter(nav => nav.name && nav.name.trim() !== '' && nav.name !== '0' && nav.name !== 'undefined')
        .map((nav, i) => (
          <li key={nav.name}>
            {!!(nav.subItems && nav.subItems.length > 0) ? (
              <button
                onClick={() => toggleSubmenu(i, t)}
                className={`menu-item group flex items-center w-full p-2 rounded-lg ${openSubmenu?.type === t && openSubmenu.index === i
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } ${t === "main" && !isExpanded ? "lg:flex-col lg:text-center" : ""}`}
                title={!isExpanded ? nav.name : ""}
              >
                <span
                  className={`menu-item-icon-size ${openSubmenu?.type === t && openSubmenu.index === i
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen || t === "dialog") ? (
                  <>
                    <span className="flex-1 text-left">{nav.name}</span>
                    <ChevronDownIcon
                      className={`w-5 h-5 transition-transform ${openSubmenu?.type === t && openSubmenu.index === i
                        ? "rotate-180 text-blue-500"
                        : "text-gray-500"
                        }`}
                    />
                  </>
                ) : (
                  <span className="text-[9px] font-medium text-white/80 truncate max-w-[45px] leading-tight mt-1">
                    {nav.name.slice(0, 4)}
                  </span>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  onClick={() => t === "dialog" && setIsMoreDialogOpen(false)}
                  className={`menu-item group flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${isActive(nav.path)
                    ? "bg-[#17284b] text-white font-bold"
                    : "text-white/70 hover:text-white"
                    } ${t === "main" && !isExpanded ? "lg:flex-col lg:text-center" : ""}`}
                  title={!isExpanded ? nav.name : ""}
                >
                  <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isMobileOpen || t === "dialog") ? (
                    <span className="menu-item-text">{nav.name}</span>
                  ) : (
                    <span className="text-[9px] font-medium text-white/80 truncate max-w-[45px] leading-tight mt-1">
                      {nav.name.slice(0, 4)}
                    </span>
                  )}
                </Link>
              )
            )}

            {!!(nav.subItems && nav.subItems.length > 0) &&
              (isExpanded || isMobileOpen || t === "dialog") && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${t}-${i}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === t && openSubmenu.index === i
                        ? `${subMenuHeight[`${t}-${i}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="space-y-1 mt-2 ml-9">
                    {nav.subItems
                      .filter(sub => sub.name && sub.name.trim() !== '' && sub.name !== '0')
                      .map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            className={`group flex items-center p-2 text-sm rounded-lg transition-colors
    ${isActive(sub.path)
                                ? nav.name === "Masters"
                                  ? "bg-[#17284b] text-white"
                                  : "text-blue-700 bg-blue-50"
                                : nav.name === "Masters"
                                  ? "text-white/70 hover:bg-[#17284b] hover:text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >

                            <span
                              className={`menu-item-icon-size mr-2 ${isActive(sub.path)
                                ? "menu-item-icon-active"
                                : "menu-item-icon-inactive"
                                }`}
                            >
                              {sub.icon || <GridIcon className="w-5 h-5" />}
                            </span>
                            {sub.name}
                            <span className="flex items-center gap-1 ml-auto">
                              {!!sub.new && (
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded ${isActive(sub.path)
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                  new
                                </span>
                              )}
                              {!!sub.pro && (
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded ${isActive(sub.path)
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                  pro
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
          </li>
        ))}
    </ul>
  );

  const renderUserSection = () => (
    <div className="border-t border-gray-600/30 pt-4 mt-auto">
      <div className={`flex items-center p-1 mb-2 ${!isExpanded ? "lg:justify-center" : ""}`}>
        {!isExpanded ? (
          <div className="flex flex-col items-center justify-center text-center w-full">
            <p className="text-[10px] font-medium text-white/80 truncate max-w-[45px] leading-tight">
              {(tokenData?.name || "User").slice(0, 4)}
            </p>
          </div>
        ) : (
          <div className="ml-2 flex-1 min-w-0">
            <p className="text-sm font-medium text-white dark:text-gray-100 truncate">
            </p>
            {tokenData?.email && (
              <p className="text-sm font-medium text-white dark:text-gray-100 truncate">
                {tokenData.email}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className={`w-full flex items-center text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors ${!isExpanded ? "lg:justify-center lg:flex-col" : ""}`}
        title="Sign out"
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        {isExpanded ? (
          <span className="ml-3 text-sm font-medium">Sign out</span>
        ) : (
          <span className="text-[9px] font-medium text-white/80 truncate max-w-[45px] leading-tight mt-1">
            Sign
          </span>
        )}
      </button>
    </div>
  );

  const renderBottomNavbar = () => {
    const validNavItems = navItems.filter(item =>
      item.name &&
      item.name.trim() !== '' &&
      item.name !== '0' &&
      item.name !== 'undefined'
    );

    const main = validNavItems.slice(0, 3);
    const more = validNavItems.slice(3);

    return (
      <>
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 shadow-lg pb-[env(safe-area-inset-bottom,10px)]">
          <ul className="flex justify-around items-center h-16">
            {main.map(
              (it) =>
                it.path && (
                  <li key={it.name}>
                    <Link
                      to={it.path}
                      className={`flex flex-col items-center justify-center h-full px-2 py-1 ${isActive(it.path)
                        ? "text-blue-700 border-b-2 border-blue-500"
                        : "text-gray-500 hover:bg-gray-100"
                        } transition-colors duration-200`}
                    >
                      <span className="menu-item-icon-size">{it.icon}</span>
                      <span className="text-xs font-medium truncate max-w-[80px]">
                        {it.name}
                      </span>
                    </Link>
                  </li>
                )
            )}
            {validNavItems.length >= 4 && (
              <li>
                <button
                  onClick={() => setIsMoreDialogOpen(true)}
                  className="flex flex-col items-center p-2 text-gray-500"
                >
                  <Ellipsis />
                  <span className="text-xs">More</span>
                </button>
              </li>
            )}
          </ul>
        </nav>

        {!!isMoreDialogOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-end"
            onClick={() => setIsMoreDialogOpen(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 w-full max-h-[70vh] rounded-t-2xl p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  More Menu
                </h2>
                <button
                  onClick={() => setIsMoreDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close dialog"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {renderMenuItems(more, "dialog")}
            </div>
          </div>
        )}
      </>
    );
  };

  const customScrollbarStyles: React.CSSProperties = {
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `
      }} />

      <aside
        className={`hidden lg:flex fixed mt-16 lg:mt-0 top-0 left-0 text-white h-screen transition-all duration-300 z-50  ${isExpanded ? "w-[250px]" : "w-[60px]"}`}
        style={{ backgroundColor: '#17284b' }}
      >
        <div className="flex flex-col w-full h-full">
          <div
            className={`py-3 px-3 flex  ${!isExpanded ? "lg:justify-center" : "justify-between items-center"
              }`}
          >
            {isExpanded && (
              <div className="flex ms-5 items-center">
                <Link to="/">
                  <img
                    width={120}
                    height={120}
                    src="/images/logo/Logo (1).png"
                    alt="Logo"
                  />
                </Link>
              </div>
            )}

            <button
              className="flex justify-center items-center rounded-lg w-8 h-8 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              {isExpanded ? (
                <PanelLeftClose className="size-5" />
              ) : (
                <PanelRightClose className="size-5" />
              )}
            </button>
          </div>

          <div
            className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
            style={customScrollbarStyles}
          >
            <nav className="px-5 pt-4 flex-1">
              {!!navItems.length && (
                <>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"
                      }`}
                  >
                    {isExpanded ? "" : <GridIcon className="size-6" />}
                  </h2>
                  {renderMenuItems(navItems, "main")}
                </>
              )}
            </nav>

            <div className="px-3 pb-4">
              {renderUserSection()}
            </div>
          </div>
        </div>
      </aside>
      {renderBottomNavbar()}
    </>
  );
};

export default AppSidebar;