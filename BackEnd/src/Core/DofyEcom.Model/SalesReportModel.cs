using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class SalesReportModel : BaseModel<DBO.SalesReport>, ISalesReportModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public SalesReportModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper,
            IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal,
                   GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration),
                   requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public SalesReport Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<SalesReport> GetList()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<SalesReport>> GetSalesReportAsync(DateTime fromDate, DateTime toDate)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@FromDate", fromDate, DbType.DateTime);
                parameters.Add("@ToDate", toDate, DbType.DateTime);

                var result = this.ExecStoredProcedure<SalesReport>(
                    "SP_SalesReport",
                    parameters
                );

                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while fetching the sales report.", ex);
            }
        }

        public async Task<byte[]> ExportSalesReportCsvAsync(DateTime fromDate, DateTime toDate)
        {
            var reports = await GetSalesReportAsync(fromDate, toDate);

            var sb = new StringBuilder();
            sb.AppendLine("SaleDate,OrdersCount,ProductSales,ProductTax,Charges,Discounts,NetSales");

            foreach (var r in reports)
            {
                sb.AppendLine($"{r.SaleDate:yyyy-MM-dd},{r.OrdersCount},{r.ProductSales},{r.ProductTax},{r.Charges},{r.Discounts},{r.NetSales}");
            }

            return Encoding.UTF8.GetBytes(sb.ToString());
        }

        //public async Task<byte[]> ExportSalesReportXlsxAsync(DateTime fromDate, DateTime toDate)
        //{
        //    var reports = await GetSalesReportAsync(fromDate, toDate);

        //    using (var wb = new XLWorkbook())
        //    {
        //        var ws = wb.Worksheets.Add("SalesReport");

        //        // Headers
        //        ws.Cell(1, 1).Value = "SaleDate";
        //        ws.Cell(1, 2).Value = "OrdersCount";
        //        ws.Cell(1, 3).Value = "ProductSales";
        //        ws.Cell(1, 4).Value = "ProductTax";
        //        ws.Cell(1, 5).Value = "Charges";
        //        ws.Cell(1, 6).Value = "Discounts";
        //        ws.Cell(1, 7).Value = "NetSales";

        //        int row = 2;
        //        foreach (var r in reports)
        //        {
        //            ws.Cell(row, 1).Value = r.SaleDate;
        //            ws.Cell(row, 2).Value = r.OrdersCount;
        //            ws.Cell(row, 3).Value = r.ProductSales;
        //            ws.Cell(row, 4).Value = r.ProductTax;
        //            ws.Cell(row, 5).Value = r.Charges;
        //            ws.Cell(row, 6).Value = r.Discounts;
        //            ws.Cell(row, 7).Value = r.NetSales;
        //            row++;
        //        }

        //        using (var ms = new MemoryStream())
        //        {
        //            wb.SaveAs(ms);
        //            return ms.ToArray();
        //        }
        //    }
        //}

        public long Post(SalesReport item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(SalesReport item)
        {
            throw new NotImplementedException();
        }

        public long Put(SalesReport item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(SalesReport item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
