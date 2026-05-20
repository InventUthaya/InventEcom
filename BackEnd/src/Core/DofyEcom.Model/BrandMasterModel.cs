using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.DataMappers.EntityMappers;
using DofyEcom.DataMappers.ModelMappers;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class BrandMasterModel : BaseModel<DBO.BrandMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private readonly BrandMasterEntityMapper entityMapper;
        private readonly BrandMasterModelMapper modelMapper;

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

        public IEnumerable<DBO.BrandMaster> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            return results;
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
                    viewEntities.Add(entityMapper.Convert(result, new ViewEntities.BrandMaster(), null));
                }
                return viewEntities;
            }
            return new List<ViewEntities.BrandMaster>();
        }

        public long Post(ViewEntities.BrandMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.BrandMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Post(ViewEntities.BrandMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.BrandMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(ViewEntities.BrandMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.BrandMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public long Put(ViewEntities.BrandMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.BrandMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
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
    }
}