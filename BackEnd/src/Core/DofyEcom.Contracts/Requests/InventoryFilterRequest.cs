using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts.Requests
{
    public class InventoryFilterRequest: SearchBaseCriteria
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }

        public string? Category { get; set; }
        public string? Brand { get; set; }
        public string? ProductName { get; set; }

        public string SortColumn { get; set; } = "Modified";
        public string SortOrder { get; set; } = "DESC";
        public int? UserId { get; set; } = null;
    }
}
