namespace DofyEcom.ViewEntities
{
    public class SearchBaseCriteria
    {
        public int? OffsetStart { get; set; }

        public int? RowsPerPage { get; set; }

        public string? SortOrder { get; set; }

        public string? SortOrderColumn { get; set; }

        public string? SearchText { get; set; }

        public string? IsPublic { get; set; }

        public string? IsActive { get; set; }

        public long? StatusId { get; set; }

        public long? FeedbackStatusId { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public long? ContactType { get; set; }


    }
}
