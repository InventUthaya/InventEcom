using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class CategoryMasterModelMapper : ITypeConverter<ViewEntities.CategoryMaster, DBO.CategoryMaster>
    {
        public DBO.CategoryMaster Convert(ViewEntities.CategoryMaster source, DBO.CategoryMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.CategoryMaster();

            return new DBO.CategoryMaster
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