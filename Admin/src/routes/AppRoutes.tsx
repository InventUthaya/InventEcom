import ForgotPassword from "../pages/AuthPages/ForgotPassword";
import ResetPassword from "../pages/AuthPages/ResetPassword";
import SignIn from "../pages/AuthPages/SignIn";
import TwoStepVerification from "../pages/AuthPages/TwoStepVerification";
import UpdatePassword from "../pages/AuthPages/UpdatePassword";

import Dashboard from "../pages/dashboard/Dashboard";
import InventoryReport from "../pages/InventoryReport/InventoryReportDashboard";
import EditProduct from "../pages/InventoryReport/InventoryReportEditScreen";
import OrderDashboard from "../pages/Orders/OrderDashboard";
import ProductDashboard from "../pages/ProductDashbord.tsx/ProductDashboard";
import PromoCodeDashboard from "../pages/PromoCode/PromoCodeDashboard";
import PromoCodeForm from "../pages/PromoCode/PromoCodeForm";
import RefundDashboard from "../pages/RefundManagement/RefundDashboard";
import RefundOrderDetails from "../pages/RefundManagement/RefundOrderDetails";
import ScreenAccessibility from "../pages/ScreenAccessibility/ScreenAccessibility";
import TaxationDashboard from "../pages/TaxManagement/TaxationDashboard";
import TaxationForm from "../pages/TaxManagement/TaxationForm";
import UserCreate from "../pages/User Management/UserForm";
import UserManagement from "../pages/User Management/UserManagement";
import ProductEdit from "../pages/ProductDashbord.tsx/ProductEdit";
import PaymentDashboard from "../pages/PartnerPayment/PartnerPaymentDashboard";
import PartnerEdit from "../pages/PartnerPayment/PartnerEdit";
import PaymentDetails from "../pages/PartnerPayment/PaymentDetails";
import MenuDashBoard from "../pages/Masters/Menu/MenuDashboard";
import CategoryDashboard from "../pages/Masters/Category/CategoryDashboard";
import SubCategoryDashboard from "../pages/Masters/SubCategory/SubCategoryDashboard";
import BrandDashboard from "../pages/Masters/Brand/BrandDashboard";

export const publicRoutes = [
  { path: "/signin", component: SignIn },
  { path: "/two-step-verification", component: TwoStepVerification },
  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password/:id", component: ResetPassword },
  { path: "/update-password", component: UpdatePassword },
];

export const componentMap: { [key: string]: React.ComponentType<any> } = {
  "/": Dashboard,
  "/order-dashboard": OrderDashboard,
  "/refund-management": RefundDashboard,
  "/refund-order-details/:orderNumber": RefundOrderDetails,
  "/tax-Management-dashboard": TaxationDashboard,
  "/taxation-form": TaxationForm,
  "/taxation-form/:id": TaxationForm,
  "/promo-code-dashboard": PromoCodeDashboard,
  "/promo-code-form": PromoCodeForm,
  "/promo-code-form/:id": PromoCodeForm,
  "/screen-accessibility": ScreenAccessibility,
  "/inventory-report": InventoryReport,
  "/product/edit/:productId/:variantId": EditProduct,
  "/user-management": UserManagement,
  "/user-management/add": UserCreate,
  "/user-management/edit/:id": UserCreate,
  "/product-dashboard": ProductDashboard,
  "/product-form": ProductEdit,
  "/product-form/:id": ProductEdit,
  "/payment": PaymentDashboard,
  "/payment/:id": PartnerEdit,
  "/paymentdetail":PaymentDetails,
  "/menu":MenuDashBoard,
  "/category":CategoryDashboard,
  "/subcategory":SubCategoryDashboard,
  "/brand":BrandDashboard
};
