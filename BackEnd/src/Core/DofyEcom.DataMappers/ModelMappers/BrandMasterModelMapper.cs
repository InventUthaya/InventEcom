using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class BrandMasterModelMapper : ITypeConverter<ViewEntities.BrandMaster, DBO.BrandMaster>
    {
        public DBO.BrandMaster Convert(ViewEntities.BrandMaster source, DBO.BrandMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.BrandMaster();

            return new DBO.BrandMaster
            {
                Id = source.Id,
                BrandName = source.BrandName,
                Description = source.Description,
                IsActive = source.IsActive,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null,
                ImagePath = source.ImagePath
            };
        }
    }
}