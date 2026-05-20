using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class StorageMasterEntityMapper : ITypeConverter<DBO.StorageMaster, ViewEntities.StorageMaster>
    {
        public ViewEntities.StorageMaster Convert(DBO.StorageMaster source, ViewEntities.StorageMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.StorageMaster();

            return new ViewEntities.StorageMaster
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