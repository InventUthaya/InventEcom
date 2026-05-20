using System.Runtime.Intrinsics.X86;
using DofyEcom.Helper.Attributes;
using DofyEcom.ViewEntities;

namespace DofyEcom.ViewEntities
{
    public class ProductCategory : EntityBase
    {
        [DBIgnore]
        public long ProductId { get; set; }
        public long CategoryId { get; set; }
        public long BrandId { get; set; }
        public bool IsActive { get; set; }
        public int? PartnerId { get; set; }
    }
}
