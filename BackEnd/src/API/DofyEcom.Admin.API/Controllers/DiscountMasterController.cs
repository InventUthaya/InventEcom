using DofyEcom.Contracts;
using DofyEcom.DAL.Interfaces;
using DofyEcom.DBO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/discountmaster")]
    [ApiController]
    public class DiscountMasterController : BaseController<IDiscountMasterModel, ViewEntities.DiscountMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IDiscountMasterModel idiscountmodel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public DiscountMasterController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IDiscountMasterModel idiscountmodel, CountryContext requestContext)
            : base(idiscountmodel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.idiscountmodel = idiscountmodel;
            this.requestContext = requestContext;
        }


        [HttpGet]
        [Route("GetActiveDiscounts")]
        public async Task<IEnumerable<ViewEntities.DiscountMaster>> GetDiscountList()
        {
            var pagedResult = await Task.Run(() =>
            {
                var result = this.Contract.GetDiscountList();

                return result;
            });

            return pagedResult;
        }

    }
}
