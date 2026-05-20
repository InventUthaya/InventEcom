namespace DofyEcom.ViewEntities.ViewModel
{
    public class LatestOrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AddressId { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderNumber { get; set; }
        public int StatusId { get; set; }
        public decimal ProductTotal { get; set; }
        public decimal ProductTaxTotal { get; set; }
        public decimal ChargeTotal { get; set; }
        public decimal ChargeTaxTotal { get; set; }
        public decimal DiscountTotal { get; set; }
        public decimal GrandTotal { get; set; }
        public decimal NetPayable { get; set; }

        public int OrderDetailId { get; set; }
        public int SkuId { get; set; }
        public string SkuCode { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public int Quantity { get; set; }
    }


}
