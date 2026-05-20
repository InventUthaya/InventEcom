using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public interface IInventoryModel : IEntityModel<Sku>
    {
        Task<VariantStockLedgerResponse> GetVariantStockAndLedgerAsync(int variantId, int page = 1, int pageSize = 50);

        Task<bool> AdjustStockAsync(UpdateVariantStockRequest request);
    }
}
