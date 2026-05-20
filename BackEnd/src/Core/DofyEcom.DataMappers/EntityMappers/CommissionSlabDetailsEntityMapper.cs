
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class CommissionSlabDetailsEntityMapper : ITypeConverter<DBO.CommissionSlabDetails, ViewEntities.CommissionSlabDetails>
    {
        public ViewEntities.CommissionSlabDetails Convert(DBO.CommissionSlabDetails source, ViewEntities.CommissionSlabDetails destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.CommissionSlabDetails();

            return new ViewEntities.CommissionSlabDetails
            {
                Id = source.Id,
                MinCommissionAmount = source.MinCommissionAmount,
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
