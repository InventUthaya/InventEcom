using DofyEcom.Contracts;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/BrandMaster")]
    [ApiController]
    public class BrandMasterController : BaseController<IBrandMasterModel, ViewEntities.BrandMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IBrandMasterModel brandModel;
        private readonly CountryContext requestContext;
        private readonly IMapper mapper;

        public BrandMasterController(
            IOptionsSnapshot<AppConfiguration> iAppConfiguration, 
            IMapper iMapper,
            IBrandMasterModel brandModel, 
            CountryContext requestContext)
            : base(brandModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.brandModel = brandModel;
            this.requestContext = requestContext;
        }

        [HttpPost]
        [Route("GetAll")]
        public async Task<ActionResult<IEnumerable<BrandMasterResponse>>> GetAll([FromBody] BrandMasterSearch request)
        {
            try
            {
                var result = await this.Contract.GetAll(request);

                return Ok(result ?? new List<BrandMasterResponse>());
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while fetching brand data.",
                    details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromBody] ViewEntities.BrandMaster request)
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
                    Message = "Brand created successfully"
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
                    message = "An unexpected error occurred while creating brand.",
                    details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("Update")]
        public async Task<IActionResult> Update([FromBody] ViewEntities.BrandMaster request)
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
                    Message = "Brand updated successfully"
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
                    message = "An unexpected error occurred while updating brand.",
                    details = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("getall")]
        public async Task<IEnumerable<ViewEntities.BrandMaster>> GetAll()
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
