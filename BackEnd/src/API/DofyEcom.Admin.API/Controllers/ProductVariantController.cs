using Microsoft.AspNetCore.Mvc;
using DofyEcom.Model;
using DofyEcom.ViewEntities;
using System.Collections.Generic;
using System.Linq;
using DofyEcom.Contracts;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantController : BaseController<IProductVariantModel, ViewEntities.ProductVariant>
    {
        // In real app, inject DbContext or Service via constructor
        private static List<ProductVariant> _variants = new List<ProductVariant>();
        private static int _nextId = 1;


        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IProductVariantModel productVariantModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public ProductVariantController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IProductVariantModel productVariantModel, CountryContext requestContext)
            : base(productVariantModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.productVariantModel = productVariantModel;
            this.requestContext = requestContext;
        }

        [HttpPost]
        [Route("CreateVariant")]
        public async Task<ActionResult<int>> CreateVariant([FromBody] ViewEntities.ProductVariant request)
        {
            try
            {
                if (request == null || request.ProductId == 0)
                    return BadRequest(new { message = "Invalid Variant data." });

                var variantId = this.Contract.CreateVariant(request);

                return Ok(new { VariantId = variantId, Message = "Variant Created Successfully" });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("StockAdjust")]
        public async Task<IActionResult> StockAdjust([FromBody] AdjustVariantStockRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Invalid request." });


            var success = await this.Contract.StockAdjustAsync(request);
            if (success)
                return Ok(new { message = "Stock adjusted successfully." });

            return BadRequest(new { message = "Failed to adjust stock." });
        }

        // GET: api/ProductVariant
        [HttpGet]
        public ActionResult<IEnumerable<ProductVariant>> GetAll()
        {
            return Ok(_variants);
        }

        // GET: api/ProductVariant/5
        [HttpGet("{id}")]
        public ActionResult<ProductVariant> GetById(int id)
        {
            var variant = _variants.FirstOrDefault(v => v.Id == id);
            if (variant == null) return NotFound();
            return Ok(variant);
        }
    }
}
