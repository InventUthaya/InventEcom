using System;

namespace DofyEcom.ViewEntities
{
    public class Cart : EntityBase
    {
        public int UserId { get; set; }
        public int SkuId { get; set; }
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
    public class CartItemRequest
    {
        //public int?VariantId { get; set; }
        public int Quantity { get; set; }
    }

}
