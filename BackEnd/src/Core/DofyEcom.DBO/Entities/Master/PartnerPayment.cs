namespace DofyEcom.DBO
{
    public class PartnerPayment:EntityBase
    {

        public int UserId { get; set; }

        public int PartnerId { get; set; }
        public int SkuId { get; set; }
        public decimal TaxRate { get; set; }
        public decimal PartnerAmount { get; set; }
        public decimal BasePrice { get; set; }

        public string CommissionAmount { get; set; }

        public string CommissionPercentage { get; set; }

        public int AddressId { get; set; }

        public DateTime? OrderDate { get; set; }

        public string OrderNumber { get; set; }

        public int StatusId { get; set; }

        public int? PromoId { get; set; }

        public decimal ProductTotal { get; set; }

        public decimal ProductTaxTotal { get; set; }

        public decimal GrandTotal { get; set; }

        public bool? DisplayInList { get; set; }

        public int paymentDone { get; set; }
    }
}
