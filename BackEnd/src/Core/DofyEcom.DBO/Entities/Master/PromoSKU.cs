namespace DofyEcom.DBO
{
    public class PromoSKU : EntityBase
    {
        public int PromoId { get; set; }
        public int SkuId { get; set; }
        public int? PartnerId { get; set; }
    }
}
