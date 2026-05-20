

using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class ItemsCategoryMasterEntityMapper : ITypeConverter<DBO.ItemsCategoryMaster, ViewEntities.ItemsCategoryMaster>
    {
        public ViewEntities.ItemsCategoryMaster Convert(DBO.ItemsCategoryMaster source, ViewEntities.ItemsCategoryMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.ItemsCategoryMaster();

            return new ViewEntities.ItemsCategoryMaster
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
