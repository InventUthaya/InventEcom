

using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ItemsCategoryMasterModelMapper : ITypeConverter<ViewEntities.ItemsCategoryMaster, DBO.ItemsCategoryMaster>
    {
        public DBO.ItemsCategoryMaster Convert(ViewEntities.ItemsCategoryMaster source, DBO.ItemsCategoryMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.ItemsCategoryMaster();

            return new DBO.ItemsCategoryMaster
            {
                Id = source.Id,
                SubCategoryMasterId = source.SubCategoryMasterId,
                ItemsCategoryName = source.ItemsCategoryName,
                Description = source.Description,
                IsActive = source.IsActive,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
