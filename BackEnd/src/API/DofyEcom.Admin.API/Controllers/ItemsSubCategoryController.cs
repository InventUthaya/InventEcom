using DofyEcom.Contracts;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/itemssubcategory")]
    [ApiController]
    public class ItemsSubCategoryController : BaseController<IItemsCategoryMasterModel, ViewEntities.ItemsCategoryMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IItemsCategoryMasterModel itemsCategorymodel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public ItemsSubCategoryController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IItemsCategoryMasterModel itemsCategorymodel, CountryContext requestContext)
            : base(itemsCategorymodel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.itemsCategorymodel = itemsCategorymodel;
            this.requestContext = requestContext;
        }


        [HttpGet]
        [Route("getall")]
        public async Task<IEnumerable<ViewEntities.ItemsCategoryMaster>> GetAll()
        {
            var pagedResult = await Task.Run(() =>
            {
                var result = this.Contract.GetList();

                return result;
            });

            return pagedResult;
        }


        [HttpPost]
        [Route("GetList")]
        public async Task<ActionResult<IEnumerable<ItemSubCategoryView>>> GetList([FromBody] CategoryMasterSearch request)
        {
            try
            {
                var result = await this.Contract.GetList(request);

                return Ok(result ?? new List<ItemSubCategoryView>());
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while fetching partner payment data.",
                    details = ex.Message
                });
            }
        }


        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromBody] ViewEntities.ItemsCategoryMaster request)
        {
            if (request == null)
                return BadRequest(new { message = "Invalid request data." });

            try
            {
                var id = await Task.Run(() => this.Contract.Post(request));

                return Ok(new
                {
                    Success = true,
                    Id = id,
                    Message = "Category created successfully"
                });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while creating category.",
                    details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("Update")]
        public async Task<IActionResult> Update([FromBody] ViewEntities.ItemsCategoryMaster request)
        {
            if (request == null)
                return BadRequest(new { message = "Invalid request data." });

            try
            {
                var id = await Task.Run(() => this.Contract.Put(request));

                return Ok(new
                {
                    Success = true,
                    Id = id,
                    Message = "Category created successfully"
                });
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while creating category.",
                    details = ex.Message
                });
            }
        }

    }
}

