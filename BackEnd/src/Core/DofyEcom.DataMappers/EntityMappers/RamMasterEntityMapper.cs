using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class RamMasterEntityMapper : ITypeConverter<DBO.RamMaster, ViewEntities.RamMaster>
    {
        public ViewEntities.RamMaster Convert(DBO.RamMaster source, ViewEntities.RamMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.RamMaster();

            return new ViewEntities.RamMaster
            {
                Id = source.Id,
                RamSize = source.RamSize,
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