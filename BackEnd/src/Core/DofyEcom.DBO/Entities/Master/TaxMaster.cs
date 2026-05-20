using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class TaxMaster : EntityBase
    {
        public string TaxName { get; set; }
        public decimal TaxRate { get; set; }
        public bool IsInclusive { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }

    }
}