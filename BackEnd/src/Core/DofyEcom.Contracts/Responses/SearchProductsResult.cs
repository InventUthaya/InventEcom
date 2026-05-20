using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.Contracts
{
    public class SearchProductsResult
    {
        public List<SearchProductResponse> Products { get; set; } = new List<SearchProductResponse>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalRecords { get; set; }
        public int TotalPages => PageSize > 0 ? (int)Math.Ceiling(TotalRecords / (double)PageSize) : 0;
        public bool HasPrevious => Page > 1;
        public bool HasNext => Page < TotalPages;
    }

    public class SearchProductResponse
    {
        // Product Information
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public string StatusName { get; set; }
        public bool IsActive { get; set; }

        // Variant Information
        public int VariantId { get; set; }
        public int? GradeId { get; set; }
        public int? RamId { get; set; }
        public string RamSize { get; set; }
        public int? StorageId { get; set; }
        public string StorageSize { get; set; }

        // Pricing and Stock
        public decimal BasePrice { get; set; }
        public decimal SellingPrice { get; set; }
        public int StockQty { get; set; }
        public string SKUCode { get; set; }

        // Timestamps
        public DateTime Created { get; set; }
        public DateTime? Modified { get; set; }

        // Pagination
        public int TotalRecords { get; set; }
    }
}