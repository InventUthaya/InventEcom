
namespace DofyEcom.ViewEntities
{
    public class StockLedger : EntityBase
    {
        public int SkuId { get; set; }

        public string TransactionType { get; set; }

        public int Quantity { get; set; }

        public int? ReferenceId { get; set; }

        public DateTime? TransactionDate { get; set; }

        public string Remarks { get; set; }

        public bool? DisplayInList { get; set; }
        public int? PartnerId { get; set; }

    }
}
