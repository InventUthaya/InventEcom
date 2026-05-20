using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities.ViewModel
{
    public class UpdateProductViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public decimal BasePrice { get; set; }
        public decimal? CurrentPrice { get; set; }
        public int? TotalStock { get; set; }
        public int StatusId { get; set; }
        public string Specifications { get; set; }
        public int VariantId { get; set; }
    }
}
