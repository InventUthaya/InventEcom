using DofyEcom.Helper.Attributes;

namespace DofyEcom.ViewEntities
{
    public class CategoryMaster : EntityBase
    {
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }

        [DBIgnore]
        public bool ProductId { get; set; }
        public int? PartnerId { get; set; }
        public string ImagePath { get; set; }
        [DBIgnore]
        public string ImageBase64 { get; set; }
    }
}