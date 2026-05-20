using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.Contracts.Responses;
using DofyEcom.Model;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/ScreenMaster")]
    [ApiController]
    public class ScreenMasterController : BaseController<IScreenMasterModel, ViewEntities.ScreenMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IScreenMasterModel Screen;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public ScreenMasterController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IScreenMasterModel Screen, CountryContext requestContext)
            : base(Screen, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.Screen = Screen;
            this.requestContext = requestContext;
        }


        [HttpGet("getall")]
        public IActionResult GetGradeList()
        {
            try
            {
                var grades = Screen.GetList();
                return Ok(grades);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving grades: {ex.Message}");
            }
        }


        [HttpPost]
        [Route("RolepermissionCreate")]
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
