using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ColorMasterModelMapper : ITypeConverter<ViewEntities.ColorMaster, DBO.ColorMaster>
    {
        public DBO.ColorMaster Convert(ViewEntities.ColorMaster source, DBO.ColorMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.ColorMaster();

            return new DBO.ColorMaster
            {
                Id = source.Id,
                ColorName = source.ColorName,
                HexCode = source.HexCode,
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