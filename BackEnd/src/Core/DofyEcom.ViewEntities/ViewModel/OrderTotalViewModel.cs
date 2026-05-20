namespace DofyEcom.ViewEntities
{
    public class OrderTotalViewModel
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string Sku { get; set; }

        public string Gtin { get; set; }

        public string ManufacturerPartNumber { get; set; }

        public decimal Price { get; set; }

        public decimal NLCPrice { get; set; }

        public decimal MarginPrice { get; set; }

        public decimal BasePriceAmount { get; set; }

        public decimal BasePriceBaseAmount { get; set; }

        public int StockQuantity { get; set; }

        public bool AllowOutOfStockOrders { get; set; }

        public bool IsActive { get; set; }

    }
}
