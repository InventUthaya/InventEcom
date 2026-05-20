using System;

namespace DofyEcom.ViewEntities
{
    public class ReturnRequest
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public string CustomerName { get; set; }
        public string ProductName { get; set; } 
        public string Reason { get; set; }
        public decimal RefundAmount { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }
        public int OrderId { get; set; }
        public int OrderDetailId { get; set; }
        public int SkuId { get; set; }
        public int UserId { get; set; }
        public int? RefundPaymentId { get; set; }
        public int? PartnerId { get; set; }
    }
}
