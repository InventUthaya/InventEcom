using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.Contracts.Responses;
using DofyEcom.Model;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;
using static Google.Apis.Requests.BatchRequest;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/Rolepermission")]
    [ApiController]
    public class RolePermissionMappingController : BaseController<IRolePermissionModel, ViewEntities.RolePermissionMapping>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IRolePermissionModel rolePermission;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public RolePermissionMappingController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IRolePermissionModel rolePermission, CountryContext requestContext)
            : base(rolePermission, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.rolePermission = rolePermission;
            this.requestContext = requestContext;
        }



        [HttpPost]
        [Route("RolepermissionCreate")]
        public async Task<IActionResult> UpsertRolePermissions([FromBody] RolePermissionUpdateRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Invalid request." });

                this.Contract.CreateRolePermission(request);

                return Ok(new { success = true });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpGet("GetRoleList")]
        public IActionResult GetRoleList()
        {
            try
            {
                var response = this.Contract.GetList();
                return Ok(response);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}

