namespace DofyEcom.ViewEntities
{
    public class RefundFilterRequest : SearchBaseCriteria
    {
        public string? OrderNumber { get; set; }

        public string? Customer { get; set; }
        //public string? StatusId { get; set; }
        public List<int>? StatusId { get; set; }
        public string? OrderDate { get; set; }
        public int UserId { get; set; }
    }
}
