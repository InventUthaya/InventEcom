using System;

namespace DofyEcom.ViewEntities
{
    public class PromoCode : EntityBase
    {
        public string Code { get; set; }    
        public string Description { get; set; }
        public string DiscountType { get; set; }
        public decimal? Value { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int? PerUserLimit { get; set; }
        public int UsedCount { get; set; }
        public int? PartnerId { get; set; }

        // convenience:
        public int RemainingUses => UsageLimit.HasValue ? (UsageLimit.Value - UsedCount) : -1;
    }
}
