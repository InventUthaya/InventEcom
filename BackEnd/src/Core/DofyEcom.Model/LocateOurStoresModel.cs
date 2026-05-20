namespace DofyEcom.Model;

using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using DataTables.AspNet.Core;
public class LocateOurStoresModel : BaseModel<DBO.LocateOurStores>, IPublicLocateOurStoresModel
{
    private readonly IOptionsSnapshot<AppConfiguration> config;
    private readonly IMapper mapper;
    private readonly IPrincipal iPrincipal;
    private readonly CountryContext context;

    public LocateOurStoresModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal iPrincipal, CountryContext requestContext = null)
        : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
    {
        this.config = iConfig;
        this.mapper = iMapper;
        this.iPrincipal = iPrincipal;
        this.context = requestContext;
    }

    public PagedList<LocateOurStoresSearch> GetLocateOurStoresList(SearchBaseCriteria criteria)
    {
        var param = new
        {
            WhereClause = criteria.SearchText,
            OffsetStart = criteria.OffsetStart,
            RowsPerPage = criteria.RowsPerPage,
        };

       var results = base.GetPagedSProcResultWithCriteria<LocateOurStoresSearch>(criteria,Database.SP_GetLocateOurStoresList, param);

        return results;
    }
    public ViewEntities.LocateOurStores Get(long id)
    {
        throw new NotImplementedException();
    }

    public IEnumerable<ViewEntities.LocateOurStores> GetLocateOurStore()
    {
        var results = this.FindItems(item => item.Id > 0);
        var mapperResults = this.mapper.Map<IEnumerable<DBO.LocateOurStores>, IEnumerable<ViewEntities.LocateOurStores>>(results);

        return mapperResults;
    }

    //public IEnumerable<ViewEntities.CarousalBanner> GetList()
    //{
    //    throw new NotImplementedException();
    //}

    IEnumerable<ViewEntities.LocateOurStores> IBaseModel<ViewEntities.LocateOurStores>.GetList()
    {
        var results = this.FindItems(item => item.Id > 0);
        var mapperResults = this.mapper.Map<IEnumerable<DBO.LocateOurStores>, IEnumerable<ViewEntities.LocateOurStores>>(results);
        foreach (var item in mapperResults)
        {
            item.EncryptedId = EncryptAES(item.Id.ToString(), this.config.Value?.AESEncryptionConfiguration?.EncryptionKey ?? "");
            item.Id = 0;
        }
        return mapperResults;
    }

    public long Post(ViewEntities.LocateOurStores item, IFormFileCollection postedFileCollection)
    {
        throw new NotImplementedException();
    }

    public long Put(ViewEntities.LocateOurStores item, IFormFileCollection postedFileCollection)
    {
        throw new NotImplementedException();
    }

    public long Post(ViewEntities.LocateOurStores item)
    {
        throw new NotImplementedException();
    }

    public long Put(ViewEntities.LocateOurStores item)
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
