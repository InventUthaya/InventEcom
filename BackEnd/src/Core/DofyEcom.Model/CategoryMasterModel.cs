using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.DataMappers;
using DofyEcom.DataMappers.EntityMappers;
using DofyEcom.DataMappers.ModelMappers;
using DofyEcom.DBO;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using DofyEcom.UploadHelper;

namespace DofyEcom.Model
{
    public class CategoryMasterModel : BaseModel<DBO.CategoryMaster>,ICategoryMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private readonly CategoryMasterEntityMapper entityMapper;
        private readonly CategoryMasterModelMapper modelMapper;

        public CategoryMasterModel(
            IOptionsSnapshot<AppConfiguration> iConfig,
            IMapper iMapper,
            IPrincipal? iPrincipal = null,
            CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.CategoryMaster Get(long id)
        {
            var result = this.FindItem(item => item.Id == id && item.IsActive == true);
            if (result is not null)
            {
                return mapper.Map<ViewEntities.CategoryMaster>(result);
            }
            return default;
        }

        public IEnumerable<ViewEntities.CategoryMaster> GetActiveCategoryForDropdown()
        {
            var results = this.FindItems(item => item.IsActive == true && item.DisplayInList == true)
                           .OrderBy(r => r.CategoryName);

            if (results != null && results.Any())
            {
                var viewEntities = new List<ViewEntities.CategoryMaster>();
                foreach (var result in results)
                {
                    viewEntities.Add(entityMapper.Convert(result, new ViewEntities.CategoryMaster(), null));
                }
                return viewEntities;
            }
            return new List<ViewEntities.CategoryMaster>();
        }

        public long Post(ViewEntities.CategoryMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.CategoryMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Post(ViewEntities.CategoryMaster item)
        {
            var dboItem = this.mapper.Map<ViewEntities.CategoryMaster, DBO.CategoryMaster>(item);
            dboItem.Created = DateTime.Now;
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;
            
            SaveCategoryImage(item, dboItem);

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(ViewEntities.CategoryMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.CategoryMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public long Put(ViewEntities.CategoryMaster item)
        {
            var dboItem = this.mapper.Map<ViewEntities.CategoryMaster, DBO.CategoryMaster>(item);
            dboItem.Modified = DateTime.Now;
            dboItem.IsActive = item.IsActive;
            dboItem.DisplayInList = true;
            
            SaveCategoryImage(item, dboItem);

            this.UpdateItem(dboItem);
            return dboItem.Id;
        }

        private void SaveCategoryImage(ViewEntities.CategoryMaster item, DBO.CategoryMaster dboItem)
        {
            if (!string.IsNullOrEmpty(item.ImageBase64))
            {
                try
                {
                    string base64Data = item.ImageBase64.Contains(",") ? item.ImageBase64.Split(',')[1] : item.ImageBase64;
                    byte[] imageBytes = Convert.FromBase64String(base64Data);
                    
                    string fileName = !string.IsNullOrEmpty(item.ImagePath) 
                        ? System.IO.Path.GetFileName(item.ImagePath) 
                        : $"{Guid.NewGuid()}.png";
                    
                    // Clean invalid filename characters
                    foreach (char c in System.IO.Path.GetInvalidFileNameChars())
                    {
                        fileName = fileName.Replace(c, '_');
                    }
                    
                    string baseFolder = "categories";
                    string relativePath = $"{baseFolder}/{fileName}";
                    
                    if (this.config?.Value.AWSConfiguration?.EnableS3 == true)
                    {
                        using (var stream = new System.IO.MemoryStream(imageBytes))
                        {
                            new S3ClientHelperService(this.config, this.GetS3FolderName(this.context.CountryCode))
                                .FileUploadAsync(stream, relativePath).Wait();
                        }
                    }
                    else
                    {
                        string localPath = System.IO.Path.Combine(this.config.Value.ApplicationConfiguration.AttachmentFilePath, baseFolder);
                        if (!System.IO.Directory.Exists(localPath))
                        {
                            System.IO.Directory.CreateDirectory(localPath);
                        }
                        string fileFullPath = System.IO.Path.Combine(localPath, fileName);
                        System.IO.File.WriteAllBytes(fileFullPath, imageBytes);
                    }
                    
                    dboItem.ImagePath = relativePath;
                }
                catch (Exception ex)
                {
                    throw new ApplicationException($"Failed to save category image: {ex.Message}");
                }
            }
            else
            {
                dboItem.ImagePath = item.ImagePath;
            }
        }

        public bool Remove(long id)
        {
            var role = this.FindById(id);
            if (role is not null)
            {
                // Don't hard delete roles, just deactivate
                role.IsActive = false;
                role.Modified = DateTime.Now;
                role.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

                this.UpdateItem(role);
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<CategoryMasterResponse>> GetAll(CategoryMasterSearch request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@SearchText", request.SearchText);
            parameters.Add("@OffsetStart", request.OffsetStart);
            parameters.Add("@RowsPerPage", request.RowsPerPage);

            var result = await this.ExecStoredProcedureAsync<CategoryMasterResponse>(Database.SP_GetCategoryMaster, parameters);

            return result;
        }

        public long Post(ViewEntities.ProductMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.ProductMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.ProductMaster item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.ProductMaster item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.CategoryMaster> GetList()
        {
            var result = this.GetAllItems();

            if (result is not null)
            {
                var filteredResult = result.Where(item => item.IsActive == true);

                var mapperResult = filteredResult.Select(product => this.mapper.Map<DBO.CategoryMaster, ViewEntities.CategoryMaster>(product));

                return mapperResult;
            }

            return Enumerable.Empty<ViewEntities.CategoryMaster>();
        }
        public List<ViewEntities.BrandMaster> GetBrandsByCategory(int categoryId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CategoryId", categoryId);

            return ExecStoredProcedure<ViewEntities.BrandMaster>(
                Database.SP_GetBrandsByCategory,
                parameters
            ).ToList();
        }


    }
}