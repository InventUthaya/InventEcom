using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.Contracts
{
    public class AdjustVariantStockRequest
    {
        public int VariantID { get; set; }
        public String Delta { get; set; }
        public int ProductId { get; set; }


    }
}
