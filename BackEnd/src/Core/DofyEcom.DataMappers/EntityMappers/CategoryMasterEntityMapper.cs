using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class CategoryMasterEntityMapper : ITypeConverter<DBO.CategoryMaster, ViewEntities.CategoryMaster>
    {
        public ViewEntities.CategoryMaster Convert(DBO.CategoryMaster source, ViewEntities.CategoryMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.CategoryMaster();

            return new ViewEntities.CategoryMaster
            {
                Id = source.Id,
                CategoryName = source.CategoryName,
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