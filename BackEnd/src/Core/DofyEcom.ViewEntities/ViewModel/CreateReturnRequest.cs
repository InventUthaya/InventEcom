namespace DofyEcom.ViewEntities
{
    public class CreateReturnRequest
    {
        public int OrderId { get; set; }
        public int OrderDetailId { get; set; }
        public int SkuId { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public decimal? RefundAmount { get; set; }
        public int PartnerId { get; set; }
        public bool IsReturn { get; set; }
    }
}