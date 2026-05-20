using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public class VariantStockLedgerResponse
    {
        public int VariantId { get; set; }
        public int StockQty { get; set; }
        public List<StockLedger> Ledger { get; set; }
    }
}
