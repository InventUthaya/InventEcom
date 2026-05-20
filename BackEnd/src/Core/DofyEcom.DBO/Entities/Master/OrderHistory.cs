namespace DofyEcom.DBO
{
    public class OrderHistory:EntityBase
    {
        public long OrderId { get; set; }

        public long StatusId { get; set; }

        public string Description { get; set; }

        public bool DisplayInList { get; set; }
        //public int? PartnerId { get; set; }
    }
}