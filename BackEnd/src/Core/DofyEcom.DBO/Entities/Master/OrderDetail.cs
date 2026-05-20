using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class OrderDetail : EntityBase
    {
        public long OrderId { get; set; }
        public long SkuId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public long? DiscountId { get; set; }
        public long? PromoId { get; set; }
        public bool IsFreeItem { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }

    }
}
