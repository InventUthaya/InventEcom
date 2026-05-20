

using DofyEcom.Helper.Attributes;
using Microsoft.AspNetCore.Http;

namespace DofyEcom.ViewEntities
{
    public class ProductImages : EntityBase
    {
        public int ProductId { get; set; }
        public int ColorId { get; set; }
        public string ImagePath { get; set; }
        public int? PartnerId { get; set; }
    }
}
