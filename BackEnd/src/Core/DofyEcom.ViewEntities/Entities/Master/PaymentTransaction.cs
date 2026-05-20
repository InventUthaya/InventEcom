namespace DofyEcom.ViewEntities
{
    using System;

    public class PaymentTransaction : EntityBase
    {
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionRef { get; set; }
        public decimal Amount { get; set; }
        public int StatusId { get; set; }
        public DateTime? PaidOn { get; set; }
        public bool DisplayInList { get; set; }

        public string Reason { get; set; }
        public int? PartnerId { get; set; }

    }
}
