namespace DofyEcom.ViewEntities
{
    public class CreatePaymentIntentRequest
    {
        public long Amount { get; set; }

        public string Currency { get; set; }
        public string PartnerId { get; set; }
        public string PartnerName { get; set; }
    }
}
