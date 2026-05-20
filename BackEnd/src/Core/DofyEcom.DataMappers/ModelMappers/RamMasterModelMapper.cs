using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class RamMasterModelMapper : ITypeConverter<ViewEntities.RamMaster, DBO.RamMaster>
    {
        public DBO.RamMaster Convert(ViewEntities.RamMaster source, DBO.RamMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.RamMaster();

            return new DBO.RamMaster
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