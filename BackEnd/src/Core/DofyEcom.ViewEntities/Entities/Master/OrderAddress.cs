using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities
{
    public class OrderAddress : EntityBase
    {
        public int OrderHeaderId { get; set; }
        public int AddressId { get; set; }
        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Pincode { get; set; }

        public string Country { get; set; }
        public int? PartnerId { get; set; }
    }
}
