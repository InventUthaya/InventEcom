using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/CategoryMaster")]
    [ApiController]
    public class CategoryMasterController : BaseController<ICategoryMasterModel, ViewEntities.CategoryMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly ICategoryMasterModel category;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public CategoryMasterController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            ICategoryMasterModel category, CountryContext requestContext)
            : base(category, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.category = category;
            this.requestContext = requestContext;
        }


        [HttpPost]
        [Route("GetAll")]
        public async Task<ActionResult<IEnumerable<CategoryMasterResponse>>> GetAll([FromBody] CategoryMasterSearch request)
        {
            try
            {
                var result = await this.Contract.GetAll(request);

                return Ok(result ?? new List<CategoryMasterResponse>());
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
        public async Task<IActionResult> Create([FromBody] ViewEntities.CategoryMaster request)
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
        public async Task<IActionResult> Update([FromBody] ViewEntities.CategoryMaster request)
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

        [HttpGet]
        [Route("getall")]
        public async Task<IEnumerable<ViewEntities.CategoryMaster>> GetAll()
        {
            var pagedResult = await Task.Run(() =>
            {
                var result = this.Contract.GetList();

                return result;
            });

            return pagedResult;
        }

    }

}


