using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class StorageMasterModelMapper : ITypeConverter<ViewEntities.StorageMaster, DBO.StorageMaster>
    {
        public DBO.StorageMaster Convert(ViewEntities.StorageMaster source, DBO.StorageMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.StorageMaster();

            return new DBO.StorageMaster
            {
                Id = source.Id,
                StorageSize = source.StorageSize,
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