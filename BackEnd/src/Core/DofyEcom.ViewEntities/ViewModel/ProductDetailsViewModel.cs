using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities.ViewModel
{
    public class ProductDetailsViewModel
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
        public int BrandID { get; set; }
        public string BrandName { get; set; }
        public int TaxID { get; set; }
        public decimal TaxRate { get; set; }
        public bool IsInclusive { get; set; }
        public int StatusID { get; set; }
        public string StatusName { get; set; }
        public int SubCategoryId { get; set; }

        public int  ItemSubCategoryId {get; set;}

        public IEnumerable<ProductVariantResponse>? Variants { get; set; } = new List<ProductVariantResponse>();

        public IEnumerable<ProductSpecificationResponse>? Specifications { get; set; } = new List<ProductSpecificationResponse>();

        public IEnumerable<ProductBoxItemResponse>? BoxItems { get; set; } = new List<ProductBoxItemResponse>();

        public IEnumerable<ProductColorImageResponse>? ColorImages { get; set; } = new List<ProductColorImageResponse>();


    }

    public class ProductVariantResponse
    {
        public int SkuID { get; set; }
        public int VariantID { get; set; }
        public string Barcode { get; set; }
        public int ProductID { get; set; }
        public string GradeName { get; set; }
        public string ColorName { get; set; }
        public string RamSize { get; set; }
        public string StorageSize { get; set; }
        public decimal MRP { get; set; }
        public decimal SellingPrice { get; set; }
        public int StockQty { get; set; }
        public int? reminderQty { get; set; }
        public int StatusID { get; set; }
        public string StatusName { get; set; }

        public string ImagePath { get; set; }
        public bool IsReturnable { get; set; }
        public bool IsReplacement { get; set; }
        public int? ReturnDays { get; set; }
        public int? ReplacementDays { get; set; }
    }

    public class ProductSpecificationResponse
    {
        public int SpecId { get; set; }
        public string SpecKey { get; set; }
        public string SpecValue { get; set; }
    }

    public class ProductBoxItemResponse
    {
        public string ItemName { get; set; }
        public int Quantity { get; set; }
    }

    public class ProductColorImageResponse
    {
        public long ProductImageId { get; set; }
        public int ColorID { get; set; }
        public string ColorName { get; set; }
        public string ImagePath { get; set; }
    }
}
