using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities
{
    public class OrderHeader : EntityBase
    {

        public int UserId { get; set; }

        public int AddressId { get; set; }

        public DateTime? OrderDate { get; set; }

        public string OrderNumber { get; set; }

        public int StatusId { get; set; }

        public int? PromoId { get; set; }

        public decimal ProductTotal { get; set; }

        public decimal ProductTaxTotal { get; set; }

        public decimal ChargeTotal { get; set; }

        public decimal ChargeTaxTotal { get; set; }

        public decimal DiscountTotal { get; set; }

        public decimal GrandTotal { get; set; }

        public decimal NetPayable { get; set; }

        public bool? DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}
