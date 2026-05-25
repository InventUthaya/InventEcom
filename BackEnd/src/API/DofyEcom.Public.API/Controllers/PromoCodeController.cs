using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Public.API.Controllers
{
    [Route("api/PromoCode")]
    [ApiController]
    public class PromoCodeController : BaseController<IPromoCodeModel, ViewEntities.PromoCode>
    {
        private readonly IPromoCodeModel promoModel;
        private readonly IMapper mapper;
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;

        public PromoCodeController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IPromoCodeModel promoModel, CountryContext requestContext)
            : base(promoModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.promoModel = promoModel;
        }

        [HttpPost("GetPromoList")]
        public async Task<IActionResult> GetPromoList([FromBody] PromoListCriteria request)
        {
            try
            {
                int page = request.pageIndex != null ? (int)request.pageIndex + 1 : 1;
                int pageSize = request.pageSize != null ? (int)request.pageSize : 20;
                string searchText = request.SearchText;
                string sortColumn = request.sortColumn ?? "Created";
                string sortOrder = request.sortOrder ?? "DESC";
                bool? isActive = null;
                if (request.IsActive != null)
                {
                    isActive = (bool)request.IsActive;
                }

                var (data, total) = await promoModel.GetPromoCodeListAsync(page, pageSize, searchText, sortColumn, sortOrder, isActive, request.PartnerId);

                // project to UI shape and alias Id to PromoID
                var payload = data.Select(d => new
                {
                    PromoID = d.Id,
                    PromoCode = d.Code,
                    d.Description,
                    d.DiscountType,
                    d.Value,
                    StartDate = d.StartDate,
                    EndDate = d.EndDate,
                    UsageLimit = d.UsageLimit,
                    PerUserLimit = d.PerUserLimit,
                    UsedCount = d.UsedCount,
                    IsActive = d.IsActive,
                    Created = d.Created
                });

                return Ok(new { status = 200, message = "Success", data = payload, total });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet]
        [Route("GetPromoDetailsById/{id}")]
        public async Task<IActionResult> GetPromoDetailsById(int id)
        {
            if (id <= 0) return BadRequest(new { message = "Invalid PromoId" });
            var item = await promoModel.GetPromoByIdAsync(id);
            if (item == null) return NotFound(new { message = "Promo not found" });

            var payload = new
            {
                PromoID = item.Id,
                PromoCode = item.Code,
                item.Description,
                item.DiscountType,
                item.Value,
                StartDate = item.StartDate,
                EndDate = item.EndDate,
                UsageLimit = item.UsageLimit,
                PerUserLimit = item.PerUserLimit,
                UsedCount = item.UsedCount,
                IsActive = item.IsActive,
                Created = item.Created
            };

            return Ok(new { status = 200, message = "Success", data = payload });
        }

        [HttpPost("CreateOrEditPromo")]
        public async Task<IActionResult> CreateOrEditPromo([FromBody] PromoSaveRequest req)
        {
            try
            {
                // map incoming dynamic to PromoCode view entity
                var promo = new ViewEntities.PromoCode
                {
                    Id = req.PromoID == null ? 0 : Convert.ToInt32(req.PromoID),
                    Code = (string)req.PromoCode,
                    Description = (string)req.Description,
                    DiscountType = (string)req.DiscountType,
                    Value = req.Value != null ? (decimal?)req.Value : null,
                    StartDate = req.StartDate != null ? (System.DateTime?)req.StartDate : null,
                    EndDate = req.EndDate != null ? (System.DateTime?)req.EndDate : null,
                    UsageLimit = req.UsageLimit != null ? (int?)req.UsageLimit : null,
                    PerUserLimit = req.PerUserLimit != null ? (int?)req.PerUserLimit : null,
                    UsedCount = req.UsedCount != null ? (int)req.UsedCount : 0,
                    IsActive = req.IsActive != null ? (bool)req.IsActive : true,
                    Created = req.Created != null ? (System.DateTime)req.Created : System.DateTime.Now,
                    PartnerId = req.PartnerId
                };

                // optional sku list
                //IEnumerable<int> skuIds = null;
                //if (req.SkuIds != null)
                //{
                //    skuIds = ((IEnumerable<object>)req.SkuIds).Select(x => (int)x).ToList();
                //}

                var id = await promoModel.SavePromoAsync(promo, null);
                return Ok(new { status = 200, message = "Saved", data = id });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("TogglePromoStatus")]
        public async Task<IActionResult> TogglePromoStatus([FromBody] PromoStatusRequest req)
        {
            int id = (int)req.Id;
            bool active = (bool)req.Active;

            if (id <= 0) return BadRequest(new { message = "Invalid PromoId" });

            // If you prefer separate SP, implement Hide/Activate; here using HidePromoAsync for deactivate
            var success = true;
            if (!active)
                success = await promoModel.HidePromoAsync(id);
            else
            {
                // Activate: simple update SP or SavePromo with IsActive true — implement as needed
                var promo = await promoModel.GetPromoByIdAsync(id);
                if (promo != null)
                {
                    promo.IsActive = true;
                    await promoModel.SavePromoAsync(promo, null);
                }
            }

            return Ok(new { status = success ? 200 : 400, message = success ? "Updated" : "Failed" });
        }

        [HttpPost("GetAvailablePromoCode")]
        public async Task<ActionResult<ViewEntities.PromoCode>> GetAvailablePromoCode([FromQuery] int customerId, string promoCode)
        {
            var result = await this.Contract.GetAvailablePromoCode(customerId, promoCode);
            return Ok(result);
        }
    }
}
