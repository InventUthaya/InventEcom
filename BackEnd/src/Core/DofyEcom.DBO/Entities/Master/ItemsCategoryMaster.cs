

namespace DofyEcom.DBO
{
    public class ItemsCategoryMaster : EntityBase
    {
        public int SubCategoryMasterId { get; set; }
        public string ItemsCategoryName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}
