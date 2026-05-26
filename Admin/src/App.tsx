import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import NotFound from "./pages/OtherPage/NotFound";
import { publicRoutes, componentMap } from "./routes/AppRoutes";
import AuthProtectedRoute from "./routes/AuthProtectedRoute";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";

function SidebarRouteListener() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reloadMenu, menuItems } = useSidebar();

  useEffect(() => {
    reloadMenu(); 
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/" && menuItems.length > 0) {
      const hasDashboardAccess = menuItems.some(item => item.path === "/");
      if (!hasDashboardAccess) {
        navigate(menuItems[0].path);
      }
    }
  }, [location.pathname, menuItems, navigate]);

  return null;
}

export default function App() {
  return (
    <SidebarProvider>
      <Router>
        <SidebarRouteListener />
        <ScrollToTop />

        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, idx) => (
            <Route key={idx} path={route.path} element={<route.component />} />
          ))}

          {/* Protected Routes */}
          {Object.entries(componentMap).map(([path, Component], idx) => (
            <Route
              key={idx}
              path={path}
              element={
                <AuthProtectedRoute>
                  <AppLayout>
                    <Component />
                  </AppLayout>
                </AuthProtectedRoute>
              }
            />
          ))}

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}
