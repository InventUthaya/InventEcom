using DofyEcom.Contracts;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/master")]
    [ApiController]
    public class MasterController : ControllerBase
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IMapper mapper;
        private readonly CountryContext requestContext;
        private readonly Model.CategoryMasterModel categoryMasterModel;
        private readonly Model.BrandMasterModel brandMasterModel;
        private readonly Model.GradeMasterModel gradeMasterModel;
        private readonly Model.ColorMasterModel colorMasterModel;
        private readonly Model.StatusMasterModel statusModel;
        private readonly Model.RamMasterModel ramMasterModel;
        private readonly Model.StorageMasterModel storageMasterModel;
        private readonly Model.TaxMasterModel taxMasterModel;

        public MasterController(
            IOptionsSnapshot<AppConfiguration> iAppConfiguration,
            IMapper iMapper,
            CountryContext requestContext,
            Model.CategoryMasterModel categoryMasterModel,
            Model.BrandMasterModel brandMasterModel,
            Model.GradeMasterModel gradeMasterModel,
            Model.ColorMasterModel colorMasterModel,
            Model.StatusMasterModel statusModel,
            Model.RamMasterModel ramMasterModel,
            Model.StorageMasterModel storageMasterModel,
            Model.TaxMasterModel taxMasterModel)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.requestContext = requestContext;
            this.categoryMasterModel = categoryMasterModel;
            this.brandMasterModel = brandMasterModel;
            this.gradeMasterModel = gradeMasterModel;
            this.statusModel = statusModel;
            this.colorMasterModel = colorMasterModel;
            this.ramMasterModel = ramMasterModel;
            this.storageMasterModel = storageMasterModel;
            this.taxMasterModel = taxMasterModel;
        }

        [HttpGet("categorylist")]
        public IActionResult GetCategoryList()
        {
            try
            {
                var categories = categoryMasterModel.GetList();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving categories: {ex.Message}");
            }
        }

        [HttpGet("brandlist")]
        public IActionResult GetBrandList()
        {
            try
            {
                var brands = brandMasterModel.GetList();
                return Ok(brands);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving brands: {ex.Message}");
            }
        }

        [HttpGet("gradelist")]
        public IActionResult GetGradeList()
        {
            try
            {
                var grades = gradeMasterModel.GetList();
                return Ok(grades);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving grades: {ex.Message}");
            }
        }

        [HttpGet("colorlist")]
        public IActionResult GetColorList()
        {
            try
            {
                var colors = colorMasterModel.GetList();
                return Ok(colors);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving colors: {ex.Message}");
            }
        }

        [HttpGet("ramlist")]
        public IActionResult GetRamList()
        {
            try
            {
                var rams = ramMasterModel.GetList();
                return Ok(rams);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving RAM sizes: {ex.Message}");
            }
        }

        [HttpGet("storagelist")]
        public IActionResult GetStorageList()
        {
            try
            {
                var storages = storageMasterModel.GetList();
                return Ok(storages);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving storage sizes: {ex.Message}");
            }
        }

        [HttpGet("taxlist")]
        public IActionResult GetTaxList()
        {
            try
            {
                var storages = taxMasterModel.GetList();
                return Ok(storages);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving tax sizes: {ex.Message}");
            }
        }

        [HttpGet("statuslist")]
        public IActionResult GetStatus()
        {
            try
            {
                var storages = statusModel.GetList();
                return Ok(storages);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving tax sizes: {ex.Message}");
            }
        }
    }
}