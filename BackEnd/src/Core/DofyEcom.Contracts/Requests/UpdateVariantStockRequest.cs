using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.Contracts
{
    public class UpdateVariantStockRequest
    {
        public int SkuID { get; set; }
        public int Delta { get; set; }
        public string TransactionType { get; set; }
        public int? ReferenceID { get; set; }
        public string Remarks { get; set; }
        public string ModifiedBy { get; set; }
    }
}
