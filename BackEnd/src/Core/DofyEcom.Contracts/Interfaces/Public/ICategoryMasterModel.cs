
using System.Collections.Generic;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.Contracts
{

    public interface ICategoryMasterModel : IEntityModel<CategoryMaster>
    {
        public List<ViewEntities.BrandMaster> GetBrandsByCategory(int categoryId);

        Task<IEnumerable<CategoryMasterResponse>> GetAll(CategoryMasterSearch request);


    }
}
