using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;

namespace DofyEcom.Public.API.Controllers
{
    [AllowAnonymous]
    [Route("api/ContactUsConfig")]
    public class ContactUsConfigController : BaseController<IContactUsConfigModel, ViewEntities.ContactUsConfig>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IContactUsConfigModel contactUsConfigModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public ContactUsConfigController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IContactUsConfigModel icontactUsConfigModel, CountryContext requestContext)
            : base(icontactUsConfigModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.contactUsConfigModel = icontactUsConfigModel;
            this.requestContext = requestContext;
        }

        [HttpGet]
        [Route("GetContactUsConfigList")]
        public async Task<IEnumerable<ViewEntities.ContactUsConfig>> GetContactUsConfigList()
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetList();
            });

            return result;
        }
    }
}
