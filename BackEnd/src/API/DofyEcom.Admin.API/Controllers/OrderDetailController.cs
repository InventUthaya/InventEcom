using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.Contracts.Responses;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using FirebaseAdmin.Messaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderDetailController : BaseController<IOrderDetailModel, ViewEntities.OrderDetail>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IOrderDetailModel _orderDetailsModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public OrderDetailController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IOrderDetailModel orderDetailsModel, CountryContext requestContext)
            : base(orderDetailsModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this._orderDetailsModel = orderDetailsModel;
            this.requestContext = requestContext;
        }

        [HttpPost]
        [Route("CreateOrder")]
        public async Task<ActionResult<OrderCreateResponse>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Invalid order request." });

                var result = this.Contract.CreateOrder(request);

                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost]
        [Route("CreateBulkOrder")]
        public async Task<ActionResult<List<OrderCreateResponse>>> CreateBulkOrder([FromBody] List<CreateOrderRequest> requests)
        {
            try
            {
                if (requests == null || !requests.Any())
                    return BadRequest(new { message = "Invalid bulk order request." });

                var result = await Task.Run(() =>
                {
                    return this.Contract.CreateBulkOrder(requests);
                });
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("GetOrders")]

        public async Task<IEnumerable<OrderResponseModel>> GetOrders(GetOrdersCriteria item)
        {
            var pagedResult = await Task.Run(() =>
            {
                return this.Contract.GetOrders(item);
            });

            return pagedResult;
        }

        [HttpGet]
        [Route("GetOrderDetails/{orderId}")]
        public async Task<ActionResult<GetOrderDetailsViewModel>> GetOrderDetails(int orderId)
        {
            try
            {
                var result = await Task.Run(() =>
                {
                    return this.Contract.GetOrderDetails(orderId);
                });
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("GenerateInvoice/{orderId}")]
        public async Task<ActionResult<byte[]>> GenerateInvoice(int orderId)
        {
            try
            {
                var result = await Task.Run(() =>
                {
                    return this.Contract.GenerateInvoice(orderId);
                });
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("CancelOrder/{orderId}")]
        public async Task<ActionResult<bool>> CancelOrder(int orderId, string reason)
        {
            try
            {
                if (orderId <= 0)
                    return BadRequest(new { message = "Invalid order ID." });

                var result = await this.Contract.CancelOrder(orderId, reason);
                if (result)
                {
                    return Ok(new { Success = result, Message = "Order Cancelled Successfully" });
                }
                return Ok(new { Success = result, Message = "Order Failed to Cancel!" });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpPost]
        [Route("UpdateOrderStatusById")]
        public async Task<ActionResult<bool>> UpdateOrderStatusById([FromBody] UpdateOrderStatusRequest request)
        {
            try
            {

                var result = await this.Contract.UpdateOrderStatusById(request);
                if (result)
                {
                    return Ok(new { Success = result, Message = "Order Cancelled Successfully" });
                }
                return Ok(new { Success = result, Message = "Order Failed to Cancel!" });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
