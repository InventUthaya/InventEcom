namespace DofyEcom.DBO
{
    public class CategoryMaster : EntityBase
    {
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        //public long ProductId { get; set; }
        //public long CategoryId { get; set; }
        //public long BrandId { get; set; }
        public int? PartnerId { get; set; }
        public string ImagePath { get; set; }
    }
}