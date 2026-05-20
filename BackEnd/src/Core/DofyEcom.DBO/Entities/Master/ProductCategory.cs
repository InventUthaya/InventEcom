using System.Runtime.Intrinsics.X86;

namespace DofyEcom.DBO
{
    public class ProductCategory: EntityBase
    {
        public long ProductId { get; set; }
        public long CategoryId { get; set; }
        public long BrandId { get; set; }
        public bool IsActive { get; set; }
        public int? PartnerId { get; set; }
    }
}
