using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.DAL;
using DofyEcom.DAL;
using DofyEcom.DAL.Interfaces;
using DofyEcom.DAL.Mapper;
using DofyEcom.DBO;
using DofyEcom.Helper;
using DofyEcom.Logger;
using DofyEcom.UploadHelper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class ProductMasterModel : BaseModel<DBO.ProductMaster>, IProductMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly TimeSpan cacheExpiration = TimeSpan.FromMinutes(5);
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;
        private int iConfig;

        public ProductMasterModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IMemoryCache memoryCache, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this._memoryCache = memoryCache;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        //public async Task<int> CreateProduct(CreateProductRequest request)
        //{
        //    try
        //    {
        //        if (request == null || request.product == null)
        //            throw new ApplicationException("Product details are required.");

        //        //var product = this.mapper.Map<ViewEntities.ProductMaster, DBO.ProductMaster>(request.product);
        //        //var prodtId = this.AddItem(product);
        //        //int productId = (int)request.product.Id;

        //        int productId = 0;


        //        var productEntity = this.mapper.Map<ViewEntities.ProductMaster, DBO.ProductMaster>(request.product);
        //        var newProductId = this.AddItem(productEntity);
        //        productId = (int)newProductId;


        //        if (request.specification != null)
        //        {
        //            foreach (var spec in request.specification)
        //            {
        //                spec.ProductId = productId;
        //                spec.IsActive = true;
        //                var specification = this.mapper.Map<ViewEntities.ProductSpecification, DBO.ProductSpecification>(spec);
        //                new ProductSpecificationModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                    .AddItem(specification);
        //            }
        //        }

        //        if (request.productBoxItem != null)
        //        {
        //            foreach (var boxItem in request.productBoxItem)
        //            {
        //                boxItem.ProductId = productId;
        //                var productBoxItem = this.mapper.Map<ViewEntities.ProductBoxItem, DBO.ProductBoxItem>(boxItem);
        //                new ProductBoxItemModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                    .AddItem(productBoxItem);
        //            }
        //        }

        //        if (request.variants == null || request.variants.Count == 0)
        //            throw new ApplicationException("At least one product variant is required.");

        //        var variants = this.mapper.Map<List<ViewEntities.ProductVariant>, List<DBO.ProductVariant>>(request.variants);
        //        variants.ForEach(v => v.ProductId = productId);

        //        string productImageFolder = $"products/{productId}/images";

        //        for (int i = 0; i < request.variants.Count; i++)
        //        {
        //            var requestVariant = request.variants[i];
        //            var variant = this.mapper.Map<DBO.ProductVariant>(requestVariant);
        //            variant.StatusId = 11;
        //            variant.IsActive = true;
        //            variant.ProductId = productId;

        //            // Insert variant
        //            int variantId = (int)new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                .AddItem(variant);


        //            // Build SKU
        //            var sku = this.mapper.Map<ViewEntities.Sku, DBO.Sku>(request.sku);
        //            sku.ProductId = productId;
        //            sku.VariantId = variantId;
        //            sku.SellingPrice = variant.BasePrice - variant.DiscountPrice;
        //            sku.MRP = variant.BasePrice;
        //            sku.StockQty = variant.StockQty;
        //            sku.StatusId = variant.StatusId;
        //            sku.IsActive = true;

        //            IFormFile? variantImage = requestVariant.Image;
        //            String variantImageName = requestVariant.Image.FileName;
        //            String ImageFolder = productImageFolder + "/" + variantId;

        //            String variantImageFolder = ImageFolder + "/" + variantImageName;

        //            variant.Id = variantId;
        //            variant.ImagePath = variantImageFolder;
        //            new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                .UpdateItem(variant);


        //            if (variantImage != null && variantImage.Length > 0)
        //            {
        //                string imagePath = await UploadVariantImage(variantImage, productId, variantId, ImageFolder);
        //                sku.ImagePath = productImageFolder;
        //            }

        //            // Insert SKU
        //            new SkuModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                .AddItem(sku);
        //        }

        //        return productId;
        //    }
        //    catch (SqlException sqlEx)
        //    {
        //        throw new ApplicationException("A database error occurred while creating the product.", sqlEx);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException("An unexpected error occurred while creating the product.", ex);
        //    }
        //}

            public async Task<int> CreateProduct(CreateProductRequest request)
            {
                try
                {
                var productEntity = this.mapper.Map<ViewEntities.ProductMaster, DBO.ProductMaster>(request.product);
                var isPartner = false;
                int partnerId = 0;
                var partner = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == request.PersonId);

                if (partner.RoleId == (int)ROLES_ENUM.PARTNER)
                {
                    isPartner = true;
                    var data = new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == partner.UserId);
                    productEntity.PartnerId = (int)data.Id;
                    partnerId = (int)data.Id;
                }
                if (request == null || request.product == null)
                        throw new ApplicationException("Product details are required.");
                    var newProductId = this.AddItem(productEntity);
                    int productId = (int)newProductId;

                    // 2. Specifications
                    if (request.specification != null)
                    {
                        foreach (var spec in request.specification)
                        {
                            spec.ProductId = productId;
                            spec.IsActive = true;
                            var specification = this.mapper.Map<ViewEntities.ProductSpecification, DBO.ProductSpecification>(spec);
                            new ProductSpecificationModel(this.config, this.mapper, this.iPrincipal, this.context)
                                .AddItem(specification);
                        }
                    }

                    // 3. Box items
                    if (request.productBoxItem != null)
                    {
                        foreach (var boxItem in request.productBoxItem)
                        {
                            boxItem.ProductId = productId;
                            var productBoxItem = this.mapper.Map<ViewEntities.ProductBoxItem, DBO.ProductBoxItem>(boxItem);
                            new ProductBoxItemModel(this.config, this.mapper, this.iPrincipal, this.context)
                                .AddItem(productBoxItem);
                        }
                    }

                    // 4. Validate variants
                    if (request.variants == null || request.variants.Count == 0)
                        throw new ApplicationException("At least one product variant is required.");

                    // 5. Create variants & SKUs (no individual image handling here)
                    var variants = this.mapper.Map<List<ViewEntities.ProductVariant>, List<DBO.ProductVariant>>(request.variants);
                    variants.ForEach(v => v.ProductId = productId);

                    string productImageFolder = $"products/{productId}/images";

                    foreach (var requestVariant in request.variants)
                    {
                        var variant = this.mapper.Map<DBO.ProductVariant>(requestVariant);
                        variant.StatusId = 11;
                        variant.IsActive = true;
                        variant.ProductId = productId;
                    if (isPartner)
                    {
                        variant.PartnerId = partnerId;
                    }

                        // Insert variant
                        int variantId = (int)new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
                            .AddItem(variant);

                        // SKU
                        var sku = this.mapper.Map<ViewEntities.Sku, DBO.Sku>(request.sku);
                        sku.ProductId = productId;
                        sku.VariantId = variantId;
                        sku.SellingPrice = variant.BasePrice;
                        sku.MRP = variant.Price;
                        sku.StockQty = variant.StockQty;
                        sku.StatusId = variant.StatusId;
                        sku.IsActive = true;

                    if (isPartner)
                    {
                        sku.PartnerId = partnerId;
                    }

                        new SkuModel(this.config, this.mapper, this.iPrincipal, this.context)
                            .AddItem(sku);
                    }

                    // 6. Save images per color (NEW SECTION)
                    if (request.ColorImages != null && request.ColorImages.Any())
                    {
                        foreach (var colorImageGroup in request.ColorImages)
                        {
                            int colorId = colorImageGroup.ColorId;
                            string colorFolder = $"{productImageFolder}/{colorId}";

                            foreach (var file in colorImageGroup.ImageFile)
                            {
                                if (file != null && file.Length > 0)
                                {
                                    string savedPath = await UploadVariantImage(file, productId, colorId, colorFolder);
                                    string dbImagePath = colorFolder + '/' + file.FileName;
                                    var productImage = new DBO.ProductImages
                                    {
                                        ProductId = productId,
                                        ColorId = colorId,
                                        ImagePath = dbImagePath,
                                        IsActive = true,
                                        Created = DateTime.UtcNow
                                    };
                                    new ProductImagesModel(this.config, this.mapper, this.iPrincipal, this.context)
                                        .AddItem(productImage);
                                }
                            }
                        }
                    }

                    return productId;
                }
                catch (SqlException sqlEx)
                {
                    throw new ApplicationException("A database error occurred while creating the product.", sqlEx);
                }
                catch (Exception ex)
                {
                    throw new ApplicationException("An unexpected error occurred while creating the product.", ex);
                }
            }

        // Helper method to upload image for a color
        private async Task<string> UploadColorImage(IFormFile file, int productId, int colorId, string colorFolder)
        {
            // Ensure directory exists
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", colorFolder);
            Directory.CreateDirectory(fullPath);

            var fileName = file.FileName;
            var filePath = Path.Combine(fullPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path to store in DB
            return $"{colorFolder}/{fileName}";
        }

        public async Task<IEnumerable<GetProductByIdViewModel>> GetInventoryReportAsync()
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@PartnerId", null);
                var results = await Task.Run(() => this.ExecStoredProcedure<GetProductByIdViewModel>(Database.SP_GetInventoryReport, parameters).ToList());

                return results;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while fetching the inventory report.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while fetching the inventory report.", ex);
            }
        }

        private async Task<string> UploadVariantImage(IFormFile image, int productId, int variantId, string baseFolder)
        {
            try
            {
                //string fileName = $"variant_{variantId}_{Guid.NewGuid():N}{Path.GetExtension(image.FileName)}";
                string filePath = $"{baseFolder}/{image.FileName}";

                if (this.config?.Value.AWSConfiguration?.EnableS3 == true)
                {
                    using (var stream = image.OpenReadStream())
                    {
                        await new S3ClientHelperService(this.config, this.GetS3FolderName(this.context.CountryCode)).FileUploadAsync(stream, filePath);
                    }
                }
                else
                {
                    string localPath = Path.Combine(this.config.Value.ApplicationConfiguration.AttachmentFilePath, baseFolder);
                    filePath = await SaveLocalAttachment(image, localPath, image.FileName);
                }

                return filePath;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Failed to upload variant image for product {productId}, variant {variantId}", ex);
            }
        }

        private async Task<string> SaveLocalAttachment(IFormFile file, string absoluteFilePath, string fileName)
        {
            CreateDirectoryIfNotExist(absoluteFilePath);
            string fileFullPath = Path.Combine(absoluteFilePath, fileName);

            using (var stream = file.OpenReadStream())
            {
                byte[] bytesInStream = new byte[stream.Length];
                await stream.ReadAsync(bytesInStream, 0, bytesInStream.Length);
                await File.WriteAllBytesAsync(fileFullPath, bytesInStream);
            }

            return fileFullPath;
        }

        private void CreateDirectoryIfNotExist(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }
        public async Task<GetProductByIdViewModel> GetVariantForEditAsync(int variantId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@VariantId", variantId);

            var result = await Task.Run(() =>
                this.ExecStoredProcedure<GetProductByIdViewModel>(
                    Database.SP_GetVariantForEdit,
                    parameters
                ).FirstOrDefault()
            );

            return result;
        }


        public async Task<IEnumerable<GetProductByIdViewModel>> GetInventoryFilteredAsync(InventoryFilterRequest request)
        {
            try
            {
                // Prepare parameters for the SAME SP you already have
                var parameters = new DynamicParameters();
                parameters.Add("@Category", string.IsNullOrWhiteSpace(request.Category) ? null : request.Category);
                parameters.Add("@Brand", string.IsNullOrWhiteSpace(request.Brand) ? null : request.Brand);
                parameters.Add("@ProductName", string.IsNullOrWhiteSpace(request.ProductName) ? null : request.ProductName);

                // Partner-based data isolation logic
                if (request.UserId != null && request.UserId > 0)
                {
                    var userRoleMapping = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == (int)request.UserId);
                    if (userRoleMapping != null && userRoleMapping.RoleId == (int)ROLES_ENUM.PARTNER)
                    {
                        var partner = new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == (int)request.UserId);
                        if (partner != null)
                        {
                            parameters.Add("@PartnerId", (int)partner.Id);
                        }
                        else
                        {
                            parameters.Add("@PartnerId", -1);
                        }
                    }
                    else
                    {
                        parameters.Add("@PartnerId", null);
                    }
                }
                else
                {
                    parameters.Add("@PartnerId", null);
                }

                // Fetch full filtered list from your EXISTING SP
                var results = await Task.Run(() =>
                    this.ExecStoredProcedure<GetProductByIdViewModel>(
                        Database.SP_GetInventoryReport,
                        parameters
                    ).ToList()
                );

                // Apply sorting in C#
                if (!string.IsNullOrEmpty(request.SortColumn))
                {
                    switch (request.SortColumn.ToLower())
                    {
                        case "productname":
                            results = (request.SortOrder == "ASC")
                                ? results.OrderBy(x => x.ProductName).ToList()
                                : results.OrderByDescending(x => x.ProductName).ToList();
                            break;

                        case "modified":
                            results = (request.SortOrder == "ASC")
                                ? results.OrderBy(x => x.Modified).ToList()
                                : results.OrderByDescending(x => x.Modified).ToList();
                            break;
                    }
                }

                // Apply paging in C#
                if (request.PageSize > 0)
                {
                    results = results
                        .Skip(request.PageIndex * request.PageSize)
                        .Take(request.PageSize)
                        .ToList();
                }

                return results;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error fetching inventory report", ex);
            }
        }


        public async Task<GetProductByIdViewModel> GetProductByIdAsync(int productId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ProductId", productId);
                var result = await Task.Run(() => this.ExecStoredProcedure<GetProductByIdViewModel>(Database.SP_GetProductById, parameters).FirstOrDefault());

                return result;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while fetching the product.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while fetching the product.", ex);
            }
        }

        // New separate UPDATE method
        public async Task UpdateProductAsync(UpdateProductViewModel model)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ProductId", model.ProductId);
                parameters.Add("@VariantId", model.VariantId);
                parameters.Add("@ProductName", model.ProductName);
                parameters.Add("@Description", model.Description ?? (object)DBNull.Value);
                parameters.Add("@CategoryId", model.CategoryId);
                parameters.Add("@BrandId", model.BrandId);
                parameters.Add("@CurrentPrice", model.BasePrice);
                parameters.Add("@TotalStock", model.TotalStock ?? (object)DBNull.Value);
                parameters.Add("@StatusId", model.StatusId);
                parameters.Add("@Specifications", model.Specifications ?? (object)DBNull.Value);

                await Task.Run(() => this.ExecStoredProcedure<UpdateProductViewModel>(Database.SP_UpdateProductInventory, parameters));
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while updating the product.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating the product.", ex);
            }
        }

        //public async Task<ProductDetailsViewModel> GetProductByIdAsync(int productId)
        //{
        //    try
        //    {
        //        var parameters = new DynamicParameters();
        //        parameters.Add("@ProductID", productId);

        //        var result = this.ExecStoredProcedureQueryMultiple<ProductDetailsViewModel, ProductDetailsMapper>(Database.SP_GetProductDetails, parameters);

        //        return await Task.FromResult(result == null ? null : mapper.Map<ProductDetailsViewModel>(result));
        //    }
        //    catch (SqlException sqlEx)
        //    {
        //        throw new ApplicationException("A database error occurred while fetching product details.", sqlEx);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException("An unexpected error occurred while fetching product details.", ex);
        //    }
        //}

        private async Task UploadProductImagesToS3(List<IFormFile> images, long productId, string productImageFolder)
        {
            try
            {
                foreach (var image in images)
                {
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                    var s3FilePath = Path.Combine(productImageFolder, fileName).Replace("\\", "/");

                    using (var stream = image.OpenReadStream())
                    {
                        new S3ClientHelperService(this.config, this.GetS3FolderName(this.context.CountryCode)).FileUploadAsync(stream, s3FilePath);
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the entire product creation
                SeriLogger.Error(ex, $"Failed to upload product images for product ID: {productId}");
            }
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.ProductMaster Get(long id)
        {
            throw new NotImplementedException();
        }

        public SearchProductsResult GetAllProducts(ProductSearchRequest request)
        {
            try
            {
                var cacheKey = GenerateCacheKey(request);

                // Try to get from cache first
                if (_memoryCache.TryGetValue(cacheKey, out SearchProductsResult cachedResult))
                {
                    return cachedResult;
                }

                var parameters = new DynamicParameters();
                parameters.Add("@SearchText", request.SearchText);
                parameters.Add("@CategoryID", request.CategoryId);
                parameters.Add("@BrandID", request.BrandId);
                parameters.Add("@GradeID", request.GradeId);
                parameters.Add("@RamID", request.RamId);
                parameters.Add("@StorageID", request.StorageId);
                parameters.Add("@MinPrice", request.MinPrice);
                parameters.Add("@MaxPrice", request.MaxPrice);
                parameters.Add("@SortBy", request.SortBy);
                parameters.Add("@Page", request.Page);
                parameters.Add("@PageSize", request.PageSize);
                parameters.Add("@Active", request.Active);

                // Partner-based data isolation logic
                var userRoleMapping = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == request.UserId);
                if (userRoleMapping != null && userRoleMapping.RoleId == (int)ROLES_ENUM.PARTNER)
                {
                    var partner = new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == request.UserId);
                    if (partner != null)
                    {
                        parameters.Add("@PartnerId", (int)partner.Id);
                    }
                    else
                    {
                        // If user is a Partner but has no PartnerMaster record, force zero results
                        parameters.Add("@PartnerId", -1);
                    }
                }
                else
                {
                    // Admin or other roles see all products
                    parameters.Add("@PartnerId", null);
                }

                var result = this.ExecPagedStoredProcedure<SearchProductResponse>(Database.SP_SearchProducts, parameters);

                var cacheOptions = new MemoryCacheEntryOptions().SetAbsoluteExpiration(cacheExpiration).SetPriority(CacheItemPriority.Normal);

                _memoryCache.Set(cacheKey, result, cacheOptions);

                // FIX: Get total records from first item if available
                int totalRecords = 0;
                if (result?.Items != null && result.Items.Any())
                {
                    // Get TotalRecords from first item (all items have same TotalRecords)
                    var firstItem = result.Items.First();
                    // Assuming SearchProductResponse has a TotalRecords property
                    totalRecords = firstItem.TotalRecords;
                }
                else
                {
                    totalRecords = result?.Count ?? 0;
                }

                return new SearchProductsResult
                {
                    Products = result?.Items?.ToList() ?? new List<SearchProductResponse>(),
                    Page = request.Page,
                    PageSize = request.PageSize,
                    TotalRecords = totalRecords,
                };
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while retrieving products.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while retrieving products.", ex);
            }
        }



        public PagedList<SearchProductResponse> InActiveProducts(ActiveAndInActiveModelRequest request)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ProductId", request.ProductId);

                var result = this.ExecPagedStoredProcedure<SearchProductResponse>(Database.SP_InActiveProduct, parameters);

                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while InActive products.", ex);
            }
        }

        public PagedList<SearchProductResponse> ActiveProducts(ActiveAndInActiveModelRequest request)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@ProductId", request.ProductId);

                var result = this.ExecPagedStoredProcedure<SearchProductResponse>(Database.SP_ActiveProduct, parameters);

                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while InActive products.", ex);
            }
        }



        public IEnumerable<ViewEntities.ProductMaster> GetList()
        {
            var result = this.GetAllItems();

            if (result is not null)
            {
                var filteredResult = result.Where(item => item.IsActive == true);

                var mapperResult = filteredResult.Select(product => this.mapper.Map<DBO.ProductMaster, ViewEntities.ProductMaster>(product));

                return mapperResult;
            }

            return Enumerable.Empty<ViewEntities.ProductMaster>();
        }

        public async Task<ProductDetailsViewModel> GetProductDetails(int productId)
        {
            try
            {

                var parameters = new DynamicParameters();
                parameters.Add("@ProductID", productId);


                var result = this.ExecStoredProcedureQueryMultiple<ProductDetailsViewModel, ProductDetailsMapper>(Database.SP_GetProductDetails, parameters);

                return await Task.FromResult(result == null ? null : mapper.Map<ProductDetailsViewModel>(result));
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while retrieving product details.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while retrieving product details.", ex);
            }
        }

        public async Task<IEnumerable<ViewEntities.CommissionSlab>> GetCommissionDetails()
        {
            try
            {
                var commission = new CommissionSlabModel(
                    this.config,
                    this.mapper,
                    this.iPrincipal,
                    this.context
                ).FindItems(x => x.IsActive == true);

                var result = this.mapper.Map<IEnumerable<DBO.CommissionSlab>,
                                              IEnumerable<ViewEntities.CommissionSlab>>(commission);

                return result;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException(
                    "A database error occurred while retrieving commission details.",
                    sqlEx
                );
            }
            catch (Exception ex)
            {
                throw new ApplicationException(
                    "An unexpected error occurred while retrieving commission details.",
                    ex
                );
            }
        }

        public async Task<IEnumerable<ViewEntities.CommissionSlabDetails>> GetAllCommissionSlabDetails()
        {
            try
            {
                var commission = new CommissionSlabDetailsModel(
                    this.config,
                    this.mapper,
                    this.iPrincipal,
                    this.context
                ).GetList();


                return commission;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException(
                    "A database error occurred while retrieving commission details.",
                    sqlEx
                );
            }
            catch (Exception ex)
            {
                throw new ApplicationException(
                    "An unexpected error occurred while retrieving commission details.",
                    ex
                );
            }
        }


        
        public long Post(ViewEntities.ProductMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.ProductMaster item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.ProductMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.ProductMaster item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        //public async Task<int> UpdateProduct(CreateProductRequest request)
        //{
        //    try
        //    {
        //        if (request.product == null)
        //        {
        //            throw new ApplicationException("Product details are required for update.");
        //        }

        //        if (request.product.Id <= 0 || request.product.Id == null)
        //        {
        //            throw new ApplicationException("Valid Product ID is required for update.");
        //        }

        //        var product = new DBO.ProductMaster();

        //        product = this.mapper.Map<ViewEntities.ProductMaster, DBO.ProductMaster>(request.product);

        //        this.UpdateItem(product);

        //        if (request.specification != null && request.variants.Count > 0)
        //        {
        //            foreach (var spec in request.specification)
        //            {
        //                var specification = this.mapper.Map<ViewEntities.ProductSpecification, DBO.ProductSpecification>(spec);
        //                if (specification.Id > 0)
        //                {
        //                    var existingSpec = new ProductSpecificationModel(this.config, this.mapper, this.iPrincipal, this.context).FindById(specification.Id);
        //                    if (existingSpec == null)
        //                    {
        //                        throw new ApplicationException($"Product Specification with ID {specification.Id} not found for update.");
        //                    }
        //                    new ProductSpecificationModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(specification);
        //                }
        //                else
        //                {
        //                    specification.ProductId = (int)product.Id;
        //                    var specificationId = new ProductSpecificationModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(specification);
        //                }
        //            }
        //        }

        //        if (request.productBoxItem != null && request.productBoxItem.Count > 0)
        //        {
        //            foreach (var boxItem in request.productBoxItem)
        //            {
        //                var productBoxItem = this.mapper.Map<ViewEntities.ProductBoxItem, DBO.ProductBoxItem>(boxItem);
        //                if (boxItem.Id > 0)
        //                {
        //                    var existingBoxItem = new ProductBoxItemModel(this.config, this.mapper, this.iPrincipal, this.context).FindById(boxItem.Id);
        //                    if (existingBoxItem == null)
        //                    {
        //                        throw new ApplicationException($"Product Box Item with ID {boxItem.Id} not found for update.");
        //                    }
        //                    new ProductBoxItemModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(productBoxItem);
        //                }
        //                else
        //                {
        //                    productBoxItem.ProductId = (int)product.Id;
        //                    new ProductBoxItemModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(productBoxItem);
        //                }
        //            }
        //        }

        //        if (request.variants == null || request.variants.Count == 0)
        //        {
        //            throw new ApplicationException("At least one product variant is required.");
        //        }
        //        else
        //        {
        //            foreach (var requestVariant in request.variants)
        //            {
        //                DBO.ProductVariant variantDb;
        //                int variantId;
        //                bool isNewVariant = requestVariant.Id <= 0;

        //                if (!isNewVariant)
        //                {
        //                    variantDb = new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                        .FindById(requestVariant.Id);

        //                    if (variantDb == null)
        //                        throw new ApplicationException($"Product Variant with ID {requestVariant.Id} not found for update.");

        //                    variantId = (int)requestVariant.Id;
        //                }
        //                else
        //                {
        //                    // New variant - create new object
        //                    variantDb = this.mapper.Map<DBO.ProductVariant>(requestVariant);
        //                    variantDb.ProductId = (int)product.Id;
        //                    variantDb.IsActive = true;
        //                    variantDb.ImagePath = requestVariant.ImagePath;
        //                    variantDb.BasePrice = requestVariant.BasePrice;
        //                    variantDb.ColorId = requestVariant.ColorId;
        //                    variantDb.Price = requestVariant.Price;
        //                    variantDb.RamId = requestVariant.RamId;
        //                    variantDb.StorageId = requestVariant.StorageId;

        //                    variantId = (int)new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                        .AddItem(variantDb);

        //                    variantDb.Id = variantId;
        //                }
        //                ;

        //                if (requestVariant.Image != null)
        //                {
        //                    string productImageFolder = $"products/{product.Id}/images";
        //                    string imageFolder = $"{productImageFolder}/{variantId}";
        //                    string variantImageName = requestVariant.Image.FileName;
        //                    string variantImageFolderPath = $"{imageFolder}/{variantImageName}";

        //                    string uploadedImagePath = await UploadVariantImage(
        //                        requestVariant.Image,
        //                        (int)product.Id,
        //                       (int)variantId,
        //                        imageFolder);

        //                    variantDb.ImagePath = variantImageFolderPath;
        //                }

        //                if (!isNewVariant)
        //                {
        //                    this.mapper.Map(requestVariant, variantDb);
        //                    variantDb.IsActive = true;
        //                    variantDb.ImagePath = requestVariant.ImagePath;
        //                    variantDb.BasePrice = requestVariant.BasePrice;
        //                    variantDb.ColorId = requestVariant.ColorId;
        //                    variantDb.Price = requestVariant.Price;
        //                    variantDb.RamId = requestVariant.RamId;
        //                    variantDb.StorageId = requestVariant.StorageId;

        //                }

        //                new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                    .UpdateItem(variantDb);

        //                var existingSku = new SkuModel(this.config, this.mapper, this.iPrincipal, this.context)
        //                    .FindItems(x => x.ProductId == (int)product.Id && x.VariantId == variantId)
        //                    .FirstOrDefault();

        //                DBO.Sku skuDb = existingSku ?? new DBO.Sku();

        //                if (existingSku == null)
        //                {
        //                    skuDb.ProductId = (int)product.Id;
        //                    skuDb.VariantId = (int)variantId;
        //                }

        //                skuDb.MRP = requestVariant.Price;
        //                skuDb.SellingPrice = requestVariant.BasePrice;
        //                skuDb.StockQty = requestVariant.StockQty;
        //                skuDb.StatusId = requestVariant.StatusId;

        //                if (existingSku != null)
        //                {
        //                    new SkuModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(skuDb);
        //                }
        //                else
        //                {
        //                    new SkuModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(skuDb);
        //                }
        //            }
        //            return (int)product.Id;
        //        }
        //    }

        //    catch (SqlException sqlEx)
        //    {
        //        throw new ApplicationException("A database error occurred while updating the product.", sqlEx);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException("An unexpected error occurred while updating the product.", ex);
        //    }
        //}

        public async Task<int> UpdateProduct(CreateProductRequest request)
        {
            try
            {
                if (request?.product == null || request.product.Id <= 0)
                    throw new ApplicationException("Valid Product details are required for update.");

                var isPartner = false;
                int partnerId = 0;
                var partner = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == request.PersonId);

                if (partner.RoleId == (int)ROLES_ENUM.PARTNER)
                {
                    var data = new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context).FindItem(x => x.UserId == partner.UserId);
                    isPartner = true;
                    partnerId = (int) data.Id;
                }

                int productId = (int)request.product.Id;

                // 1️⃣ Update Product
                if (isPartner)
                {
                    request.product.PartnerId = partnerId;
                }
                var productEntity = this.mapper.Map<ViewEntities.ProductMaster, DBO.ProductMaster>(request.product);
                this.UpdateItem(productEntity);

                //2️⃣ Specifications
                        if (request.specification != null && request.variants.Count > 0)
                {
                    foreach (var spec in request.specification)
                    {
                        var specification = this.mapper.Map<ViewEntities.ProductSpecification, DBO.ProductSpecification>(spec);
                        if (specification.Id > 0)
                        {
                            var existingSpec = new ProductSpecificationModel(this.config, this.mapper, this.iPrincipal, this.context).FindById(specification.Id);
                            if (existingSpec == null)
                            {
                                throw new ApplicationException($"Product Specification with ID {specification.Id} not found for update.");
                            }
                            existingSpec.SpecValue = specification.SpecValue;
                            existingSpec.SpecKey =specification.SpecKey;
                            specification.IsActive = true;
                            new ProductSpecificationModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(specification);
                        }
                        else
                        {
                            specification.ProductId = (int)request.product.Id;
                            var specificationId = new ProductSpecificationModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(specification);
                        }
                    }
                }

                // 3️⃣ Box Items
                if (request.productBoxItem != null && request.productBoxItem.Any())
                {
                    foreach (var boxItem in request.productBoxItem)
                    {
                        var boxDb = this.mapper.Map<ViewEntities.ProductBoxItem, DBO.ProductBoxItem>(boxItem);

                        if (boxDb.Id > 0)
                        {
                            var existing = new ProductBoxItemModel(this.config, this.mapper, this.iPrincipal, this.context)
                                .FindById(boxDb.Id);

                            if (existing == null)
                                throw new ApplicationException($"Box Item ID {boxDb.Id} not found.");

                            existing.SpecKey = boxItem.SpecKey;
                            existing.SpecValue = boxItem.SpecValue;

                            new ProductBoxItemModel(this.config, this.mapper, this.iPrincipal, this.context)
                                .UpdateItem(boxDb);
                        }
                        else
                        {
                            boxDb.ProductId = productId;

                            new ProductBoxItemModel(this.config, this.mapper, this.iPrincipal, this.context)
                                .AddItem(boxDb);
                        }
                    }
                }

                // 4️⃣ Variants + SKU (NO IMAGE HERE)
                if (request.variants == null || !request.variants.Any())
                    throw new ApplicationException("At least one product variant is required.");

                foreach (var reqVariant in request.variants)
                {
                    DBO.ProductVariant variantDb;
                    int variantId;
                    if (isPartner)
                    {
                        reqVariant.PartnerId = partnerId;
                    }

                    if (reqVariant.Id > 0)
                    {
                        variantDb = new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
                            .FindById(reqVariant.Id);

                        if (variantDb == null)
                            throw new ApplicationException($"Variant ID {reqVariant.Id} not found.");

                        this.mapper.Map(reqVariant, variantDb);
                    }
                    else
                    {
                        variantDb = this.mapper.Map<DBO.ProductVariant>(reqVariant);
                        variantDb.ProductId = productId;
                        variantDb.IsActive = true;

                        variantId = (int)new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
                            .AddItem(variantDb);

                        variantDb.Id = variantId;
                    }

                    variantDb.RamId = reqVariant.RamId;
                    variantDb.BasePrice = reqVariant.BasePrice;
                    variantDb.StorageId = reqVariant.StorageId;
                    variantDb.StatusId = reqVariant.StatusId;
                    variantDb.ColorId = reqVariant.ColorId;
                    variantDb.GradeId = reqVariant.GradeId;
                    variantDb.DiscountPrice = reqVariant.DiscountPrice;
                    variantDb.Price = reqVariant.Price;
                    variantDb.reminderQty = reqVariant.reminderQty;
                    variantDb.StockQty = reqVariant.StockQty;
                    variantDb.ProductId = productId;
                    variantDb.IsActive = true;
                    variantDb.IsReturnable = reqVariant.IsReturnable;
                    variantDb.IsReplacement = reqVariant.IsReplacement;
                    variantDb.ReturnDays = reqVariant.ReturnDays;
                    variantDb.ReplacementDays = reqVariant.ReplacementDays;

                    new ProductVariantModel(this.config, this.mapper, this.iPrincipal, this.context)
                        .UpdateItem(variantDb);

                    // SKU
                    var skuModel = new SkuModel(this.config, this.mapper, this.iPrincipal, this.context);
                    var skuDb = skuModel.FindItem(x => x.ProductId == productId && x.VariantId == (int)variantDb.Id);

                    if (isPartner)
                    {
                        skuDb.PartnerId = partnerId;
                    }
                    skuDb.ProductId = productId;
                    skuDb.VariantId = (int)variantDb.Id;
                    skuDb.MRP = variantDb.Price;    
                    skuDb.SellingPrice = variantDb.BasePrice;
                    skuDb.StockQty = variantDb.StockQty;
                    skuDb.StatusId = variantDb.StatusId;
                    skuDb.IsActive = true;

                    if (skuDb.Id > 0)
                        skuModel.UpdateItem(skuDb);
                    else
                        skuModel.AddItem(skuDb);
                }

                // 5️⃣ COLOR-WISE IMAGES (SAME AS CREATE)
                if (request.ColorImages != null && request.ColorImages.Any())
                {
                    string baseFolder = $"products/{productId}/images";

                    var imageModel = new ProductImagesModel(this.config, this.mapper, this.iPrincipal, this.context);

                    var existingProductImageData = imageModel.FindItems(x => x.ProductId == (int)productId && x.IsActive == true);

                    var existingIdsInDb = existingProductImageData.Select(x => (int)x.Id).ToList();

                    var requestedIds = request.ColorImages
                        .Where(x => x.ProductImageId.HasValue && x.ProductImageId > 0 ) 
                        .Select(x => x.ProductImageId.Value)
                        .ToList();

                    var idsToDeactivate = (existingIdsInDb.Except(requestedIds)).ToList();

                    if (idsToDeactivate.Any())
                    {
                        var itemsToDeactivate = existingProductImageData
                            .Where(x => idsToDeactivate.Contains((int)x.Id))
                            .ToList();

                        foreach (var item in itemsToDeactivate)
                        {
                            item.IsActive = false;
                            imageModel.UpdateItem(item);
                        }
                    }

                    foreach (var colorImage in request.ColorImages)
                    {
                        if (colorImage == null)
                            continue;

                        if (colorImage.ProductImageId == null || colorImage.ProductImageId <= 0)
                        {
                            if (colorImage.ImageFile == null || !colorImage.ImageFile.Any())
                                continue;

                            string colorFolder = $"{baseFolder}/{colorImage.ColorId}";

                            foreach (var file in colorImage.ImageFile)
                            {
                                if (file == null || file.Length == 0)
                                    continue;

                                await UploadVariantImage(file, productId, colorImage.ColorId, colorFolder);

                                var imageDb = new DBO.ProductImages
                                {
                                    ProductId = productId,
                                    ColorId = colorImage.ColorId,
                                    ImagePath = $"{colorFolder}/{file.FileName}",
                                    IsActive = true,
                                    Created = DateTime.UtcNow
                                };

                                imageModel.AddItem(imageDb);
                            }
                        }
                    }



                    //foreach (var colorGroup in request.ColorImages)
                    //{
                    //    if (colorGroup.Images == null || !colorGroup.Images.Any())
                    //        continue;

                    //    string colorFolder = $"{baseFolder}/{colorGroup.ColorId}";

                    //    foreach (var file in colorGroup.Images)
                    //    {
                    //        if (file == null || file.Length == 0) continue;

                    //        await UploadVariantImage(file, productId, colorGroup.ColorId, colorFolder);

                    //        var imageDb = new DBO.ProductImages
                    //        {
                    //            ProductId = productId,
                    //            ColorId = colorGroup.ColorId,
                    //            ImagePath = $"{colorFolder}/{file.FileName}",
                    //            IsActive = true,
                    //            Created = DateTime.UtcNow
                    //        };

                    //        imageModel.AddItem(imageDb);
                    //    }
                    //}
                }

                return productId;
            }
            catch (SqlException ex)
            {
                throw new ApplicationException("Database error while updating product.", ex);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Unexpected error while updating product.", ex);
            }
        }

        private string GenerateCacheKey(ProductSearchRequest request)
        {
            return $"products_search_{request.SearchText}_{request.CategoryId}_{request.BrandId}_{request.GradeId}_{request.RamId}_{request.StorageId}_{request.MinPrice}_{request.MaxPrice}_{request.SortBy}_{request.Page}_{request.PageSize}";
        }

        public async Task<PagedList<ViewEntities.ProductMaster>> GetProducts(IEnumerable<long> ids)
        {
            if (ids == null || !ids.Any())
                return new PagedList<ViewEntities.ProductMaster>(new List<ViewEntities.ProductMaster>(), 0, 1, 0);

            var productIds = ids.ToHashSet();

            var allActiveProducts = this.GetList().ToList();

            var products = allActiveProducts
                .Where(p => productIds.Contains(p.Id))
                .ToList();

            var skuModel = new SkuModel(this.config, this.mapper, this.iPrincipal, this.context);
            var allSkus = skuModel.GetList().ToList();

            var relevantSkus = allSkus
                .Where(s => productIds.Contains(s.ProductId))
                .ToList();

            bool enableS3 = this.config?.Value.AWSConfiguration?.EnableS3 == true;
            string countryCode = this.context?.CountryCode ?? "";
            S3ClientHelperService s3Helper = enableS3
                ? new S3ClientHelperService(this.config, countryCode)
                : null;

            string localAttachmentPath = this.config?.Value.ApplicationConfiguration?.AttachmentFilePath ?? "";

            string encryptionKey = this.config?.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "";

            foreach (var product in products)
            {
                product.EncryptedId = EncryptAES(product.Id.ToString(), encryptionKey);

                var skuWithImage = relevantSkus
                    .FirstOrDefault(s => s.ProductId == product.Id && !string.IsNullOrEmpty(s.ImagePath));

                if (skuWithImage != null && !string.IsNullOrEmpty(skuWithImage.ImagePath))
                {
                    try
                    {
                        byte[] imageBytes = null;

                        if (enableS3)
                        {
                            imageBytes = await s3Helper.FileDownloadAsync(skuWithImage.ImagePath);
                        }
                        else if (!string.IsNullOrEmpty(localAttachmentPath))
                        {
                            string fullPath = Path.Combine(localAttachmentPath, skuWithImage.ImagePath);
                            if (File.Exists(fullPath))
                            {
                                imageBytes = await File.ReadAllBytesAsync(fullPath);
                            }
                        }

                        if (imageBytes != null && imageBytes.Length > 0)
                        {
                            string base64 = Convert.ToBase64String(imageBytes);
                            string extension = Path.GetExtension(skuWithImage.ImagePath)?.ToLowerInvariant() ?? ".jpg";
                            string mimeType = extension switch
                            {
                                ".png" => "image/png",
                                ".jpg" or ".jpeg" => "image/jpeg",
                                ".gif" => "image/gif",
                                ".webp" => "image/webp",
                                _ => "image/jpeg"
                            };

                            product.ImageBase64 = $"data:{mimeType};base64,{base64}";
                        }
                        else
                        {
                            product.ImageBase64 = null;
                        }
                    }
                    catch (Exception ex)
                    {
                        SeriLogger.Error(ex, $"Failed to load image for product {product.Id}, path: {skuWithImage.ImagePath}");
                        product.ImageBase64 = null;
                    }
                }
                else
                {
                    product.ImageBase64 = null;
                }
            }

            return new PagedList<ViewEntities.ProductMaster>(
                products,
                products.Count,
                1,
                products.Count
            );
        }

        public IEnumerable<ViewEntities.ProductMaster> GetListBysearch(string searchText)
        {
            searchText = !string.IsNullOrEmpty(searchText) ? searchText.ToLower() : string.Empty;
            var result = this.FindItems(item => item.IsActive == true)?.OrderBy(x => x.ProductName);

            if (result is not null && result.Any())
            {
                var filteredResult = !string.IsNullOrEmpty(searchText) ? result?.Where(x => x.ProductName.ToLower().Contains(searchText)) : result;
                filteredResult = filteredResult?.Count() > 10 ? filteredResult.Take(10) : filteredResult;
                var mapperResult = this.mapper.Map<IEnumerable<DBO.ProductMaster>, IEnumerable<ViewEntities.ProductMaster>>(filteredResult);

                foreach (var item in mapperResult)
                {
                    item.EncryptedId = this.EncryptAES(item.Id.ToString(), this.config.Value.AESEncryptionConfiguration.EncryptionKey);
                    item.Id = item.Id;
                }

                return mapperResult;
            }

            return default;
        }

        public async Task<PagedList<GetProductByIdViewModel>> GetRelatedProduct(string productName)
        {
            try
            {
                var result = this.FindItems(x => x.ProductName == productName && x.IsActive == true);

                if (result == null)
                {
                    return new PagedList<GetProductByIdViewModel>(
                        new List<GetProductByIdViewModel>(), 0, 1, 0);
                }

                List<GetProductByIdViewModel> list = new List<GetProductByIdViewModel>();

                foreach (var item in result)
                {
                    var productResult = await this.GetProductByIdAsync((int)item.Id);
                    if (productResult != null)
                    {
                        list.Add(productResult);
                    }

                }

                return new PagedList<GetProductByIdViewModel>(list, 1, 1, 1);
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while fetching related products.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while fetching related products.", ex);
            }
        }

        public async Task<PagedList<ProductDetailsViewModel>> GetRelatedProductById(int productId)
        {
            try
            {
                var result = await this.GetProductDetails(productId);
                List<ProductDetailsViewModel> list = new List<ProductDetailsViewModel>();
                list.Add(result);
                return new PagedList<ProductDetailsViewModel>(list, 1, 1, 1);
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while fetching related products.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while fetching related products.", ex);
            }
        }

        public PagedList<FilterViewModel> GetSpecificationFilter(string? Brand, string? Condition, string? Storage, string? ItemCategory, string? Price, string? Category, string? Ram)
        {
            var param = new
            {
                Brand = Brand,
                Condition = Condition,
                StorageSize = Storage,
                ItemCategory = ItemCategory,
                Price = Price,
                Category = Category,
                Ram = Ram
            };

            var results = this.GetPagedSProcResult<FilterViewModel>(Database.SP_GetSpecificationFilter, param);
            //foreach (var item in results)
            //{
            //    item.EncryptedProductId = EncryptAES(item.ProductId.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
            //    item.ProductId = 0;
            //}
            return results;
        }

        public PagedList<FilterViewModel> GetSpecificationDetails()
        {
            var results = this.GetPagedSProcResult<FilterViewModel>(Database.SP_GetSpecificationDetails, null);

            return results;
        }

        public PagedList<FilterViewModel> GetHomePageFilter(DateTime clientLocalTime)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@ClientLocalTime", clientLocalTime, DbType.DateTime);

            var results = this.GetPagedSProcResult<FilterViewModel>(Database.SP_GetHomePageFilter, null);
            foreach (var item in results)
            {
                item.EncryptedProductId = EncryptAES(item.ProductId.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                item.ProductId = 0;
            }

            return results;
        }


        public PagedList<GetProductByPriceViewModel> GetProductByPrice(string? price, int? categoryId)
        {
            var param = new
            {
                Price = price,
                CategoryId = categoryId
            };

            var results = this.GetPagedSProcResult<GetProductByPriceViewModel>(Database.SP_GetProductByPrice, param);

            return results;

        }


        public async Task<CategoryTreeResponseViewModel> GetAllCategoryProducts()
        {
            try
            {
                var categoryModel = new CategoryMasterModel(this.config, this.mapper, this.iPrincipal, this.context);
                var subCategoryModel = new SubCategoryMasterModel(this.config, this.mapper, this.iPrincipal, this.context);
                var itemsCategoryModel = new ItemsCategoryMasterModel(this.config, this.mapper, this.iPrincipal, this.context);

                // Get all data
                var categories = await Task.Run(() => categoryModel.Find(x => x.IsActive == true));
                var subCategories = await Task.Run(() => subCategoryModel.Find(x => x.IsActive == true));
                var itemsCategories = await Task.Run(() => itemsCategoryModel.Find(x => x.IsActive == true));
                var products = await Task.Run(() => this.Find(x => x.IsActive == true));

                // Build single response with all categories
                var response = new CategoryTreeResponseViewModel();

                foreach (var category in categories)
                {
                    var categoryVm = new Category
                    {
                        CategoryId = (int)category.Id,
                        CategoryName = category.CategoryName,
                        ImagePath = category.ImagePath,
                        SubCategories = new List<SubCategory>()
                    };

                    // Get subcategories for this category
                    var catSubCategories = subCategories.Where(sc => sc.CategoryMasterId == category.Id);

                    foreach (var subCat in catSubCategories)
                    {
                        var subCategoryVm = new SubCategory
                        {
                            SubCategoryId = (int)subCat.Id,
                            SubCategoryName = subCat.SubCategoryName,
                            ItemsCategories = new List<ItemsCategory>()
                        };

                        // Get item categories for this subcategory
                        var subCatItemsCategories = itemsCategories.Where(ic => ic.SubCategoryMasterId == (int)subCat.Id);

                        foreach (var itemCat in subCatItemsCategories)
                        {
                            var itemsCategoryVm = new ItemsCategory
                            {
                                ItemsCategoryId = (int)itemCat.Id,
                                ItemsCategoryName = itemCat.ItemsCategoryName,
                                Products = new List<Product>()
                            };

                            // Get products for this category+subcategory+itemscategory
                            var categoryProducts = products.Where(p =>
    p.SubCategoryId != null && p.SubCategoryId == (int)subCat.Id &&
    p.ItemSubCategoryId != null && p.ItemSubCategoryId == itemCat.Id);

                            foreach (var product in categoryProducts)
                            {
                                itemsCategoryVm.Products.Add(new Product
                                {
                                    ProductId = (int)product.Id,
                                    ProductName = product.ProductName
                                });
                            }

                            subCategoryVm.ItemsCategories.Add(itemsCategoryVm);
                        }

                        categoryVm.SubCategories.Add(subCategoryVm);
                    }

                    response.Categories.Add(categoryVm);
                }

                return response; // Return single object
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while fetching related products.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while fetching related products.", ex);
            }
        }

        public PagedList<FilterViewModel> GetDiscountAppliedProducts()
        {
            var results = this.GetPagedSProcResult<FilterViewModel>(Database.SP_GetSpecificationFilter, null);
            foreach (var item in results)
            {
                item.EncryptedProductId = EncryptAES(item.ProductId.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                item.ProductId = 0;
            }
            return results;
        }

    }
}
