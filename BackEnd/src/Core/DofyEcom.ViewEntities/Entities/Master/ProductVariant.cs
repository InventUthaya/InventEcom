

using System.ComponentModel.DataAnnotations.Schema;
using DofyEcom.Helper.Attributes;
using Microsoft.AspNetCore.Http;

namespace DofyEcom.ViewEntities
{
    public class ProductVariant : EntityBase
    {
        public int ProductId { get; set; }

        public int? GradeId { get; set; }

        public int? ColorId { get; set; }

        public int? RamId { get; set; }

        public int? StorageId { get; set; }

        public decimal Price { get; set; }

        public decimal BasePrice { get; set; }

        public decimal DiscountPrice { get; set; }

        public int? StockQty { get; set; }

        public int? reminderQty { get; set; }

        public int StatusId { get; set; }

        public bool? DisplayInList { get; set; }

        [DBIgnore]
        public IFormFile? Image { get; set; }

        public string? ImagePath { get; set; }
        public int? PartnerId { get; set; }
        public bool IsReturnable { get; set; } = false;
        public bool IsReplacement { get; set; } = false;
        public int? ReturnDays { get; set; }
        public int? ReplacementDays { get; set; }

    }
}
