using DofyEcom.Contracts;
using DofyEcom.DAL.Interfaces;
using DofyEcom.DBO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/ledger")]
    [ApiController]
    public class InventoryController : BaseController<IInventoryModel, ViewEntities.Sku>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IInventoryModel inventoryModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public InventoryController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IInventoryModel inventoryModel, CountryContext requestContext)
            : base(inventoryModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.inventoryModel = inventoryModel;
            this.requestContext = requestContext;
        }


        [HttpGet]
        [Route("GetVariantStockAndLedger")]
        public async Task<ActionResult<VariantStockLedgerResponse>> GetVariantStockAndLedger(
        int variantId,
        int page = 1,
        int pageSize = 50)
        {
            try
            {
                if (variantId <= 0)
                    return BadRequest(new { message = "Invalid VariantID." });

                var response = await this.Contract.GetVariantStockAndLedgerAsync(variantId, page, pageSize);

                if (response == null)
                    return NotFound(new { message = "No stock ledger found for the given VariantID." });

                return Ok(response);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("AdjustStock")]
        public async Task<IActionResult> AdjustStock([FromBody] UpdateVariantStockRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Invalid request." });

            var success = await inventoryModel.AdjustStockAsync(request);
            if (success)
                return Ok(new { message = "Stock adjusted successfully." });

            return BadRequest(new { message = "Failed to adjust stock." });
        }
    }
}
