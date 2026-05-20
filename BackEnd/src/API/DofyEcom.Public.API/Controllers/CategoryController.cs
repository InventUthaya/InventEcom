using System.Diagnostics.Contracts;
using System.Security.Claims;
using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Public.API.Controllers
{
    [Route("api/Category")]
    [ApiController]
    public class CategoryController : BaseController<ICategoryMasterModel, CategoryMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly ICategoryMasterModel categoryMasterModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public CategoryController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            ICategoryMasterModel categoryMasterModel, CountryContext requestContext)
            : base(categoryMasterModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.categoryMasterModel = categoryMasterModel;
            this.requestContext = requestContext;
        }

        //[HttpGet("GetParentCategoryList")]
        //[AllowAnonymous]
        //public ActionResult<IEnumerable<ViewEntities.ProductMaster>> GetParentCategoryList(string parentId)
        //{
        //    if (string.IsNullOrWhiteSpace(parentId))
        //        return BadRequest("parentId is required.");

        //    long productId;
        //    try
        //    {
        //        var decryptedValue = DecryptString(parentId);
        //        productId = Convert.ToInt64(decryptedValue);
        //    }
        //    catch
        //    {
        //        return BadRequest("Invalid parentId.");
        //    }

        //    var result = this.Contract.GetParentCategoryList(productId);
        //    return Ok(result);
        //}



        //[HttpPost("GetCategoryByProductId")]
        //[AllowAnonymous]
        //public ActionResult<IEnumerable<ViewEntities.ProductMaster>> GetCategoryByProductId([FromBody] ProductMaster request)
        //{
        //    if (request == null)
        //        return BadRequest("Request body is required.");

        //    var result = categoryMasterModel.GetCategoryByProductId(request.CategoryId, request.BrandId);
        //    return Ok(result);
        //}

        [HttpGet]
        [Route("GetCategoryList")]
        public async Task<IEnumerable<CategoryMaster>> GetCategoryList()
        {
            var result = await Task.Run(() =>
            {
                return this.Contract.GetList();
            });

            return result;
        }

        [HttpGet]
        [Route("GetBrandsByCategory/{categoryId}")]
        public IActionResult GetBrandsByCategory(int categoryId)
        {
            var brands = this.Contract.GetBrandsByCategory(categoryId);
            return Ok(brands);
        }

    }

}

