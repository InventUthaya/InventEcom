
namespace DofyEcom.ViewEntities
{
    public class EditReturnRequest
    {
        public int ReturnId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public decimal? RefundAmount { get; set; }
    }

}
