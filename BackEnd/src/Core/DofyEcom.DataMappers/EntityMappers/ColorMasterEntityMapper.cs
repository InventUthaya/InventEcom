using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class ColorMasterEntityMapper : ITypeConverter<DBO.ColorMaster, ViewEntities.ColorMaster>
    {
        public ViewEntities.ColorMaster Convert(DBO.ColorMaster source, ViewEntities.ColorMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.ColorMaster();

            return new ViewEntities.ColorMaster
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