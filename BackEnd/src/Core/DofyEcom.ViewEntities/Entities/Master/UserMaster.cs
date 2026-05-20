using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.Helper.Attributes;

namespace DofyEcom.ViewEntities
{
    public class UserMaster : EntityBase
    {
        public int UserID { get; set; }
        public string FullName { get; set; }

        public bool? DisplayInList { get; set; }

    }
}
