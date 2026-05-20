using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using iText.Html2pdf.Attach;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Public.API.Controllers;

    [Route("api/DofyGeo")]
    [ApiController]
    public class DofyGeoController : BaseController<IDofyGeoModel,ViewEntities.DofyGeo>
    {
        private readonly IDofyGeoModel dofyGeoModel;

        public DofyGeoController(
            IOptionsSnapshot<AppConfiguration> appConfig,
            IMapper mapper,
            IDofyGeoModel dofyGeoModel,
            CountryContext requestContext)
            : base(dofyGeoModel, appConfig, requestContext: requestContext)
        {
            this.dofyGeoModel = dofyGeoModel;
        }

    [HttpGet]
    [Route("GetPincodeAvailability")]
    public async Task<IEnumerable<DofyGeo>> GetPincodeAvailability(string pincode)
    {
        var result = await Task.Run(() =>
        {
            return this.Contract.GetPincodeAvailability(pincode);
        });

        return result;
    }

    //[HttpGet]
    //[Route("getImageSlider")]
    //public DOFY.Helper.CdnImages getImageSlider()
    //{
    //    {
    //        return this.Contract.getImageSlider();
    //    }

    //}

    [HttpGet]
    [Route("GetDOFYGeoList")]
    public async Task<IEnumerable<DofyGeo>> GetDOFYGeoList()
    {
        var result = await Task.Run(() =>
        {
            return this.Contract.GetList();
        });

        return result;
    }

    [HttpGet]
    [Route("GetDofyGeoListBysearch")]
    public async Task<IEnumerable<DofyGeo>> GetDofyGeoListBysearch(string searchText)
    {
        var result = await Task.Run(() =>
        {
            return this.Contract.GetDofyGeoListBysearch(searchText);
        });

        return result;
    }

    //[HttpPost]
    //[Route("GetDofyGeoListBySearchText")]
    //public async Task<PagedList<DofyGeo>> GetDofyGeoListBySearchText(string searchText, int? parent)
    //{
    //    var result = await Task.Run(() =>
    //    {
    //        return this.Contract.GetDofyGeoListBySearchText(searchText, parent);
    //    });

    //    return result;
    //}

    //[HttpPost]
    //[Route("GetDofyGeoListBySearchText")]
    //public async Task<PagedList<DofyGeo>> GetDofyGeoListBySearchText(string searchText, string? parent)
    //{
    //    int? EncryptedParent = null;

    //    if (!string.IsNullOrEmpty(parent))
    //    {
    //        EncryptedParent = (int)Convert.ToInt64(DecryptAES(parent.ToString()));
    //    }

    //    var result = await Task.Run(() =>
    //    {
    //        return this.Contract.GetDofyGeoListBySearchText(searchText, EncryptedParent);
    //    });

    //    return result;
    //}


    [HttpPost("GetDofyGeoListBySearchText")]
    public async Task<IActionResult> GetDofyGeoListBySearchText(
           [FromQuery] string searchText,
           [FromQuery] string parent)
    {
        try
        {

            int? EncryptedParent = null;

            if (!string.IsNullOrEmpty(parent))
            {
                EncryptedParent = (int)Convert.ToInt64(DecryptAES(parent));
            }

            var result = await Task.Run(() =>
            {
                return this.Contract.GetDofyGeoListBySearchTextAsync(searchText, EncryptedParent);
            });

            //var result = await dofyGeoModel.GetDofyGeoListBySearchTextAsync(searchText, parent);

            if (result == null || !result.Any())
                return NotFound(new { message = "No matching villages found." });

            return Ok(result);
        }
        catch (ApplicationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "An unexpected error occurred while fetching geo records.",
                details = ex.Message
            });
        }
    }

    [HttpGet]
    [Route("GetStateList")]
    public async Task<IEnumerable<DofyGeo>> GetStateList(long serviceTypeId)
    {
        var result = await Task.Run(() =>
        {
            return this.Contract.GetStateList(serviceTypeId);
        });

        return result;
    }

    [HttpGet]
    [Route("GetCityList")]
    public async Task<IEnumerable<DofyGeo>> GetCityList([FromQuery]long serviceTypeId, long StateId)
    {
        var result = await Task.Run(() =>
        {
            return this.Contract.GetCityList(serviceTypeId, StateId);
        });

        return result;
    }


}
