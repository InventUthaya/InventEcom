using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class RoleMaster : EntityBase
    {
        public string RoleName { get; set; }
        public string Description { get; set; }
        public bool? DisplayInList { get; set; }
    }
}
