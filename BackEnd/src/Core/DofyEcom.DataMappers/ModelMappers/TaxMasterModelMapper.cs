using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class TaxMasterModelMapper : ITypeConverter<ViewEntities.TaxMaster, DBO.TaxMaster>
    {
        public DBO.TaxMaster Convert(ViewEntities.TaxMaster source, DBO.TaxMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.TaxMaster();

            return new DBO.TaxMaster
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