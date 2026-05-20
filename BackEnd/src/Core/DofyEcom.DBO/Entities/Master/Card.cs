

namespace DofyEcom.DBO
{
    public class Cart : EntityBase
    {
        public int UserId { get; set; }
        public int SkuId { get; set; }
        public int Quantity { get; set; }
        public bool DisplayInList { get; set; }
        //public int?VariantId { get; set; }
        public int? PartnerId { get; set; }
    }
}
