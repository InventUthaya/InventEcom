using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public interface IPublicLocateOurStoresModel : IEntityModel<LocateOurStores>
    {
        PagedList<LocateOurStoresSearch> GetLocateOurStoresList(SearchBaseCriteria criteria);
        IEnumerable<ViewEntities.LocateOurStores> GetLocateOurStore();
    }
}
