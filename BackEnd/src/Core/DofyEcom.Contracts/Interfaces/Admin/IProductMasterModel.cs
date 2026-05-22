using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom;
using DofyEcom.Contracts.Requests;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Contracts
{
    public interface IProductMasterModel : IEntityModel<ProductMaster>
    {
        Task<int> CreateProduct(CreateProductRequest request);

        SearchProductsResult GetAllProducts(ProductSearchRequest request);

        Task<ProductDetailsViewModel> GetProductDetails(int productId);

        Task<IEnumerable<ViewEntities.CommissionSlab>> GetCommissionDetails();

        Task<IEnumerable<ViewEntities.CommissionSlabDetails>> GetAllCommissionSlabDetails();
        Task<int> UpdateProduct(CreateProductRequest request);

        Task<IEnumerable<GetProductByIdViewModel>> GetInventoryFilteredAsync(InventoryFilterRequest request);

        Task<GetProductByIdViewModel> GetProductByIdAsync(int productId);
        Task<GetProductByIdViewModel> GetVariantForEditAsync(int variantId);


        Task<IEnumerable<GetProductByIdViewModel>> GetInventoryReportAsync();

        Task UpdateProductAsync(UpdateProductViewModel model);

        Task<PagedList<ProductMaster>> GetProducts(IEnumerable<long> id);

        IEnumerable<ProductMaster> GetListBysearch(string searchText);

        Task<PagedList<GetProductByIdViewModel>> GetRelatedProduct(string productName);

        Task<PagedList<ProductDetailsViewModel>> GetRelatedProductById(int productId);

        PagedList<FilterViewModel> GetSpecificationFilter(string? Brand, string? Condition, string? StorageSize, string? ItemCategory, string? Price, string? Category, string? Ram, string? Color);

        PagedList<FilterViewModel> GetSpecificationDetails();

        PagedList<FilterViewModel> GetHomePageFilter([FromBody] DateTime clientTime);

        PagedList<GetProductByPriceViewModel> GetProductByPrice(string? price, int? categoryId);

        PagedList<SearchProductResponse> InActiveProducts(ActiveAndInActiveModelRequest request);

        PagedList<SearchProductResponse> ActiveProducts(ActiveAndInActiveModelRequest request);
        Task<CategoryTreeResponseViewModel> GetAllCategoryProducts();
        PagedList<FilterViewModel> GetDiscountAppliedProducts();
    }
}
