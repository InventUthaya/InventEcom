using DofyEcom.Contracts.Requests;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace DofyEcom.Public.API.Controllers;


    [Route("api/User")]
    [AllowAnonymous]
    public class UserMasterController : BaseController<IUserMasterModel, ViewEntities.UserMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IUserMasterModel userMasterModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public UserMasterController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IUserMasterModel userMasterModel, CountryContext requestContext)
            : base(userMasterModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.userMasterModel = userMasterModel;
            this.requestContext = requestContext;
        }

        [HttpPost("create")]
        public async Task<ActionResult<int>> CreateUser([FromBody] CreateOrUpdateUserRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { message = "Invalid user creation request." });
                }

                var userId = await userMasterModel.CreateUser(request);

                if (userId <= 0)
                {
                    return BadRequest(new { message = "Failed to create user." });
                }

                return Ok(new
                {
                    UserId = userId,
                    message = "User created successfully"
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

        [HttpGet("GetUserById")]
        public async Task<ActionResult<UserDetailsViewModel>> GetUserById([FromQuery] int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest(new { message = "Invalid user ID." });
                }

                var userDetails = await userMasterModel.GetUserByIdAsync(userId);

                return Ok(new
                {
                    UserDetails = userDetails,
                    message = "User retrieved successfully"
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

        [HttpPost("update/{id}")]
        public async Task<ActionResult<int>> UpdateUser(int id, [FromBody] CreateOrUpdateUserRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { message = "Invalid user update request." });
                }

                var userId = await userMasterModel.UpdateUser(id, request);

                if (userId <= 0)
                {
                    return BadRequest(new { message = "Failed to update user." });
                }

                return Ok(new
                {
                    UserId = userId,
                    message = "User updated successfully"
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
    [HttpGet]
    [Route("GetAddress")]
    public DofyEcom.Helper.ContactUsAddress GetAddress()
    {
        return this.Contract.GetAddress();
    }

    [HttpPost]
    [Route("UpdateUser")]
    public async Task<ActionResult<long>> UpdateUser([FromQuery] int? id, string? userName, string? Email, string? CustomerNumber)
    {

        var userId = await this.Contract.UpdateUserDetails(id, userName, Email, CustomerNumber);
        if (userId <= 0)
        {
            return BadRequest(new { message = "Failed to update user." });
        }

        return Ok(new
        {
            UserId = userId,
            message = "User updated successfully"
        });
    }
}
