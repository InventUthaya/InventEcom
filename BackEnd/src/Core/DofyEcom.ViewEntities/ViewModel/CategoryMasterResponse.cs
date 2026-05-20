namespace DofyEcom.ViewEntities
{
    public class CategoryMasterResponse
    {
        public int Id { get; set; }

        public string CategoryName { get; set; }

        public string Description { get; set; }

        public int IsActive { get; set; }

        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public int TotalCount { get; set; }

        public string ImagePath { get; set; }
    }
}
