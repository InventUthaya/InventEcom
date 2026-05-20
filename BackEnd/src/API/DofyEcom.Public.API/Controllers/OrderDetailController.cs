using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.Contracts.Responses;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using FirebaseAdmin.Messaging;
using iText.Layout.Borders;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Public.API.Controllers
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
        [Route("CreateBulkOrder")]
        public async Task<ActionResult<List<OrderCreateResponse>>> CreateBulkOrder(
    [FromBody] List<CreateOrderRequest> requests)
        {
            try
            {
                if (requests == null || !requests.Any())
                    return BadRequest(new { message = "Invalid bulk order request." });

                var result = this.Contract.CreateBulkOrder(requests);

                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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
        [Route("GetOrders")]

        public async Task<IEnumerable<OrderResponseModel>> GetOrders(GetOrdersCriteria item)
        {
            var pagedResult = await Task.Run(() =>
            {
                return this.Contract.GetOrders(item);
            });

            return pagedResult;
        }

        [HttpPost]
        [Route("GetOrderDetails")]
        public async Task<ActionResult<GetOrderDetailsViewModel>> GetOrderDetails([FromQuery] int orderId)
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


        [HttpPost]
        [Route("GetOrderByCustomerId")]
        public async Task<IActionResult> GetOrderByCustomerId([FromQuery] string customerId, string? filterType)
        {
            int id = (int)Convert.ToInt64(customerId);

            //if (!string.IsNullOrEmpty(customerId))
            //{
            //    id = (int)Convert.ToInt64(DecryptAESs(customerId.ToString()));
            //}
            var result = await Task.Run(() =>
                this.Contract.GetOrderByCustomerId(id, filterType)
            );

            return Ok(result);
        }


        [HttpGet]
        [Route("GenerateInvoice")]
        public async Task<ActionResult<byte[]>> GenerateInvoice([FromQuery] int orderId)
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
        [Route("CancelOrder")]
        public async Task<ActionResult<bool>> CancelOrder([FromBody] CancelOrderRequestViewModel request)
        {
            try
            {
                if (request.OrderId <= 0)
                    return BadRequest(new { message = "Invalid order ID." });

                var result = await this.Contract.CancelOrder(request.OrderId, request.Reason);
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
        [Route("BulkCancelOrder")]
        public async Task<ActionResult<bool>> BulkCancelOrder(
    [FromQuery] List<int> orderIds,
    [FromQuery] string reason)
        {
            try
            {
                if (orderIds == null || !orderIds.Any())
                    return BadRequest(new { message = "Invalid order IDs." });

                var result = await this.Contract.BulkCancelOrder(orderIds, reason);

                if (result)
                {
                    return Ok(new { Success = true, Message = "Orders Cancelled Successfully" });
                }

                return Ok(new { Success = false, Message = "Orders Failed to Cancel!" });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("DeleteOrderById/{id}")]
        public async Task<bool> DeleteOrderById(string id, string customerId)
        {
            var EncryptCustomerId = 0;
            var EncryptOrderId = "";
            if (!string.IsNullOrEmpty(customerId))
            {
                EncryptCustomerId = (int)Convert.ToInt64(DecryptAES(customerId.ToString()));
            }
            if (!string.IsNullOrEmpty(id))
            {
                EncryptOrderId = DecryptAES(id);
            }
            var pagedResult = await Task.Run(() =>
            {
                var result = this.Contract.DeleteOrderById(EncryptOrderId, EncryptCustomerId);

                return result;
            });

            return pagedResult;
        }

        [HttpGet]
        [Route("GetReturnDaysConfig")]
        public EnableReturnButton GetReturnDaysConfig()
        {
            return this.Contract.GetReturnDaysConfig();
        }

        [HttpPost]
        [Route("CreateShoppingCartItem")]
        public async Task<ActionResult<List<long>>> CreateShoppingCartItem([FromBody] AddToCartItemViewModel item)
        {

            var result = await this.Contract.AddToCart(item);
            return Ok(result);
        }

        [HttpPost]
        [Route("UpdateOrder")]
        public async Task<ActionResult<UpdateOrderResponse>> UpdateOrder([FromBody] UpdateOrderRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new UpdateOrderResponse
                    {
                        OrderId = 0,
                        Status = "Error",
                        Message = "Invalid update request."
                    });

                if (request.OrderId <= 0)
                    return BadRequest(new UpdateOrderResponse
                    {
                        OrderId = 0,
                        Status = "Error",
                        Message = "Valid OrderId is required."
                    });

                var result = this.Contract.UpdateOrder(request);

                if (result.Status == "Error")
                    return BadRequest(result);

                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new UpdateOrderResponse
                {
                    OrderId = request?.OrderId ?? 0,
                    Status = "Error",
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new UpdateOrderResponse
                {
                    OrderId = request?.OrderId ?? 0,
                    Status = "Error",
                    Message = "An internal server error occurred."
                });
            }
        }

        [HttpPost]
        [Route("AddAddress")]
        public ActionResult<UserAddress> AddAddress([FromBody] UserAddress request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new
                    {
                        Status = "Error",
                        Message = "Invalid create request."
                    });
                }

                var result = this.Contract.AddAddress(request);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Status = "Error",
                    Message = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("GetShoppingCartDetails")]
        public async Task<PagedList<ShoppingCartItemViewModel>> GetShoppingCartDetails([FromQuery] int customerId)
        {
            //var id = 0;
            //if (!string.IsNullOrEmpty(customerId))
            //{
            //    id = (int)Convert.ToInt64(DecryptAES(customerId.ToString()));
            //}
            var result = await this.Contract.GetShoppingCartDetails(customerId);
            return result;
        }

        [HttpPost("Remove")]
        public async Task<ActionResult<long>> RemoveCartItem([FromQuery] string cartId)
        {
            var id = 0;
            if (!string.IsNullOrEmpty(cartId))
            {
                if (int.TryParse(cartId, out int parsedId))
                {
                    id = parsedId;
                }
                else
                {
                    id = (int)Convert.ToInt64(DecryptAES(cartId.ToString()));
                }
            }
            var result = await this.Contract.RemoveCartItem(id);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetImage/{productId}/{categoryId}")]
        public async Task<IActionResult> GetImages(int productId, int categoryId)
        {
            try
            {
                var result = await this.Contract.GetImages(productId, categoryId);

                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("SubmitProductReview")]
        public async Task<IActionResult> AddReview([FromForm] ReviewViewModel model)
        {
            try
            {
                var result = await this.Contract.AddReview(model);
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }


    }
}

