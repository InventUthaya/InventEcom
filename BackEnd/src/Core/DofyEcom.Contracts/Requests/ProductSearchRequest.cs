using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public class ProductSearchRequest: SearchBaseCriteria
    {
        public string? SearchText { get; set; }
        public int? CategoryId { get; set; }
        public int? BrandId { get; set; }
        public int? GradeId { get; set; }
        public int? RamId { get; set; }
        public int? StorageId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string SortBy { get; set; } = "price_asc";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;

        public int? Active { get; set; } = null;
        public int UserId { get; set; }
    }
}
