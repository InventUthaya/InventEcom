using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities.Entities.Master
{
    public class ActivityLog
    {
        public long LogID { get; set; }
        public long UserID { get; set; }
        public string UserName { get; set; }

        public string Action { get; set; }
        public string TableName { get; set; }
        public long RecordID { get; set; }
        public DateTime ActionDate { get; set; }
        public string IPAddress { get; set; }

        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }

        public DateTime Created { get; set; }
        public long CreatedBy { get; set; }
        public DateTime? Modified { get; set; }
        public long? ModifiedBy { get; set; }

        // Optional convenience fields
        public string CreatedByName { get; set; }
        public string ModifiedByName { get; set; }

        public int? PartnerId { get; set; }
    }
}
