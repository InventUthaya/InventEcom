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
    public class TaxMasterModel : BaseModel<DBO.TaxMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private readonly TaxMasterEntityMapper entityMapper;
        private readonly TaxMasterModelMapper modelMapper;

        public TaxMasterModel(
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

        public ViewEntities.TaxMaster Get(long id)
        {
            var result = this.FindItem(item => item.Id == id && item.IsActive == true);
            if (result is not null)
            {
                return mapper.Map<ViewEntities.TaxMaster>(result);
            }
            return default;
        }

        public IEnumerable<DBO.TaxMaster> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            return results;
        }

        public IEnumerable<ViewEntities.TaxMaster> GetActiveTaxForDropdown()
        {
            var results = this.FindItems(item => item.IsActive == true && item.DisplayInList == true)
                           .OrderBy(r => r.TaxName);

            if (results != null && results.Any())
            {
                var viewEntities = new List<ViewEntities.TaxMaster>();
                foreach (var result in results)
                {
                    viewEntities.Add(entityMapper.Convert(result, new ViewEntities.TaxMaster(), null));
                }
                return viewEntities;
            }
            return new List<ViewEntities.TaxMaster>();
        }

        public long Post(ViewEntities.TaxMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.TaxMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Post(ViewEntities.TaxMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.TaxMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(ViewEntities.TaxMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.TaxMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public long Put(ViewEntities.TaxMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.TaxMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public bool Remove(long id)
        {
            var color = this.FindById(id);
            if (color is not null)
            {
                color.IsActive = false;
                color.Modified = DateTime.Now;
                color.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

                this.UpdateItem(color);
                return true;
            }
            return false;
        }

        public string GetTaxNameById(long taxId)
        {
            var tax = this.Get((int)taxId);
            return tax?.TaxName ?? "Unknown Tax";
        }
    }
}