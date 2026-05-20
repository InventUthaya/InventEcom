namespace DofyEcom.ViewEntities
{
    public class TaxMaster : EntityBase
    {
        public string TaxName { get; set; }
        public decimal TaxRate { get; set; }
        public bool IsInclusive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}