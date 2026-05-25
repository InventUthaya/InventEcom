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
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using DofyEcom.UploadHelper;

namespace DofyEcom.Model
{
    public class BrandMasterModel : BaseModel<DBO.BrandMaster>, IBrandMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public BrandMasterModel(
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

        public ViewEntities.BrandMaster Get(long id)
        {
            var result = this.FindItem(item => item.Id == id && item.IsActive == true);
            if (result is not null)
            {
                return mapper.Map<ViewEntities.BrandMaster>(result);
            }
            return default;
        }

        public IEnumerable<ViewEntities.BrandMaster> GetList()
        {
            var result = this.GetAllItems();
            if (result is not null)
            {
                var filteredResult = result.Where(item => item.IsActive == true);
                var mapperResult = filteredResult.Select(brand => this.mapper.Map<DBO.BrandMaster, ViewEntities.BrandMaster>(brand));
                return mapperResult;
            }
            return Enumerable.Empty<ViewEntities.BrandMaster>();
        }

        public IEnumerable<ViewEntities.BrandMaster> GetActiveBrandForDropdown()
        {
            var results = this.FindItems(item => item.IsActive == true && item.DisplayInList == true)
                           .OrderBy(r => r.BrandName);

            if (results != null && results.Any())
            {
                var viewEntities = new List<ViewEntities.BrandMaster>();
                foreach (var result in results)
                {
                    viewEntities.Add(this.mapper.Map<DBO.BrandMaster, ViewEntities.BrandMaster>(result));
                }
                return viewEntities;
            }
            return new List<ViewEntities.BrandMaster>();
        }

        public long Post(ViewEntities.BrandMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = this.mapper.Map<ViewEntities.BrandMaster, DBO.BrandMaster>(item);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            SaveBrandImage(item, dboItem);

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Post(ViewEntities.BrandMaster item)
        {
            var dboItem = this.mapper.Map<ViewEntities.BrandMaster, DBO.BrandMaster>(item);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            SaveBrandImage(item, dboItem);

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(ViewEntities.BrandMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = this.mapper.Map<ViewEntities.BrandMaster, DBO.BrandMaster>(item);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            SaveBrandImage(item, dboItem);

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public long Put(ViewEntities.BrandMaster item)
        {
            var dboItem = this.mapper.Map<ViewEntities.BrandMaster, DBO.BrandMaster>(item);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = item.IsActive;
            dboItem.DisplayInList = item.DisplayInList;

            SaveBrandImage(item, dboItem);

            this.UpdateItem(dboItem);
            return item.Id;
        }

        private void SaveBrandImage(ViewEntities.BrandMaster item, DBO.BrandMaster dboItem)
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
                    
                    string baseFolder = "brands";
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
                    throw new ApplicationException($"Failed to save brand image: {ex.Message}");
                }
            }
            else
            {
                dboItem.ImagePath = item.ImagePath;
            }
        }

        public bool Remove(long id)
        {
            var brand = this.FindById(id);
            if (brand is not null)
            {
                brand.IsActive = false;
                brand.Modified = DateTime.Now;
                brand.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

                this.UpdateItem(brand);
                return true;
            }
            return false;
        }

        public string GetBrandNameById(long brandId)
        {
            var brand = this.Get((int)brandId);
            return brand?.BrandName ?? "Unknown Brand";
        }

        public async Task<IEnumerable<BrandMasterResponse>> GetAll(BrandMasterSearch request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@SearchText", request.SearchText);
            parameters.Add("@OffsetStart", request.OffsetStart);
            parameters.Add("@RowsPerPage", request.RowsPerPage);

            var result = await this.ExecStoredProcedureAsync<BrandMasterResponse>("SP_GetBrandMaster", parameters);

            return result;
        }
    }
}