using System;

namespace DofyEcom.DBO
{
    public class ReturnRequest : EntityBase
    {
        public int OrderId { get; set; }
        public int OrderDetailId { get; set; }
        public int SkuId { get; set; }
        public int UserId { get; set; }
        public string? Reason { get; set; }
        public int StatusId { get; set; }
        public decimal RefundAmount { get; set; }
        public int? RefundPaymentId { get; set; }
        public int? PartnerId { get; set; }
    }
}
