using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities
{
    public class RoleMaster : EntityBase
    {

        public int Id { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public bool? DisplayInList { get; set; }
    }
}
