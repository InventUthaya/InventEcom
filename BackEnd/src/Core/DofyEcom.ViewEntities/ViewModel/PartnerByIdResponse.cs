namespace DofyEcom.ViewEntities.ViewModel
{
    public class PartnerByIdResponse
    {

        public int Id { get; set; }
        public int PartnerId { get; set; }

        public string PartnerName { get; set; }

        public string CommissionAmount { get; set; }

        public string CommissionPercentage { get; set; }

        public string Amount { get; set; }

        public string OrderNumber { get; set; }
        public decimal PartnerAmount { get; set; }
        public decimal Baseprice { get; set; }

        public decimal TaxPercentage { get; set; }

        public int ProductTaxTotal { get; set; }

        public int ProductTotal { get; set; }

        public int paymentDone { get; set; }

        public decimal TotalPayableAmount { get; set; }

        public decimal TotalCommissionAmount { get; set; }

        public decimal TotalpaidpendingAmount { get; set; }

        public decimal TotalPaidAmount { get; set; }

    }
}
