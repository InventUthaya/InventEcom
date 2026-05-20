

namespace DofyEcom.ViewEntities
{
    public class CategoryTreeResponseViewModel
    {
        public List<Category> Categories { get; set; } = new List<Category>();
    }

    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string ImagePath { get; set; }
        public List<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
    }

    public class SubCategory
    {
        public int SubCategoryId { get; set; }
        public string SubCategoryName { get; set; } = string.Empty;
        public List<ItemsCategory> ItemsCategories { get; set; } = new List<ItemsCategory>();
    }

    public class ItemsCategory
    {
        public int ItemsCategoryId { get; set; }
        public string ItemsCategoryName { get; set; } = string.Empty;
        public List<Product> Products { get; set; } = new List<Product>();
    }

    public class Product
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
    }
}
