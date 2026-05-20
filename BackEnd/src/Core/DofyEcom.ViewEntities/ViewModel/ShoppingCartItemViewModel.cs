namespace DofyEcom.ViewEntities
{
    public class ShoppingCartItemViewModel : EntityBase
    {
        public int CartId { get; set; }
        public int UserId { get; set; }
        public int SkuId { get; set; }
        public int CartQuantity { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
        public string BrandName { get; set; }
        public string? ImagesPath { get; set; }

        // Variant details
        public int VariantId { get; set; }
        public string GradeName { get; set; }
        public string ColorName { get; set; }
        public string RamSize { get; set; }
        public string StorageSize { get; set; }

        // Pricing and stock
        public decimal MRP { get; set; }
        public decimal SellingPrice { get; set; }
        public int StockQty { get; set; }
        public string? ImagePath { get; set; }

        // Status
        public int StatusId { get; set; }
        public string StatusName { get; set; }

        // Calculated totals
        public decimal TotalPrice { get; set; }
        public decimal TotalMRP { get; set; }
        public string StockStatus { get; set; }
        public DateTime? Created { get; set; }

        public string? EncryptedShoppingCartId { get; set; }
        public string? EncryptProductId { get; set; }

        public string? ImageBase64 { get; set; }

        public int TaxID { get; set; }
        public decimal TaxRate { get; set; }
        public bool IsInclusive { get; set; }
        public decimal TaxAmount { get; set; }
        public string? PartnerCompanyName { get; set; }

    }
}
