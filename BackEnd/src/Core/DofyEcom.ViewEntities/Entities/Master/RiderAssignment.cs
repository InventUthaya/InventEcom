
namespace DofyEcom.ViewEntities
{
    public class RiderAssignment : EntityBase
    {
        public int OrderId { get; set; }

        public int? RiderId { get; set; }

        public int? CourierId { get; set; }

        public DateTime? AssignedDate { get; set; }

        public int? StatusId { get; set; }

        public bool? DisplayInList { get; set; }
        public int? PartnerId { get; set; }

    }
}

