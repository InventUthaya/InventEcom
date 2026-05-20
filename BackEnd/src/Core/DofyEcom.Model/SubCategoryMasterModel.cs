

using System.Security.Principal;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.DataMappers.EntityMappers;
using DofyEcom.DataMappers.ModelMappers;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class SubCategoryMasterModel : BaseModel<DBO.SubCategoryMaster>, ISubCategoryMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public SubCategoryMasterModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public SubCategoryMaster Get(long id)
        {
            throw new NotImplementedException();
        }


        public IEnumerable<ViewEntities.SubCategoryMaster> GetList()
        {
            var result = this.GetAllItems();

            if (result is not null)
            {
                var filteredResult = result.Where(item => item.IsActive == true);

                var mapperResult = filteredResult.Select(data => this.mapper.Map<DBO.SubCategoryMaster, ViewEntities.SubCategoryMaster>(data));

                return mapperResult;
            }

            return Enumerable.Empty<ViewEntities.SubCategoryMaster>();
        }

        public long Post(SubCategoryMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(SubCategoryMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }


        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<SubCategoryView>> GetList(CategoryMasterSearch request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@SearchText", request.SearchText);
            parameters.Add("@OffsetStart", request.OffsetStart);
            parameters.Add("@RowsPerPage", request.RowsPerPage);

            var result =  this.ExecStoredProcedureAsync<SubCategoryView>(Database.SP_GetSubCategoryMaster, parameters);

            return result;
        }

        public long Post(ViewEntities.SubCategoryMaster item)
        {
            var dboItem = this.mapper.Map<ViewEntities.SubCategoryMaster, DBO.SubCategoryMaster>(item);
            dboItem.Created = DateTime.Now;
            dboItem.IsActive = true;
            dboItem.CategoryMasterId = item.CategoryMasterId;
            dboItem.SubCategoryName = item.SubCategoryName;
            dboItem.Description = item.Description;
            dboItem.DisplayInList = true;
            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(ViewEntities.SubCategoryMaster item)
        {

            var dboItem = this.mapper.Map<ViewEntities.SubCategoryMaster, DBO.SubCategoryMaster>(item);
            dboItem.Created = DateTime.Now;
            dboItem.IsActive = item.IsActive;
            dboItem.CategoryMasterId = item.CategoryMasterId;
            dboItem.SubCategoryName = item.SubCategoryName;
            dboItem.Description = item.Description;
            dboItem.DisplayInList = true;
            this.UpdateItem(dboItem);
            return dboItem.Id;
        }
    }
}
