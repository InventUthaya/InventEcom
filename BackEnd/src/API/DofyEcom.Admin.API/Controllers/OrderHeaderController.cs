using System.Diagnostics.Contracts;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/orderdetail")]
    [ApiController]
    public class OrderHeaderController : BaseController<IOrderHeaderModel, ViewEntities.OrderHeader>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IOrderHeaderModel _orderHeaderModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public OrderHeaderController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IOrderHeaderModel orderHeaderModel, CountryContext requestContext)
            : base(orderHeaderModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this._orderHeaderModel = orderHeaderModel;
            this.requestContext = requestContext;
        }

        [HttpPost("UpdateOrderStatus")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, string statusName)
        {


            if (orderId == 0 || statusName == null)
                return BadRequest(new { message = "Invalid Order data." });


            var success = await this.Contract.UpdateOrderStatus(orderId, statusName);
            if (success)
                return Ok(new { message = "Order Status updated successfully." });

            return BadRequest(new { message = "Failed to update Order Status." });
        }

        [HttpPost("CompleteOrderOTP")]
        public async Task<IActionResult> CompleteOrderOTP(int orderId)
        {


            if (orderId == 0)
                return BadRequest(new { message = "Invalid Order data." });


            var success = await this.Contract.CompleteOrderOTP(orderId);
            if (success)
                return Ok(new { message = "OTP Generated successfully." });

            return BadRequest(new { message = "Failed to Generate stock." });
        }

        [HttpPost("VerifyOrderOTP")]
        public async Task<IActionResult> VerifyOrderOTP([FromQuery] int orderId, [FromQuery] string otp)
        {


            if (orderId == 0)
                return BadRequest(new { message = "Invalid Order data." });


            var success = await this.Contract.VerifyOrderOTP(orderId, otp);
            if (success)
                return Ok(new { message = "OPT Validated successfully." });

            return Unauthorized(new { message = "Incorrect OTP" });
        }

        [HttpGet("GetDashboardStatistics")]
        public async Task<IActionResult> GetDashboardStatistics()
        {
            var result = await this.Contract.GetDashboardStatisticsAsync();

            if (result == null)
            {
                return NotFound("Dashboard statistics not found.");
            }

            return Ok(result);
        }

        [HttpGet("GetStatistics")]
        public async Task<IActionResult> GetStatistics(
            [FromQuery] int? partnerId,
            [FromQuery] string statusName,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate
        )
        {
            var result = (await this.Contract.GetStatisticsAsync(
                partnerId,
                statusName,
                fromDate,
                toDate
            ))?.ToList();

            if (result == null || result.Count == 0)
            {
                return NotFound("Dashboard statistics not found.");
            }

            return Ok(result);
        }

        [HttpGet("GetLatestOrders")]
        public async Task<IActionResult> GetLatestOrders(
       DateTime? fromDate,
       DateTime? toDate,
       int? partnerId
   )
        {
            var result = (await this.Contract
                .GetLatestOrdersAsync(fromDate, toDate, partnerId))
                ?.ToList();

            //if (result == null || result.Count == 0)
            //{
            //    return NotFound("Latest orders not found.");
            //}

            return Ok(result);
        }


        [HttpGet("GetTodayOrders")]
        public async Task<IActionResult> GetTodayOrders(
          [FromQuery] DateTime? fromDate,
          [FromQuery] DateTime? toDate,
          [FromQuery] int? partnerId
      )
        {
            var result = await this.Contract.GetTodayOrdersAsync(
                fromDate,
                toDate,
                partnerId
            );

            return Ok(result);
        }

        [HttpGet("GetGraphPath")]
        public async Task<IActionResult> GetGraphPath(
     [FromQuery] int? partnerId,
     [FromQuery] string groupBy,
     [FromQuery] DateTime? fromDate,
     [FromQuery] DateTime? toDate
 )
        {
            var result = await this.Contract.GetGraphPathAsync(
                partnerId,
                groupBy,
                fromDate,
                toDate
            );

            return Ok(result);
        }





    }

}
