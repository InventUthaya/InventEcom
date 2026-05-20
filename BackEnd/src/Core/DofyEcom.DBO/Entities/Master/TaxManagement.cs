using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class TaxManagement : EntityBase
    {
        public decimal? Igst { get; set; }

        public decimal? Cgst { get; set; }

        public decimal? Sgst { get; set; }

        public decimal? Tds { get; set; }

        public bool DisplayInList { get; set; }

        public DateTime? EffectiveStartDate { get; set; }

        public DateTime? EffectiveEndDate { get; set; }
        public int? PartnerId { get; set; }

    }
}