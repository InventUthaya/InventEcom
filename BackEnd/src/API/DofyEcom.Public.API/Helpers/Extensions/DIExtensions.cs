
using DofyEcom.Contract;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.Model;
using DofyEcom.UploadHelper;

namespace DofyEcom.Public.API.Helpers
{
    public static class DIExtensions
    {
        public static IServiceCollection RegisterModelDependencies(this IServiceCollection services)
        {

            services.AddScoped<IAuthModel, AuthModel>();

            services.AddScoped<IUserLoginModel, UserLoginModel>();


            services.AddScoped<IUserMasterModel, UserMasterModel>();

            services.AddScoped<IUserAddressModel, UserAddressModel>();

            services.AddScoped<ICartMasterModel, CartMasterModel>();

            services.AddScoped<IOrderDetailModel, OrderDetailModel>();

            services.AddScoped<IProductMasterModel, ProductMasterModel>();

            services.AddScoped<IS3ClientHelperService, S3ClientHelperService>();

            services.AddScoped<ISkuModel, SkuModel>();

            services.AddScoped<IRiderAssignmentModel, RiderAssignmentModel>();

            services.AddScoped<IOrderHeaderModel, OrderHeaderModel>();

            services.AddScoped<IScreenMasterModel, ScreenMasterModel>();

            services.AddScoped<ITaxManagementModel, TaxManagementModel>();

            services.AddScoped<IProductVariantModel, ProductVariantModel>();

            services.AddScoped<IReturnRequestModel, ReturnRequestModel>();

            services.AddScoped<IPaymentModel, PaymentTransactionModel>();

            services.AddScoped<IDiscountMasterModel, DiscountMasterModel>();

            services.AddScoped<IProductBoxItemModel, ProductBoxItemModel>();
            services.AddScoped<IPromoCodeModel, PromoCodeModel>();
            services.AddScoped<IProductSpecificationModel, ProductSpecificationModel>();

            services.AddScoped<IRoleMasterModel, RoleMasterModel>();

            services.AddScoped<IUserRoleMappingModel, UserRoleMappingModel>();

            services.AddScoped<IReturnsModel, ReturnsModel>();

            services.AddScoped<BrandMasterModel>();
            services.AddScoped<GradeMasterModel>();
            services.AddScoped<ColorMasterModel>();
            services.AddScoped<RamMasterModel>();
            services.AddScoped<StorageMasterModel>();
            services.AddScoped<TaxMasterModel>();

            services.AddScoped<IInvoiceTemplateModel, InvoiceTemplateModel>();
            services.AddScoped<ICategoryMasterModel, CategoryMasterModel>();

            services.AddScoped<IPublicLocateOurStoresModel, LocateOurStoresModel>();

            services.AddScoped<IContactUsConfigModel, ContactUsConfigModel>();
            services.AddScoped<IDofyGeoModel, DofyGeoModel>();

            services.AddScoped<ISubCategoryMasterModel, SubCategoryMasterModel>();
            services.AddScoped<IItemsCategoryMasterModel, ItemsCategoryMasterModel>();

            services.AddScoped<IProductReviewModel, ProductReviewModel>();

            services.AddScoped<IOrderHistoryModel, OrderHistoryModel>();
            services.AddScoped<ICommissionSlabModel, CommissionSlabModel>();
            services.AddScoped<ICommissionSlabDetailsModel, CommissionSlabDetailsModel>();

            return services;
        }
    }
}

