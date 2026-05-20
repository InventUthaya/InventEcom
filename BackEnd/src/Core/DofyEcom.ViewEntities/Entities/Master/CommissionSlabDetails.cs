

namespace DofyEcom.ViewEntities
{
    public class CommissionSlabDetails : EntityBase
    {
        public decimal MinCommissionAmount { get; set; }
        public decimal MaxCommissionAmount { get; set; }
        public decimal Percentage { get; set; }
        public int CommissionSlabId { get; set; }
    }
}
