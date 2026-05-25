using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DofyEcom.Contracts
{
    public interface IBrandMasterModel : IEntityModel<BrandMaster>
    {
        Task<IEnumerable<BrandMasterResponse>> GetAll(BrandMasterSearch request);
    }
}
