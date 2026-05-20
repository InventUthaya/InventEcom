namespace DofyEcom.ViewEntities
{
    public class PartnerMaster : EntityBase
    {
        public long UserId { get; set; }
        public string CompanyName { get; set; }
        public long CommissionSlabId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string GSTNumber { get; set; }
        public string PanCardNumber { get; set; }
        public string BankName { get; set; }
        public string IFSCCode { get; set; }
        public string AccountNumber { get; set; }
        public string AccountHolderName { get; set; }
        public string? ChequeLeaf { get; set; }
        public string? Signature { get; set; }

    }
}
