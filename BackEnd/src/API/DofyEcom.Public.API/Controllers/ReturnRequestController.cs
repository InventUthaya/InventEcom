using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces;
using DofyEcom.Model;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Public.API.Controllers
{
    [ApiController]
    [Route("api/ReturnRequest")]
    public class ReturnRequestController : ControllerBase
    {
        private readonly IReturnRequestModel _returnsModel;

        public ReturnRequestController(IReturnRequestModel returnModel)
        {
            _returnsModel = returnModel;
        }

        [HttpPost("GetAllRefunds")]
        public async Task<IEnumerable<ReturnRequest>> GetAllRefunds(RefundFilterRequest filter)
        {
            var list = await _returnsModel.GetReturnListAsync(filter);

            return list;
        }

        //[HttpGet("GetReturnList")]
        //public async Task<IActionResult> GetReturnList([FromQuery] RefundFilterRequest filter)
        //{
        //    var list = await _returnsModel.GetReturnListAsync(filter);

        //    return Ok(new
        //    {
        //        data = list,
        //        totalCount = list?.Count() ?? 0
        //    });
        //}
        [HttpPost("GetReturnList")]
        public async Task<IEnumerable<ReturnRequest>> GetReturnList([FromBody] RefundFilterRequest filter)
        {
            var list = await _returnsModel.GetReturnListAsync(filter);


            return list;

        }


        // ===============================
        // GET RETURN BY ID
        // ===============================
        [HttpGet("GetRefundById")]
        public async Task<IActionResult> GetRefundById(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid id" });

            var item = await _returnsModel.GetReturnByIdAsync(id);

            if (item == null)
                return NotFound(new { message = "Return not found" });

            return Ok(item);
        }

        [HttpPost("CreateReturn")]
        public async Task<IActionResult> CreateReturn([FromBody] CreateReturnRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Invalid request" });

            try
            {
                var returnId = await _returnsModel.CreateReturnAsync(
                    request.OrderId,
                    request.OrderDetailId,
                    request.SkuId,
                    request.UserId,
                    request.Reason,
                    request.RefundAmount,
                    request.PartnerId,
                    request.IsReturn
                );

                return Ok(new { message = "Return request created successfully", ReturnId = returnId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("DeleteReturn")]
        public async Task<IActionResult> DeleteReturn(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid id" });

            var deleted = await _returnsModel.DeleteRefundAsync(id);

            if (!deleted)
                return BadRequest(new { message = "Failed to delete return request" });

            return Ok(new { message = "Return request deleted successfully" });
        }

        // ===============================
        // UPDATE RETURN STATUS
        // ===============================
        public class UpdateRefundStatusRequest
        {
            public int OrderId { get; set; }
            public int OrderDetailId { get; set; }
            public int SkuId { get; set; }
            public int ReturnId { get; set; }
            public int StatusId { get; set; }
            public string Note { get; set; } = string.Empty;
            public decimal? RefundAmount { get; set; }
            public int? RefundPaymentId { get; set; }
        }

        [HttpPut("EditReturn")]
        public async Task<IActionResult> EditReturn([FromBody] EditReturnRequest request)
        {
            if (request == null || request.ReturnId <= 0)
                return BadRequest(new { message = "Invalid request" });

            var updated = await _returnsModel.EditReturnAsync(
                request.ReturnId,
                request.Reason,
                request.RefundAmount
            );

            if (!updated)
                return BadRequest(new { message = "Failed to update return request" });

            return Ok(new { message = "Return updated successfully" });
        }

        [HttpPost("UpdateRefundStatus")]
        public async Task<IActionResult> UpdateRefundStatus([FromBody] UpdateRefundStatusRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Invalid request" });

            var updated = await _returnsModel.UpdateReturnStatusAsync(
                request.OrderId,
                request.OrderDetailId,
                request.SkuId,
                request.ReturnId,
                request.StatusId,
                request.Note,
                request.RefundAmount,
                request.RefundPaymentId
            );

            if (!updated)
                return BadRequest(new { message = "Failed to update return request" });

            return Ok(new { message = "Status updated successfully" });
        }
    }
}
