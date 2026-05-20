import { createContext, useContext, useEffect, useState } from "react";

type MenuItem = {
  name: string;
  path: string;
  iconName: string;
};

type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  menuItems: MenuItem[];
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (v: boolean) => void;
  setActiveItem: (v: string | null) => void;
  toggleSubmenu: (item: string) => void;
  reloadMenu: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };

    onResize();
    window.addEventListener("resize", onResize);
    setInitialized(true);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadMenu = () => {
    try {
      const screenMasterStr = localStorage.getItem("ScreenMaster");
      const rolePermissionStr = localStorage.getItem("RolePermission");

      if (!screenMasterStr || !rolePermissionStr) {
        setMenuItems([]);
        return;
      }

      const screenMaster = JSON.parse(screenMasterStr);
      const rolePermissions = JSON.parse(rolePermissionStr);

      // Take the first role from the array
      const currentRoleId = rolePermissions[0]?.RoleId;

      if (!currentRoleId) {
        setMenuItems([]);
        return;
      }

      // Filter screens based on this role
      const allowedScreenIds = rolePermissions
        .filter(
          (p: any) =>
            Number(p.RoleId) === Number(currentRoleId) &&
            (p.DisplayInList === true || p.DisplayInList === 1 || p.DisplayInList === "1")
        )
        .map((p: any) => Number(p.ScreenId));

      const items: MenuItem[] = screenMaster
        .filter(
          (s: any) =>
            allowedScreenIds.includes(Number(s.Id)) &&
            s.IsActive &&
            (s.IsSidebar === true || s.IsSidebar === 1 || s.IsSidebar === "1")
        )
        .map((s: any) => ({
          name: s.ScreenName,
          path: s.ScreenCode,
          iconName: s.Icon || "GridIcon",
        }));

      setMenuItems(items);
    } catch (err) {
      console.error("Sidebar menu error:", err);
      setMenuItems([]);
    }
  };


  useEffect(() => {
    loadMenu();
  }, []);

  const toggleSidebar = () => setIsExpanded((p) => !p);
  const toggleMobileSidebar = () => setIsMobileOpen((p) => !p);
  const toggleSubmenu = (item: string) =>
    setOpenSubmenu((p) => (p === item ? null : item));

  if (!initialized) return null;

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        menuItems,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
        reloadMenu: loadMenu, // ✅ EXPOSED
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
