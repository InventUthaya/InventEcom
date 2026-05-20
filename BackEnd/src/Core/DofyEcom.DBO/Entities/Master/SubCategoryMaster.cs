
namespace DofyEcom.DBO
{
    public class SubCategoryMaster : EntityBase
    {
        public int CategoryMasterId { get; set; }
        public string SubCategoryName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}
