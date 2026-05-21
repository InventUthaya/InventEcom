
namespace DofyEcom.ViewEntities
{
    public class FilterViewModel
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public decimal Price { get; set; }

        public decimal? OldPrice { get; set; }

        public string? BrandName { get; set; }

        public string FullDescription { get; set; }

        public int DiscountPricePercentage { get; set; }

        public string SpecificationAttributeName { get; set; }

        public string? EncryptedProductId { get; set; }
        public string? ImagePath { get; set; }

        public string? PartnerCompanyName { get; set; }

        public decimal? TaxRate { get; set; }
        
        public bool? IsInclusive { get; set; }
    }
}
