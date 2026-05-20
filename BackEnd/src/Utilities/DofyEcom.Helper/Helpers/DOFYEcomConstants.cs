namespace DofyEcom.Helper
{
    public static class DOFYEcomConstants
    {
        public const string AES_ENCRYPTIONKEY = "DOFYSEKEYAE$2024";

        public const string HostingEnvironment = "Hosting:Environment";

        public const string ServiceAuthorizationHeaderScheme = "BaseSecurityAPIkey";

        public static bool ACTIVESTATUS { get; set; } = true;

        public static string DATE_FORMAT { get; set; } = "MMM d, yyy";

        public static string TIME_FORMAT { get; set; } = "hh:mm tt";

        public static int StatusId { get; set; } = 3;

        public static string DEFAULT_SQL_DATE { get; set; } = "Jan 1, 1900";

        public static string MASTERDATAFROMCACHE { get; set; } = "ApplicationConfiguration:MasterDataFromCache";

        public static int NEXT_ROW_ORDER { get; set; } = 100;

        public static int JWT_MAX_AGE = 8;

        public static int SMS_ENTITY_TYPE = 14;

        public static int EMAIL_ENTITY_TYPE = 15;
        public static int PAYMENT_STATUS_PENDING = 8;

        public static int PAYMENT_STATUS_COMPLETE = 9;
        public static int PAYMENT_PAYMENT_DONE = 9;
        public static int PAYMENT_DONE_PENDING = 8;
        public static int REFUND_COMPLETED = 11;
        public static int REPLACEMENT_COMPLETED = 18;

        public static string CSVFILEFORMAT { get; set; } = ".csv";

        public static string India { get; set; } = "in";

        public static string UAE { get; set; } = "ae";

        public static string Language_English { get; set; } = "en";

        public static string Language_Arabic { get; set; } = "ar";

        public static class EmailTemplatesInfo
        {
            public const string LOGIN_OTP = "Login_OTP";
            public const string ORDER_COMPLETED_OTP = "Order_Completed_OTP";

        }

    }


    public static class Database
    {
        public static string SP_GetTaxList = "SP_GetTaxList";

        public static string SP_GetUsersByRole = "SP_GetUsersByRole";

        public static string SP_GetCategoryTreeStructure = "SP_GetCategoryTreeStructure";

        public static string SP_GetOrderTotal = "SP_GetOrderTotal";

        public static string SP_ShoppingCartDetails = "SP_ShoppingCartDetails";

        public static string SP_BulkCancel = "SP_BulkCancel";

        public static string SP_GetDofyGeoSearch = "GetDofyGeoSearch";

        public static string SP_GetOrderByCustomerId = "SP_GetOrderByCustomerId";

        public static string SP_GetLocateOurStoresList = "SP_GetLocateOurStoresList";

        public static string SP_GetProductByPrice = "SP_GetProductByPrice";

        public static string SP_GetHomePageFilter = "SP_GetHomePageFilter";

        public static string SP_GetSpecificationFilter = "SP_GetSpecificationFilter";

        public static string SP_GetSpecificationDetails = "SP_GetSpecificationDetails";

        public static string SP_SearchProducts = "SP_SearchProducts";

        public static string SP_InActiveProduct = "SP_InActiveProduct";

        public static string SP_ActiveProduct = "SP_ActiveProduct";

        public static string SP_GetProductDetails = "SP_GetProductDetails";

        public static string SP_CreateProduct = "SP_CreateProduct";

        public static string SP_UpdateProduct = "SP_UpdateProduct";

        public static string SP_GetScreensWithPermissions = "SP_GetScreensWithPermissions";

        public static string SP_CreateOrUpdateTaxManagement = "CreateOrUpdateTaxManagement";

        public static string SP_CreateProductVariant = "SP_CreateProductVariant";

        public static string SP_AdjustVariantStockById = "SP_AdjustVariantStockById";

        public static string SP_CreateOrder = "SP_CreateOrder";

        public static string sp_GetPartnerPaymentSummary = "sp_GetPartnerPaymentSummary";

        public static string SP_GetCategoryMaster = "SP_GetCategoryMaster";

        public static string SP_GetSubCategoryMaster = "SP_GetSubCategoryMaster";

        public static string SP_GetItemsSubCategoryMaster = "SP_GetItemsSubCategoryMaster";

        public static string sp_GetPartnerPaymentById = "sp_GetPartnerPaymentById";
        public static string sp_GetPartnerPaymentStats = "sp_GetPartnerPaymentStats";
        
        public static string SP_GetDashboardStatistics = "SP_GetDashboardStatistics";

        public static string SP_CreateOrUpdateRolePermissionMapping = "SP_CreateOrUpdateRolePermissionMapping";
        

        public static string SP_GetOrders = "SP_GetOrders";

        public static string SP_GetOrderDetails = "SP_GetOrderDetails";
        // Returns SPs
        public static string SP_CreateReturnRequest = "SP_CreateReturnRequest";

        public static string SP_GetReturnById = "SP_GetReturnById";

        public static string SP_UpdateReturnStatus = "SP_UpdateReturnStatus";

        public static string SP_GetAllReturns = "SP_GetAllReturns";

        public static string SP_CancelOrder = "SP_CancelOrder";

        public static string UpdateOrderStatusById = "UpdateOrderStatusById";
        

        public static string SP_GetInventoryReport = "SP_GetInventoryReport";

        public static string SP_UpdateProductInventory = "SP_UpdateProductInventory";

        public static string SP_GetProductById = "SP_GetProductById";

        public static string VW_Discounts { get; set; } = "VW_Discounts";

        public static string sp_GetUserById { get; set; } = "sp_GetUserById";
        //prommo
        public static string SP_GetPromoList = "SP_GetPromoList";
        public static string SP_GetPromoDetailsById = "SP_GetPromoDetailsById";
        public static string SP_CreateOrUpdatePromo = "SP_CreateOrUpdatePromo";
        public static string SP_TogglePromoStatus = "SP_TogglePromoStatus";
        //product-variant level edit
        public static string SP_GetVariantForEdit = "SP_GetVariantForEdit";
        public static string SP_GetBrandsByCategory = "SP_GetBrandsByCategory";
        public static string SP_GetStaticCount = "SP_GetStaticCount";
        public static string SP_GetLatestOrder = "SP_GetLatestOrder";
        public static string SP_GetGraphPath = "SP_GetGraphPath";
    }


}