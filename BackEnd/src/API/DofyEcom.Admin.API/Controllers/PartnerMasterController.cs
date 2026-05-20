using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.DAL;
using DofyEcom.Model;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using FirebaseAdmin.Messaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AutoMapper; 

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/products")] 
    [ApiController]
    public class PartnerMasterController : BaseController<IPartnerMaster, ViewEntities.PartnerMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IMapper mapper;
        private readonly CountryContext requestContext;

        public PartnerMasterController(
            IOptionsSnapshot<AppConfiguration> iAppConfiguration,
            IMapper iMapper,
            IPartnerMaster partnerMasterModel,
            CountryContext requestContext)
            : base(partnerMasterModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.requestContext = requestContext;
        }

        [HttpGet]
        [Route("GetAllPartner")]
        public async Task<IEnumerable<PartnerMaster>> GetAllPartner()
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetList();
            });

            return result;
        }

       
    }
}