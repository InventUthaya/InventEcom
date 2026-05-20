using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public interface ISkuModel: IEntityModel<Sku>
    {
        List<Sku> GetSKUDetailsByVariantId(int variantId);
    }
}
