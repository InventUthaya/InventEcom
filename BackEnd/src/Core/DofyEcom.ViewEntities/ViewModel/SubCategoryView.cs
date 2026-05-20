namespace DofyEcom.ViewEntities
{
    public class SubCategoryView
    {
        public int Id { get; set; }

        public int CategoryMasterId { get; set; }

        public string SubCategoryName { get; set; }

        public string Description { get; set; }

        public int IsActive { get; set; }

        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public int TotalCount { get; set; }
    }
}
