using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class UserAddress : EntityBase
    {
        public string Name { get; set; }
        public string AddressType { get; set; }
        public string PhoneNumber { get; set; }
        public long UserId { get; set; }

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Pincode { get; set; }

        public string Country { get; set; }

        public long isDefault { get; set; }

        public bool DisplayInList { get; set; }
    }
}
