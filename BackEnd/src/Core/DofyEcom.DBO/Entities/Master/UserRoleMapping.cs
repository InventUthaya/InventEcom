using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class UserRoleMapping : EntityBase
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public bool? DisplayInList { get; set; }
    }
}
