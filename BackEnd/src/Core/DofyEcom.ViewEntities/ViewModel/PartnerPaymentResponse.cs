namespace DofyEcom.ViewEntities.ViewModel
{
    public class PartnerPaymentResponse
    {
        public string PartnerName { get; set; }

        public int TotalOrders { get; set; }

        public int PartnerId { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal TotalCommission { get; set; }

        public decimal AvgCommissionPercentage { get; set; }

        public int CompletedOrders { get; set; }

        public int PendingOrders { get; set; }

        public decimal TaxPercentage { get; set; }

        public int ProductTaxTotal { get; set; }

        public int ProductTotal { get; set; }

        public int PartnerAmount { get; set; }

        public int PaymentDoneStatus { get; set; }

        public decimal TotalPayableAmount { get; set; }

        public decimal TotalCommissionAmount { get; set; }

        public decimal TotalpaidpendingAmount{ get; set; }

        public decimal TotalPaidAmount { get; set; }

    }
}
