using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities
{
    public class GetProductByPriceViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }
        public string FullDescription { get; set; }
        public int DiscountPricePercentage { get; set; }
        public string SpecificationAttributeName { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}
