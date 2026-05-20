
using DofyEcom.Contracts;
using DofyEcom.DAL;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using FirebaseAdmin.Messaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/taxination")]
    [ApiController]
    public class TaxManagementController : BaseController<ITaxManagementModel, ViewEntities.TaxManagement>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly ITaxManagementModel taxManagementModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public TaxManagementController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            ITaxManagementModel taxManagementModel, CountryContext requestContext)
            : base(taxManagementModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.taxManagementModel = taxManagementModel;
            this.requestContext = requestContext;
        }


        [HttpPost("GetTaxList")]
        public async Task<ActionResult<TaxManagement>> GetTaxt([FromBody] TaxPaginationRequestViewModel request)
        {
            var result = this.Contract.GetTaxListAsync(request);

            return Ok(result);
        }

        [HttpPost("CreateOrEditTax")]
        public async Task<long> Create(TaxManagement item)
        {
            var reault = await Task.Run(() =>
            {
                return this.Contract.Post(item);
            });

            return reault;
        }
        [HttpGet]
        [Route("GetTaxById/{id}")]
        public async Task<ActionResult<TaxManagement>> GetTax(long id)
        {
            try
            {
                var result = await Task.Run(() =>
                {
                    return this.Contract.GetTaxById(id);
                });

                return result;
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
