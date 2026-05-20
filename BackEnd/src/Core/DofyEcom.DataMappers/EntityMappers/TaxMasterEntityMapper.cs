using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class TaxMasterEntityMapper : ITypeConverter<DBO.TaxMaster, ViewEntities.TaxMaster>
    {
        public ViewEntities.TaxMaster Convert(DBO.TaxMaster source, ViewEntities.TaxMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.TaxMaster();

            return new ViewEntities.TaxMaster
            {
                Id = source.Id,
                TaxName = source.TaxName,
                TaxRate = source.TaxRate,
                IsInclusive = source.IsInclusive,
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