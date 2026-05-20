namespace DofyEcom.ViewEntities.SearchCriteria
{
    public class PartnerpaymentSearch: SearchBaseCriteria
    {
        public int OffsetStart { get; set; }

        public int RowsPerPage { get; set; }

        public string? Search { get; set; }

        public string? SortColumn { get; set; }

        public int? PartnerId { get; set; }
    }
}
