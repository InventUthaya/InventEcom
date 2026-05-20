
using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.Contracts.Responses;
using DofyEcom.DAL;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminMasterController : BaseController<IScreenMasterModel, ViewEntities.ScreenMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IScreenMasterModel screenMasterModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public AdminMasterController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IScreenMasterModel screenMasterModel, CountryContext requestContext)
            : base(screenMasterModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.screenMasterModel = screenMasterModel;
            this.requestContext = requestContext;
        }

        [HttpGet]
        [Route("screens")]
        public async Task<ActionResult<ScreenPermissionViewModel>> GetScreensWithPermissionsAsync()
        {
            try
            {
                var screens = await this.Contract.GetScreensWithPermissionsAsync();
                if (screens == null || !screens.Any())
                    return NotFound(new { message = "Screen Access not found." });

                return Ok(new ScreenResponseViewModel { Screens = screens });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Route("role-permissions")]
        public async Task<IActionResult> UpsertRolePermissions([FromBody] RolePermissionRequest request)
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

    }
}
