using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts.Interfaces.Admin
{
    public interface ISalesReportModel : IEntityModel<SalesReport>
    {
        Task<IEnumerable<SalesReport>> GetSalesReportAsync(DateTime fromDate, DateTime toDate);

        Task<byte[]> ExportSalesReportCsvAsync(DateTime fromDate, DateTime toDate);

        //Task<byte[]> ExportSalesReportXlsxAsync(DateTime fromDate, DateTime toDate);
    }
}
