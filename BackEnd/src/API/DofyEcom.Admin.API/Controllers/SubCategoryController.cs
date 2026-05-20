using DofyEcom.Contracts;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/Subcategory")]
    [ApiController]
    public class SubCategoryController : BaseController<ISubCategoryMasterModel, ViewEntities.SubCategoryMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly ISubCategoryMasterModel subCategorymodel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public SubCategoryController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            ISubCategoryMasterModel subCategorymodel, CountryContext requestContext)
            : base(subCategorymodel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.subCategorymodel = subCategorymodel;
            this.requestContext = requestContext;
        }


        [HttpGet]
        [Route("getall")]
        public async Task<IEnumerable<ViewEntities.SubCategoryMaster>> GetAll()
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
        public async Task<ActionResult<IEnumerable<SubCategoryView>>> GetList([FromBody] CategoryMasterSearch request)
        {
            try
            {
                var result = await this.Contract.GetList(request);

                return Ok(result ?? new List<SubCategoryView>());
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
        public async Task<IActionResult> Create([FromBody] ViewEntities.SubCategoryMaster request)
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
        public async Task<IActionResult> Update([FromBody] ViewEntities.SubCategoryMaster request)
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

