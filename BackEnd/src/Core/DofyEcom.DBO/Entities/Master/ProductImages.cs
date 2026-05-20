
namespace DofyEcom.DBO
{
    public class ProductImages : EntityBase
    {
        public int ProductId { get; set; }
        public int ColorId { get; set; }
        public string ImagePath { get; set; }
        public int? PartnerId { get; set; }
    }
}
