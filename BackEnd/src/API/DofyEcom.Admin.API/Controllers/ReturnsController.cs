namespace Invent.Api.Controllers
{
    using System.Threading.Tasks;
    using AutoMapper;
    using DofyEcom.Admin.API.Controllers;
    using DofyEcom.Contracts;
    using DofyEcom.Contracts.Interfaces;
    using DofyEcom.ViewEntities;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    [ApiController]
    [Route("api/[controller]")]
    public class ReturnsController : BaseController<IReturnsModel,Returns>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IReturnsModel returnsModel;
        private readonly IMapper mapper;

        public ReturnsController(
            IOptionsSnapshot<AppConfiguration> iAppConfiguration,
            IMapper iMapper,
            IReturnsModel iReturnsModel)
            : base(iReturnsModel, iAppConfiguration)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.returnsModel = iReturnsModel;
        }

        // ========== USER API ==========
        // POST: /api/returns
        [HttpPost]
        public async Task<ActionResult<Returns>> CreateReturn([FromBody] Returns model)
        {
            var userId = "guest"; // TODO: replace with JWT claim

            var result = await this.returnsModel.CreateReturnAsync(model, userId);
            if (result == null)
                return BadRequest(new { Message = "Unable to create return request" });

            return Ok(result);
        }


        // ========== ADMIN API ==========
        // PUT: /api/admin/returns/{returnId}/status
        [HttpPost("/api/admin/returns/{id}/status")]
        public async Task<ActionResult> UpdateStatus(int id, [FromBody] Returns model)
        {
            var adminId = "system"; // TODO: replace with JWT claim

            var success = await this.returnsModel.UpdateReturnStatusAsync(id, model, adminId);
            if (!success) return NotFound(new { Message = "Return not found or update failed" });

            return Ok(new { Success = true });
        }
    }
}
