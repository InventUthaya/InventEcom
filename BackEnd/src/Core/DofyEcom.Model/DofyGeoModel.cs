namespace DofyEcom.Model
{
    using System.Security.Principal;
    using AutoMapper;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.Model;
    using Microsoft.Extensions.Options;
    using DofyEcom.ViewEntities;
    using Microsoft.AspNetCore.Http;
    using DataTables.AspNet.Core;

    public class DofyGeoModel : BaseModel<DBO.DofyGeo>, IDofyGeoModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public DofyGeoModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal iPrincipal = null, CountryContext requestContext = null)
           : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public ViewEntities.DofyGeo Get(long id)
        {
            var result = this.FindItem(item => item.Id == id);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.DofyGeo, ViewEntities.DofyGeo>(result);

                return mapperResult;
            }

            return default;
        }

        public IEnumerable<ViewEntities.DofyGeo> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            var mapperResults = this.mapper.Map<IEnumerable<DBO.DofyGeo>, IEnumerable<ViewEntities.DofyGeo>>(results);

            return mapperResults;
        }

        public IEnumerable<ViewEntities.DofyGeo> GetPincodeAvailability(string pincode)
        {
            var result = this.FindItems(item => item.Code.ToLower() == pincode.ToLower() && item.IsActive == true);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<IEnumerable<DBO.DofyGeo>, IEnumerable<ViewEntities.DofyGeo>>(result);
                foreach (var item in mapperResult)
                {
                    item.EncryptedId = EncryptAES(item.Id.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                    item.Id = 0;
                }
                return mapperResult;
            }

            return default;
        }

        //public DofyEcom.Helper.CdnImages getImageSlider()
        //{
        //    var result = new DofyEcom.Helper.CdnImages();

        //    result.CDN = this.config.Value?.ApplicationConfiguration?.CDN != null ? this.config.Value?.ApplicationConfiguration?.CDN : null;
        //    return result;
        //}

        public IEnumerable<ViewEntities.DofyGeo> GetDofyGeoListBysearch(string searchText)
        {
            searchText = !string.IsNullOrEmpty(searchText) ? searchText.ToLower() : string.Empty;
            var result = this.FindItems(item => item.IsActive == true && item.DisplayInList == true)?.OrderBy(x => x.EnumName);

            if (result is not null)
            {
                var filteredResult = !string.IsNullOrEmpty(searchText) ? result?.Where(x => x.Name.ToLower().Contains(searchText) || x.EnumName.ToLower().Contains(searchText)) : result;
                filteredResult = filteredResult?.Count() > 10 ? filteredResult.Take(10) : filteredResult;
                var mapperResult = this.mapper.Map<IEnumerable<DBO.DofyGeo>, IEnumerable<ViewEntities.DofyGeo>>(filteredResult);

                return mapperResult;
            }

            return default;
        }

        //public PagedList<ViewEntities.DofyGeo> GetDofyGeoListBySearchText(string searchText, int? parent)
        //{
        //    var param = new
        //    {
        //        Parent = parent,
        //        SearchText = searchText != "null" ? searchText : null
        //    };

        //    var results = this.GetPagedSProcResult<ViewEntities.DofyGeo>(Database.SP_GetDofyGeoSearch, param);
        //    foreach (var item in results)
        //    {
        //        item.EncryptedId = EncryptAES(item.Id.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
        //        item.EncryptedIdentifier = EncryptAES(item.Identifier.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
        //        item.EncryptedParent = EncryptAES(item.Parent.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");

        //    }
        //    return results;
        //}
        public async Task<IEnumerable<ViewEntities.DofyGeo>>
 GetDofyGeoListBySearchTextAsync(string searchText, int? parentId)
        {
            // Normalize search text
            if (string.IsNullOrWhiteSpace(searchText) || searchText == "null")
                searchText = "";

            var allItems = this.GetAllItems();

            var filtered = allItems.Where(x =>
                // Parent filter
                (!parentId.HasValue || x.Parent == parentId.Value)

                // Search filter
                && (string.IsNullOrEmpty(searchText)
                    || (x.Name ?? "").Contains(searchText, StringComparison.OrdinalIgnoreCase)
                    || (x.EnumName ?? "").Contains(searchText, StringComparison.OrdinalIgnoreCase))
            );

            var result = filtered
                .OrderBy(x => x.RowOrder)
                .Select(x => new ViewEntities.DofyGeo
                {
                    Id = x.Id,
                    Name = x.Name
                });

            return await Task.FromResult(result);
        }

        public IEnumerable<ViewEntities.DofyGeo> GetStateList(long serviceTypeId)
        {
            var results = this.GetAllItems();
            var result = results?.Where(item => item.IsActive == true && item.Level == (long)LOCATION_ENUM.STATE)?.OrderBy(x => x.RowOrder);

            if (result is not null)
            {
                var mapperResult = this.mapper.Map<IEnumerable<DBO.DofyGeo>, IEnumerable<ViewEntities.DofyGeo>>(result);
                foreach (var item in mapperResult)
                {
                    item.EncryptedId = EncryptAES(item.Id.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                    item.EncryptedIdentifier = EncryptAES(item.Identifier.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                    item.EncryptedParent = EncryptAES(item.Parent.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");

                }
                return mapperResult;
            }

            return default;
        }
        public IEnumerable<ViewEntities.DofyGeo> GetCityList(long serviceTypeId, long StateId)
        {
            var results = this.GetAllItems();
            var result = results?.Where(item => item.IsActive == true && item.Parent == StateId && item.Level == (long)LOCATION_ENUM.DISTRICT)?.OrderBy(x => x.RowOrder);

            if (result is not null)
            {
                var mapperResult = this.mapper.Map<IEnumerable<DBO.DofyGeo>, IEnumerable<ViewEntities.DofyGeo>>(result);
                foreach (var item in mapperResult)
                {
                    item.EncryptedId = EncryptAES(item.Id.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                    item.EncryptedIdentifier = EncryptAES(item.Identifier.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
                    item.EncryptedParent = EncryptAES(item.Parent.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");

                }
                return mapperResult;
            }

            return default;
        }

        public long Post(DofyGeo item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(DofyGeo item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(DofyGeo item)
        {
            throw new NotImplementedException();
        }

        public long Put(DofyGeo item)
        {
            throw new NotImplementedException();
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
