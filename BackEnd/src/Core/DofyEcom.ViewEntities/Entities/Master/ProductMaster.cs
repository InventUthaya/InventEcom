

using DofyEcom.Helper.Attributes;
using Microsoft.AspNetCore.Http;

namespace DofyEcom.ViewEntities
{
    public class ProductMaster : EntityBase
    {
        public string ProductName { get; set; }

        public string Description { get; set; }

        public int CategoryId { get; set; }

        public int BrandId { get; set; }

        public int TaxId { get; set; }

        public int StatusId { get; set; }

        public int SubCategoryId { get; set; }

        public int ItemSubCategoryId { get; set; }


        public bool DisplayInList { get; set; }

        [DBIgnore]
        public string? EncryptedId { get; set; }

        [DBIgnore]
        public string? ImageBase64 { get; set; }
        public int? PartnerId { get; set; }

    }
}
