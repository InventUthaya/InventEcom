using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;

namespace DofyEcom.Contracts.Requests
{
    public class CreateProductRequest
    {
        public ViewEntities.ProductMaster product { get; set; }
        public List<ViewEntities.ProductSpecification> specification { get; set; }
        public List<ViewEntities.ProductBoxItem>? productBoxItem { get; set; }
        public List<ViewEntities.ProductVariant> variants { get; set; }
        public ViewEntities.Sku sku { get; set; }
        public int PersonId { get; set; }

        // NEW: Images grouped by color
        public List<ColorImageGroup>? ColorImages { get; set; }
    }

    public class ColorImageGroup
    {
        public int? ProductImageId { get; set; }
        public int ColorId { get; set; }
        public List<IFormFile>? ImageFile { get; set; }
    }
}
