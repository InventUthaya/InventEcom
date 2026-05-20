using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class ActivityLog : EntityBase
    {
        public long LogID { get; set; }
        public long UserID { get; set; }
        public string Action { get; set; }
        public string TableName { get; set; }
        public long RecordID { get; set; }
        public DateTime ActionDate { get; set; }
        public string IPAddress { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}
