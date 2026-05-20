using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DBO
{
    public class ProductSpecification : EntityBase
    {
        public int ProductId { get; set; }

        public string SpecKey { get; set; }

        public string SpecValue { get; set; }

        public bool DisplayInList { get; set; } = true;
        public int? PartnerId { get; set; }
    }
}
