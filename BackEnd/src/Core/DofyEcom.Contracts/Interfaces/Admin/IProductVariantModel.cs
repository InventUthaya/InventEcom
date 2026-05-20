using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;

namespace DofyEcom.Contracts
{
    public interface IProductVariantModel : IEntityModel<ProductVariant>
    {
        Task<bool> DeleteAsync(int id);

        Task<int> CreateVariant(ViewEntities.ProductVariant productMaster);

        Task<bool> StockAdjustAsync(AdjustVariantStockRequest request);

    }
}
