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
    public class StorageMasterModel : BaseModel<DBO.StorageMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private readonly StorageMasterEntityMapper entityMapper;
        private readonly StorageMasterModelMapper modelMapper;

        public StorageMasterModel(
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

        public ViewEntities.StorageMaster Get(long id)
        {
            var result = this.FindItem(item => item.Id == id && item.IsActive == true);
            if (result is not null)
            {
                return mapper.Map<ViewEntities.StorageMaster>(result);
            }
            return default;
        }

        public IEnumerable<DBO.StorageMaster> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            return results;
        }

        public IEnumerable<ViewEntities.StorageMaster> GetActiveStorageForDropdown()
        {
            var results = this.FindItems(item => item.IsActive == true && item.DisplayInList == true)
                           .OrderBy(r => r.StorageSize);

            if (results != null && results.Any())
            {
                var viewEntities = new List<ViewEntities.StorageMaster>();
                foreach (var result in results)
                {
                    viewEntities.Add(entityMapper.Convert(result, new ViewEntities.StorageMaster(), null));
                }
                return viewEntities;
            }
            return new List<ViewEntities.StorageMaster>();
        }

        public long Post(ViewEntities.StorageMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.StorageMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Post(ViewEntities.StorageMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.StorageMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(ViewEntities.StorageMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.StorageMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public long Put(ViewEntities.StorageMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.StorageMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public bool Remove(long id)
        {
            var storage = this.FindById(id);
            if (storage is not null)
            {
                storage.IsActive = false;
                storage.Modified = DateTime.Now;
                storage.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

                this.UpdateItem(storage);
                return true;
            }
            return false;
        }

        public string GetStorageSizeById(long storageId)
        {
            var storage = this.Get((int)storageId);
            return storage?.StorageSize ?? "Unknown Storage Size";
        }
    }
}