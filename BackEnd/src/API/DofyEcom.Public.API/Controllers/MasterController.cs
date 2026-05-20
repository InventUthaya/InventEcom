using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Helper;
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
        private readonly Model.RamMasterModel ramMasterModel;
        private readonly Model.StorageMasterModel storageMasterModel;
        private readonly Model.TaxMasterModel taxMasterModel;

        public MasterController(
            IOptionsSnapshot<AppConfiguration> iAppConfiguration,
            IMapper iMapper,
            CountryContext requestContext,
            //Model.CategoryMasterModel categoryMasterModel,
            Model.BrandMasterModel brandMasterModel,
            //Model.GradeMasterModel gradeMasterModel,
            //Model.ColorMasterModel colorMasterModel,
            //Model.RamMasterModel ramMasterModel,
            Model.StorageMasterModel storageMasterModel)
            //Model.TaxMasterModel taxMasterModel)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.requestContext = requestContext;
            //this.categoryMasterModel = categoryMasterModel;
            this.brandMasterModel = brandMasterModel;
            //this.gradeMasterModel = gradeMasterModel;
            //this.colorMasterModel = colorMasterModel;
            //this.ramMasterModel = ramMasterModel;
            this.storageMasterModel = storageMasterModel;
            //this.taxMasterModel = taxMasterModel;
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


        [HttpGet("qualityList")]
        public IActionResult GetQualityList()
        {
            try
            {
                var quality = storageMasterModel.GetList();
                return Ok(quality);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving brands: {ex.Message}");
            }
        }

        //     [HttpGet]
        //[Route("GetAllDeliveryTime")]
        //public async Task<IEnumerable<DeliveryTime>> GetAllDeliveryTime()
        //{
        //    var result = await Task.Run(() =>
        //    {
        //        return this.Contract.GetAllDeliveryTime();
        //    });

        //    return result;
        //}

        //[HttpGet]
        //[Route("GetAllCancellationType")]
        //public async Task<IEnumerable<CancellationType>> GetAllCancellationTypeList()
        //{
        //    var result = await Task.Run(() =>
        //    {
        //        return this.Contract.GetCancellationTypeList();
        //    });

        //    return result;
        //}

        //[HttpPost]
        //[Route("GetBannerList")]
        //public async Task<Dictionary<string, List<BannerViewModel>>> GetBannerList()
        //{

        //    var result = await Task.Run(() =>
        //    {
        //        return this.Contract.GetBannerList();
        //    });

        //    return result;
        //}
    }
}