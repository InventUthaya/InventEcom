using System.Security.Claims;
using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Public.API.Controllers
{
    [Route("api/OrderHistory")]
    [ApiController]
    public class OrderHistoryController : BaseController<IOrderHistoryModel, ViewEntities.OrderHistory>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IOrderHistoryModel cartModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public OrderHistoryController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IOrderHistoryModel cartModel, CountryContext requestContext)
            : base(cartModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.cartModel = cartModel;
            this.requestContext = requestContext;
        }



     

    }
}

