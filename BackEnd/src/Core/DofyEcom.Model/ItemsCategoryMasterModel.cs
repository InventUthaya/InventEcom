

using System.Security.Principal;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class ItemsCategoryMasterModel : BaseModel<DBO.ItemsCategoryMaster>, IItemsCategoryMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public ItemsCategoryMasterModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public ItemsCategoryMaster Get(long id)
        {
            throw new NotImplementedException();
        }


        public IEnumerable<ViewEntities.ItemsCategoryMaster> GetList()
        {
            var result = this.GetAllItems();

            if (result is not null)
            {
                var filteredResult = result.Where(item => item.IsActive == true);

                var mapperResult = filteredResult.Select(data => this.mapper.Map<DBO.ItemsCategoryMaster, ViewEntities.ItemsCategoryMaster>(data));

                return mapperResult;
            }

            return Enumerable.Empty<ViewEntities.ItemsCategoryMaster>();
        }

        public long Post(ItemsCategoryMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ItemsCategoryMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }


        public async Task<IEnumerable<ItemSubCategoryView>> GetList(CategoryMasterSearch request)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@SearchText", request.SearchText);
            parameters.Add("@OffsetStart", request.OffsetStart);
            parameters.Add("@RowsPerPage", request.RowsPerPage);

            var result = await this.ExecStoredProcedureAsync<ItemSubCategoryView>(Database.SP_GetItemsSubCategoryMaster, parameters);

            return result;
        }


        public long Post(ViewEntities.ItemsCategoryMaster item)
        {
            var dboItem = this.mapper.Map<ViewEntities.ItemsCategoryMaster, DBO.ItemsCategoryMaster>(item);
            dboItem.Created = DateTime.Now;
            dboItem.IsActive = true;
            dboItem.SubCategoryMasterId = item.SubCategoryMasterId;
            dboItem.ItemsCategoryName = item.ItemsCategoryName;
            dboItem.Description = item.Description;
            dboItem.DisplayInList = true;
            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(ViewEntities.ItemsCategoryMaster item)
        {

            var dboItem = this.mapper.Map<ViewEntities.ItemsCategoryMaster, DBO.ItemsCategoryMaster>(item);
            dboItem.Created = DateTime.Now;
            dboItem.IsActive = item.IsActive;
            dboItem.SubCategoryMasterId = item.SubCategoryMasterId;
            dboItem.ItemsCategoryName = item.ItemsCategoryName;
            dboItem.Description = item.Description;
            dboItem.DisplayInList = true;
            this.UpdateItem(dboItem);
            return dboItem.Id;
        }

    }
}
