namespace DofyEcom.DataMappers
{

    using AutoMapper;

    public class TaxManagementModelMapper : ITypeConverter<ViewEntities.TaxManagement, DBO.TaxManagement>
    {
        public DBO.TaxManagement Convert(ViewEntities.TaxManagement source, DBO.TaxManagement destination, ResolutionContext context)
        {
            return new DBO.TaxManagement
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