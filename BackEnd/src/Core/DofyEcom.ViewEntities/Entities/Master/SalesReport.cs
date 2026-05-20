using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities
{
    public class SalesReport : EntityBase
    {
        public DateTime SaleDate { get; set; }

        public int OrdersCount { get; set; }

        public decimal ProductSales { get; set; }

        public decimal ProductTax { get; set; }

        public decimal Charges { get; set; }

        public decimal Discounts { get; set; }

        public decimal NetSales { get; set; }

    }
}
