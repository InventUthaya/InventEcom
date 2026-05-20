using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts.Requests
{
    public class CreateOrderRequest
    {
        public int UserID { get; set; }
        public int? AddressID { get; set; } = null;
        public OrderAddress? OrderAddress { get; set; } = null;
        public List<ProductQuantity> ProductQuantity { get; set; }
        public string PaymentMethod { get; set; }
        public string SKUIds { get; set; }
        public string? PromoCode { get; set; }
    }

    public class ProductQuantity
    {
        public int SkuId { get; set; }
        public int Quantity { get; set; }
    }
}
