

namespace DofyEcom.ViewEntities
{
    public class Sku : EntityBase
    {
        public int ProductId { get; set; }

        public int VariantId { get; set; }

        public string SkuCode { get; set; }

        public string Barcode { get; set; }

        public string? ImagePath { get; set; }

        public decimal MRP { get; set; }

        public decimal SellingPrice { get; set; }

        public int? StockQty { get; set; }

        public int StatusId { get; set; }

        public bool? DisplayInList { get; set; }
        public int? PartnerId { get; set; }

    }
}
