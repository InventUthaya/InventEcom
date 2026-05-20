namespace DofyEcom.DBO
{
    public class DiscountMaster : EntityBase
    {

        public string DiscountName { get; set; }

        public string DiscountType { get; set; }

        public decimal? DiscountValue { get; set; }

        public decimal? MinOrderAmount { get; set; }

        public decimal? MaxDiscountAmount { get; set; }

        public bool? IsPromoCode { get; set; }

        public string? PromoCode { get; set; }

        public DateTime? ValidFrom { get; set; }

        public DateTime? ValidTo { get; set; }

        public string AppliesTo { get; set; }

        public int? ProductId { get; set; }

        public int? SkuId { get; set; }

        public int? UserId { get; set; }

        public int? RoleId { get; set; }

        public bool? IsFirstOrderOnly { get; set; }

        public bool? IsBOGO { get; set; }

        public int? Priority { get; set; }


        public bool? DisplayInList { get; set; }

        public int? PartnerId { get; set; }

    }
}
