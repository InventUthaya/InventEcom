
namespace DofyEcom.ViewEntities
{
    public class ProductReview : EntityBase
    {
        public int UserId { get; set; }

        public int SkuId { get; set; }

        public int Rating { get; set; }

        public string ReviewText { get; set; }

        public DateTime ReviewDate { get; set; }
        public string ImagePath { get; set; }
        public string ReviewDescription { get; set; }
        public int? PartnerId { get; set; }
    }
}
