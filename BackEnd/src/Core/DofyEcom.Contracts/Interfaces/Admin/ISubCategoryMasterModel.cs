

using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;

namespace DofyEcom.Contracts 
{
    public interface ISubCategoryMasterModel : IEntityModel<SubCategoryMaster>
    {
        Task<IEnumerable<SubCategoryView>> GetList(CategoryMasterSearch request);
    }
}
