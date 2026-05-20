namespace Invent.Api.Controllers
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Security.Principal;
    using System.Threading.Tasks;
    using AutoMapper;
    using DofyEcom.Admin.API.Controllers;
    using DofyEcom.Contracts;
    using DofyEcom.ViewEntities;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    [Route("api/history")]
    [ApiController]
    public class OrderHistoryController : BaseController<IOrderHistoryModel, OrderHistory>
    {


        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IOrderHistoryModel cartModel;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;

        public OrderHistoryController(
            IOptionsSnapshot<AppConfiguration> iAppConfiguration,
            IMapper iMapper,
            IOrderHistoryModel iCartModel,
            IPrincipal iPrincipal = null)
            : base(iCartModel, iAppConfiguration)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.cartModel = iCartModel;
            this.iPrincipal = iPrincipal;
        }


        [HttpGet]
        [Route("GetHistory/{orderId}")]
        public ActionResult<OrderHistory> GetHistory(long orderId)
        {
            var history = this.Contract.GetAllByOrder(orderId);

            if (history == null)
            {
                return NotFound(new { message = "Order history not found" });
            }

            return Ok(history);
        }


    }
}
