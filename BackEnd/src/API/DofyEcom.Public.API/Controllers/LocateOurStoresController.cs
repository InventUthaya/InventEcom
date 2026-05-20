namespace DofyEcom.Public.API.Controllers.Master
{
    using DofyEcom.Contracts;
    using DofyEcom.ViewEntities;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities;
    using Microsoft.Extensions.Options;
    using AutoMapper;
    using Microsoft.AspNetCore.Mvc;


    [Route("api/LocateOurStores")]
    public class LocateOurStoresController : BaseController<IPublicLocateOurStoresModel, LocateOurStores>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly CountryContext requestContext;
        private readonly IPublicLocateOurStoresModel locateOurStores;
        private IMapper mapper;

        public LocateOurStoresController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper, IPublicLocateOurStoresModel iPublicLocateOurStoresModel, CountryContext requestContext)
       : base(iPublicLocateOurStoresModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.locateOurStores = iPublicLocateOurStoresModel;
            this.mapper = iMapper;
            this.requestContext = requestContext;
        }

        [HttpPost]
        [Route("GetLocateOurStoresList")]
        public async Task<PagedList<LocateOurStoresSearch>> PagedLocateOurStoresList(SearchBaseCriteria criteria)
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetLocateOurStoresList(criteria);
            });

            return result;
        }

        [HttpGet]
        [Route("GetList")]
        public async Task<IEnumerable<LocateOurStores>> GetList()
        {
            var pagedResult = await Task.Run(() =>
            {
                var result = this.Contract.GetList();

                return result;
            });

            return pagedResult;
        }
    }
}
