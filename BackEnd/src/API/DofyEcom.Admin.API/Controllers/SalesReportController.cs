using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.Model;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Admin.API.Controllers
{
    [Route("api/sales-report")]
    [ApiController]
    public class SalesReportController : BaseController<ISalesReportModel, SalesReport>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly ISalesReportModel salesReportModel;
        private readonly CountryContext requestContext;
        private readonly IMapper mapper;

        public SalesReportController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            ISalesReportModel salesReportModel, CountryContext requestContext)
            : base(salesReportModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.salesReportModel = salesReportModel;
            this.requestContext = requestContext;
        }

        // GET: api/sales-report?fromDate=2025-09-01&toDate=2025-09-14
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesReport>>> GetSalesReport(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            try
            {
                if (fromDate == default || toDate == default)
                    return BadRequest(new { message = "Please provide valid FromDate and ToDate." });

                var report = await this.Contract.GetSalesReportAsync(fromDate, toDate);

                if (report == null)
                    return NotFound(new { message = "No sales data found for the given date range." });

                return Ok(report);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Unexpected error: {ex.Message}" });
            }
        }

        [HttpGet("ExportCsv")]
        public async Task<IActionResult> ExportCsv([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            var bytes = await salesReportModel.ExportSalesReportCsvAsync(fromDate, toDate);
            return File(bytes, "text/csv", $"SalesReport_{fromDate:yyyyMMdd}_{toDate:yyyyMMdd}.csv");
        }

        //[HttpGet("ExportXlsx")]
        //public async Task<IActionResult> ExportXlsx([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        //{
        //    var bytes = await salesReportModel.ExportSalesReportXlsxAsync(fromDate, toDate);
        //    return File(bytes,
        //        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //        $"SalesReport_{fromDate:yyyyMMdd}_{toDate:yyyyMMdd}.xlsx");
        //}
    }
}
