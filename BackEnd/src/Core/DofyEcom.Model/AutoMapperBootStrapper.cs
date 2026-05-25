namespace DofyEcom.Model;

using AutoMapper;
using DofyEcom.DataMappers;
using DofyEcom.DataMappers.EntityMappers;
using DofyEcom.DataMappers.ModelMappers;

public class AutoMapperBootStrapper : Profile
{
    public AutoMapperBootStrapper()
    {
        //Entity Mappers
        this.CreateMap<DBO.OrderHistory, ViewEntities.OrderHistory>().ConvertUsing(new OrderHistoryEntityMapper());
        this.CreateMap<DBO.ProductMaster, ViewEntities.ProductMaster>().ConvertUsing(new ProductMasterEntityMapper());
        this.CreateMap<DBO.StatusMaster, ViewEntities.StatusMaster>().ConvertUsing(new StatusEntityMapper());
        this.CreateMap<DBO.ProductVariant, ViewEntities.ProductVariant>().ConvertUsing(new ProductVariantEntityMapper());
        this.CreateMap<DBO.Sku, ViewEntities.Sku>().ConvertUsing(new SKUEntityMapper());
        this.CreateMap<DBO.StockLedger, ViewEntities.StockLedger>().ConvertUsing(new StockLedgerEntityMapper());
        this.CreateMap<DBO.RiderAssignment, ViewEntities.RiderAssignment>().ConvertUsing(new RiderAssignmentEntityMapper());
        this.CreateMap<DBO.OrderHeader, ViewEntities.OrderHeader>().ConvertUsing(new OrderHeaderEntityMapper());
        this.CreateMap<DBO.ScreenMaster, ViewEntities.ScreenMaster>().ConvertUsing(new ScreenMasterEntityMapper());
        this.CreateMap<DBO.PermissionMaster, ViewEntities.PermissionMaster>().ConvertUsing(new PermissionMasterEntityMapper());
        this.CreateMap<DBO.RolePermissionMapping, ViewEntities.RolePermissionMapping>().ConvertUsing(new RolePermissionMappingEntityMapper());
        this.CreateMap<DBO.TaxManagement, ViewEntities.TaxManagement>().ConvertUsing(new TaxManagementEntityMapper());
        this.CreateMap<DBO.OrderDetail, ViewEntities.OrderDetail>().ConvertUsing(new OrderDetailEntityMapper());
        this.CreateMap<DBO.UserLogin, ViewEntities.UserLogin>().ConvertUsing(new UserLoginEntityMapper());
        this.CreateMap<DBO.UserLogin, ViewEntities.UserLogin>().ConvertUsing(new UserLoginEntityMapper());
        this.CreateMap<DBO.AuthOTP, ViewEntities.AuthOTP>().ConvertUsing(new AuthOTPEntityMapper());
        this.CreateMap<DBO.Returns, ViewEntities.Returns>().ConvertUsing(new ReturnsEntityMapper());
        this.CreateMap<DBO.Cart, ViewEntities.Cart>().ConvertUsing(new DofyEcom.DataMappers.EntityMappers.CartMasterEntityMapper());
        this.CreateMap<DBO.PaymentTransaction, ViewEntities.PaymentTransaction>().ConvertUsing(new DofyEcom.DataMappers.EntityMappers.PaymentTransactionEntityMapper());
        this.CreateMap<DBO.UserMaster, ViewEntities.UserMaster>().ConvertUsing(new DofyEcom.DataMappers.EntityMappers.UserMasterEntityMapper());
        this.CreateMap<DBO.ProductBoxItem, ViewEntities.ProductBoxItem>().ConvertUsing(new DofyEcom.DataMappers.EntityMappers.ProductBoxItemEntityMapper());
        this.CreateMap<DBO.ProductSpecification, ViewEntities.ProductSpecification>().ConvertUsing(new DofyEcom.DataMappers.EntityMappers.ProductSpecificationEntityMapper());
        this.CreateMap<DBO.UserMaster, ViewEntities.UserMaster>().ConvertUsing(new UserMasterEntityMapper());
        this.CreateMap<DBO.RoleMaster, ViewEntities.RoleMaster>().ConvertUsing(new RoleMasterEntityMapper());
        this.CreateMap<DBO.UserAddress, ViewEntities.UserAddress>().ConvertUsing(new UserAddressEntityMapper());
        this.CreateMap<DBO.UserRoleMapping, ViewEntities.UserRoleMapping>().ConvertUsing(new UserRoleMappingEntityMapper());
        this.CreateMap<DBO.InvoiceTemplate, ViewEntities.InvoiceTemplate>().ConvertUsing(new InvoiceTemplateEntityMapper());
        this.CreateMap<DBO.PromoCode, ViewEntities.PromoCode>().ConvertUsing(new PromoCodeEntityMapper());
        this.CreateMap<DBO.PromoSKU, ViewEntities.PromoSKU>().ConvertUsing(new PromoSKUEntityMapper());
        this.CreateMap<DBO.DofyGeo, ViewEntities.DofyGeo>().ConvertUsing(new DofyGeoEntityMapper());
        this.CreateMap<DBO.CategoryMaster, ViewEntities.CategoryMaster>();
        this.CreateMap<DBO.SubCategoryMaster, ViewEntities.SubCategoryMaster>();
        this.CreateMap<DBO.ItemsCategoryMaster, ViewEntities.ItemsCategoryMaster>();
        this.CreateMap<DBO.ProductReview, ViewEntities.ProductReview>();
        this.CreateMap<DBO.ProductImages, ViewEntities.ProductImages>().ConvertUsing(new ProductImagesEntityMapper());
        this.CreateMap<DBO.PartnerPayment, ViewEntities.PartnerPayment>().ConvertUsing(new PartnerPaymentEntityMapper());
        this.CreateMap<DBO.PartnerMaster, ViewEntities.PartnerMaster>().ConvertUsing(new PartnerMasterEntityMapper());
        this.CreateMap<DBO.CommissionSlab, ViewEntities.CommissionSlab>().ConvertUsing(new CommissionSlabEntityMapper());
        this.CreateMap<DBO.CommissionSlabDetails, ViewEntities.CommissionSlabDetails>().ConvertUsing(new CommissionSlabDetailsEntityMapper());
        this.CreateMap<DBO.BrandMaster, ViewEntities.BrandMaster>().ConvertUsing(new BrandMasterEntityMapper());

        //Model Mappers
        this.CreateMap<ViewEntities.ProductMaster, DBO.ProductMaster>().ConvertUsing(new ProductMasterModelMapper());
        this.CreateMap<ViewEntities.OrderHistory, DBO.OrderHistory>().ConvertUsing(new OrderHistoryModelMapper());
        this.CreateMap<ViewEntities.DofyGeo, DBO.DofyGeo>().ConvertUsing(new DofyGeoModelMapper());
        this.CreateMap<ViewEntities.StatusMaster, DBO.StatusMaster>().ConvertUsing(new StatusModelMapper());
        this.CreateMap<ViewEntities.ProductVariant, DBO.ProductVariant>().ConvertUsing(new ProductVariantModelMapper());
        this.CreateMap<ViewEntities.Sku, DBO.Sku>().ConvertUsing(new SKUModelMapper());
        this.CreateMap<ViewEntities.StockLedger, DBO.StockLedger>().ConvertUsing(new StockLedgerModelMapper());
        this.CreateMap<ViewEntities.RiderAssignment, DBO.RiderAssignment>().ConvertUsing(new RiderAssignmentModelMapper());
        this.CreateMap<ViewEntities.OrderHeader, DBO.OrderHeader>().ConvertUsing(new OrderHeaderModelMapper());
        this.CreateMap<ViewEntities.ScreenMaster, DBO.ScreenMaster>().ConvertUsing(new ScreenMasterModelMapper());
        this.CreateMap<ViewEntities.PermissionMaster, DBO.PermissionMaster>().ConvertUsing(new PermissionMasterModelMapper());
        this.CreateMap<ViewEntities.RolePermissionMapping, DBO.RolePermissionMapping>().ConvertUsing(new RolePermissionMappingModelMapper());
        this.CreateMap<ViewEntities.TaxManagement, DBO.TaxManagement>().ConvertUsing(new TaxManagementModelMapper());
        this.CreateMap<ViewEntities.OrderDetail, DBO.OrderDetail>().ConvertUsing(new OrderDetailModelMapper());
        this.CreateMap<ViewEntities.UserLogin, DBO.UserLogin>().ConvertUsing(new UserLoginModelMapper());
        this.CreateMap<ViewEntities.UserLogin, DBO.UserLogin>().ConvertUsing(new UserLoginModelMapper());
        this.CreateMap<ViewEntities.AuthOTP, DBO.AuthOTP>().ConvertUsing(new AuthOTPModelMapper());
        this.CreateMap<ViewEntities.Returns, DBO.Returns>().ConvertUsing(new ReturnsModelMapper());
        this.CreateMap<ViewEntities.Cart, DBO.Cart>().ConvertUsing(new DofyEcom.DataMappers.CartMasterModelMapper());
        this.CreateMap<ViewEntities.PaymentTransaction, DBO.PaymentTransaction>().ConvertUsing(new DofyEcom.DataMappers.PaymentTransactionModelMapper());
        this.CreateMap<ViewEntities.UserMaster, DBO.UserMaster>().ConvertUsing(new UserMasterModelMapper());
        this.CreateMap<ViewEntities.ProductBoxItem, DBO.ProductBoxItem>().ConvertUsing(new ProductBoxItemModelMapper());
        this.CreateMap<ViewEntities.ProductSpecification, DBO.ProductSpecification>().ConvertUsing(new ProductSpecificationModelMapper());
        this.CreateMap<ViewEntities.RoleMaster, DBO.RoleMaster>().ConvertUsing(new RoleMasterModelMapper());
        this.CreateMap<ViewEntities.UserAddress, DBO.UserAddress>().ConvertUsing(new UserAddressModelMapper());
        this.CreateMap<ViewEntities.UserRoleMapping, DBO.UserRoleMapping>().ConvertUsing(new UserRoleMappingModelMapper());
        this.CreateMap<ViewEntities.InvoiceTemplate, DBO.InvoiceTemplate>().ConvertUsing(new InvoiceTemplateModelMapper());
        this.CreateMap<ViewEntities.PromoCode, DBO.PromoCode>().ConvertUsing(new PromoCodeModelMapper());
        this.CreateMap<ViewEntities.PromoSKU, DBO.PromoSKU>().ConvertUsing(new PromoSKUModelMapper());
        this.CreateMap<ViewEntities.CategoryMaster, DBO.CategoryMaster>();
        this.CreateMap<ViewEntities.SubCategoryMaster, DBO.SubCategoryMaster>();
        this.CreateMap<ViewEntities.ItemsCategoryMaster, DBO.ItemsCategoryMaster>();
        this.CreateMap<ViewEntities.ProductReview, DBO.ProductReview>();
        this.CreateMap<ViewEntities.ProductImages, DBO.ProductImages>().ConvertUsing(new ProductImagesModelMapper());
        this.CreateMap<ViewEntities.PartnerPayment, DBO.PartnerPayment>().ConvertUsing(new PartnerPaymentModelMapper());
        this.CreateMap<ViewEntities.PartnerMaster, DBO.PartnerMaster>().ConvertUsing(new PartnerMasterModelMapper());
        this.CreateMap<ViewEntities.CommissionSlab, DBO.CommissionSlab>().ConvertUsing(new CommissionSlabModelMapper());
        this.CreateMap<ViewEntities.CommissionSlabDetails, DBO.CommissionSlabDetails>().ConvertUsing(new CommissionSlabDetailsModelMapper());
        this.CreateMap<ViewEntities.BrandMaster, DBO.BrandMaster>().ConvertUsing(new BrandMasterModelMapper());
    }
}
