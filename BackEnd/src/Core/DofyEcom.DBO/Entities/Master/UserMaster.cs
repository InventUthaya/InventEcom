using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class UserMaster : EntityBase
    {

        public string FullName { get; set; }

        public bool? DisplayInList { get; set; }

    }
}
