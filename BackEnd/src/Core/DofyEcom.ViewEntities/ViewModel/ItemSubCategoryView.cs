
namespace DofyEcom.ViewEntities
{
    public class ItemSubCategoryView
    {

        public int Id { get; set; }

        public int SubCategoryMasterId { get; set; }

        public string ItemsCategoryName { get; set; }

        public string Description { get; set; }

        public int IsActive { get; set; }

        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public int TotalCount { get; set; }
    }
}
