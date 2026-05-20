using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.DataMappers.EntityMappers
{
    internal class TaxManagementEntityMapper
    {
    }
}

namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class TaxManagementEntityMapper : ITypeConverter<DBO.TaxManagement, ViewEntities.TaxManagement>
    {
        public ViewEntities.TaxManagement Convert(DBO.TaxManagement source, ViewEntities.TaxManagement destination, ResolutionContext context)
        {
            return new ViewEntities.TaxManagement
            {
                Id = source.Id,
                Igst = source.Igst,
                Cgst = source.Cgst,
                Sgst = source.Sgst,
                Tds = source.Tds,
                IsActive = source?.IsActive ?? true,
                EffectiveStartDate = source?.EffectiveStartDate,
                EffectiveEndDate = source?.EffectiveEndDate,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
