import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import NotFound from "./pages/OtherPage/NotFound";
import { publicRoutes, componentMap } from "./routes/AppRoutes";
import AuthProtectedRoute from "./routes/AuthProtectedRoute";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";

function SidebarRouteListener() {
  const location = useLocation();
  const { reloadMenu } = useSidebar();

  useEffect(() => {
    reloadMenu(); 
  }, [location.pathname]);

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
