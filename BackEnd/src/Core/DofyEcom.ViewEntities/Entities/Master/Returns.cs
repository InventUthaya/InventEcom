using System;

namespace DofyEcom.ViewEntities
{
    // For returning data to user/admin
    public class Returns : EntityBase

    {
        public int OrderId { get; set; }
        public int OrderDetailId { get; set; }
        public int SkuId { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; }
        public int StatusId { get; set; }
        public decimal? RefundAmount { get; set; }
        public int? RefundPaymentId { get; set; }
        public bool DisplayInList { get; set; }
    }
    
    // For updating return status (admin input)
    public class ReturnUpdateModel
    {
        public int StatusID { get; set; }
        public decimal? RefundAmount { get; set; }
        public int? RefundPaymentID { get; set; }
    }
}
