using System;
using System.Collections.Generic;

namespace DofyEcom.ViewEntities.ViewModel
{
    public class PromoSaveRequest
    {
        public int PromoID { get; set; }
        public string PromoCode { get; set; }
        public string Description { get; set; }
        public string DiscountType { get; set; }
        public decimal? Value { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int? PerUserLimit { get; set; }
        public int UsedCount { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? Created { get; set; }
        public int? PartnerId { get; set; }

        //public List<int> SkuIds { get; set; } = new();
    }


    public class PromoStatusRequest
    {
        public int Id { get; set; }
        public bool Active { get; set; }
    }
}
