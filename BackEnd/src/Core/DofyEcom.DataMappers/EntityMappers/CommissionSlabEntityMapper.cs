
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class CommissionSlabEntityMapper : ITypeConverter<DBO.CommissionSlab, ViewEntities.CommissionSlab>
    {
        public ViewEntities.CommissionSlab Convert(DBO.CommissionSlab source, ViewEntities.CommissionSlab destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.CommissionSlab();

            return new ViewEntities.CommissionSlab
            {
                Id = source.Id,
                Name = source.Name,
                IsActive = source.IsActive,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
            };
        }
    }
}
