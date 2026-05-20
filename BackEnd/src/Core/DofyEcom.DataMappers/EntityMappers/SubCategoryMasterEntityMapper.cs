

using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class SubCategoryMasterEntityMapper : ITypeConverter<DBO.SubCategoryMaster, ViewEntities.SubCategoryMaster>
    {
        public ViewEntities.SubCategoryMaster Convert(DBO.SubCategoryMaster source, ViewEntities.SubCategoryMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.SubCategoryMaster();

            return new ViewEntities.SubCategoryMaster
            {
                Id = source.Id,
                CategoryMasterId = source.CategoryMasterId,
                SubCategoryName = source.SubCategoryName,
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
