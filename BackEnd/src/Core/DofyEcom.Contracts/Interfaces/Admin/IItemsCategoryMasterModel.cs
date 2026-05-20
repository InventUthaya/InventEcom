

using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;

namespace DofyEcom.Contracts
{
    public interface IItemsCategoryMasterModel : IEntityModel<ItemsCategoryMaster>
    {
        Task<IEnumerable<ItemSubCategoryView>> GetList(CategoryMasterSearch request);
    }
}
