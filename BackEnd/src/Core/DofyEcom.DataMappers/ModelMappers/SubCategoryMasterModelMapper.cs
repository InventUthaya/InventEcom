

using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class SubCategoryMasterModelMapper : ITypeConverter<ViewEntities.SubCategoryMaster, DBO.SubCategoryMaster>
    {
        public DBO.SubCategoryMaster Convert(ViewEntities.SubCategoryMaster source, DBO.SubCategoryMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.SubCategoryMaster();

            return new DBO.SubCategoryMaster
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
