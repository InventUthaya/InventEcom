using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
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

