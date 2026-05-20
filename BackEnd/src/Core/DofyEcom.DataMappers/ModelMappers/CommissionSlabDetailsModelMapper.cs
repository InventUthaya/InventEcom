
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class CommissionSlabDetailsModelMapper : ITypeConverter<ViewEntities.CommissionSlabDetails, DBO.CommissionSlabDetails>
    {
        public DBO.CommissionSlabDetails Convert(ViewEntities.CommissionSlabDetails source, DBO.CommissionSlabDetails destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.CommissionSlabDetails();

            return new DBO.CommissionSlabDetails
            {
                Id = source.Id,
                MinCommissionAmount = source.MaxCommissionAmount,
                MaxCommissionAmount = source.MaxCommissionAmount,
                Percentage = source.Percentage,
                CommissionSlabId = source.CommissionSlabId,
                IsActive = source.IsActive,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
            };
        }
    }
}
