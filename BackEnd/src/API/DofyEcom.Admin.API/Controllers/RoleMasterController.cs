using DofyEcom.Contract;
using DofyEcom.Contracts;
using DofyEcom.DBO;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{

    [Route("api/rolemaster")]
    [ApiController]
    public class RoleMasterController : BaseController<IRoleMasterModel, ViewEntities.RoleMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IRoleMasterModel roleMasterModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public RoleMasterController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IRoleMasterModel roleMasterModel, CountryContext requestContext)
            : base(roleMasterModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.roleMasterModel = roleMasterModel;
            this.requestContext = requestContext;
        }

        [HttpGet("rolelist")]
        public IActionResult GetRoleList()
        {
            try
            {
                var roles = roleMasterModel.GetList();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving roles: {ex.Message}");
            }
        }

        [HttpGet("GetActiveRolesForDropdown")]
        public ActionResult<IEnumerable<RoleMaster>> GetActiveRolesForDropdown()
        {
            var roles = roleMasterModel.GetActiveRolesForDropdown();

            if (roles == null || !roles.Any())
                return NotFound(new { Message = "No active roles found." });

            return Ok(roles);
        }
    }
}
