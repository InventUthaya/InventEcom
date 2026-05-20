
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public interface ITaxManagementModel : IEntityModel<TaxManagement>
    {
        TaxPaginationResultViewModel GetTaxListAsync(TaxPaginationRequestViewModel request);

        ViewEntities.TaxManagement GetTaxById(long id);

    }
}
