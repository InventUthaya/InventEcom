using System.Threading.Tasks;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/rider-assignment")]
    [ApiController]
    public class RiderAssignmentController : BaseController<IRiderAssignmentModel, ViewEntities.RiderAssignment>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IRiderAssignmentModel riderAssignmentModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public RiderAssignmentController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IRiderAssignmentModel riderAssignmentModel, CountryContext requestContext)
            : base(riderAssignmentModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.riderAssignmentModel = riderAssignmentModel;
            this.requestContext = requestContext;
        }



        [HttpPost]
        [Route("AssignOrderToRiderOrCourier")]
        public async Task<ActionResult<long>> AssignOrderToRiderOrCourier([FromBody] RiderAssignment request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Invalid rider assignment request." });

                var assignmentId = await this.Contract.AssignOrderToRiderOrCourierAsync(request);

                if (assignmentId <= 0)
                    return BadRequest(new { message = "Failed to assign order to rider/courier." });

                return Ok(new
                {
                    AssignmentID = assignmentId,
                    message = "Order assigned to rider/courier successfully and status updated."
                });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Unexpected error: {ex.Message}" });
            }
        }

        [HttpGet("{riderId:long}")]
        public async Task<ActionResult<RiderDetailViewModel>> GetAssignmentsByRiderId(long riderId)
        {
            if (riderId <= 0)
                return BadRequest(new { message = "Invalid RiderID." });

            try
            {
                var result = await riderAssignmentModel.GetAssignmentsByRiderIdAsync(riderId);

                if (result == null)
                    return NotFound(new { message = "No assignments found for this rider." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching rider assignments.", details = ex.Message });
            }
        }

        [HttpGet("riders/assignments")]
        public async Task<ActionResult<IEnumerable<RiderDetailViewModel>>> GetAssignmentsByAllRiders()
        {
            try
            {
                var result = await riderAssignmentModel.GetAssignmentsByAllRidersAsync();

                //if (result == null || !result.Any())
                //    return NotFound(new { message = "No assignments found for riders." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching rider assignments.", details = ex.Message });
            }
        }

        [HttpPost("assign-rider-to-order")]
        public async Task<ActionResult> AssignRiderToOrder([FromBody] AssignRiderToOrderRequestViewModel request)
        {
            if (request == null || request.RiderID <= 0 || request.OrderID <= 0)
                return BadRequest(new { message = "Invalid RiderID or OrderID." });

            try
            {
                var success = await riderAssignmentModel.AssignRiderToOrderAsync(request.RiderID, request.OrderID);

                if (!success)
                    return NotFound(new { message = "No order details found for this OrderID or unable to assign rider." });

                return Ok(new { message = "Rider assigned to order successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while assigning rider.", details = ex.Message });
            }
        }

        [HttpPost("GetUsersByRole")]
        public async Task<ActionResult<ManagementUserViewModel>> GetAllManagementUsers([FromBody] UserPaginationRequestViewModel request)
        {
            try
            {
                var result = await riderAssignmentModel.GetAllManagementUsersAsync(request);

                //if (result == null || !result.Any())
                    //return NotFound(new { message = "No management users found." });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching management users.", details = ex.Message });
            }
        }


    }
}
