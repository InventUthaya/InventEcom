
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class CommissionSlabModelMapper : ITypeConverter<ViewEntities.CommissionSlab, DBO.CommissionSlab>
    {
        public DBO.CommissionSlab Convert(ViewEntities.CommissionSlab source, DBO.CommissionSlab destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.CommissionSlab();

            return new DBO.CommissionSlab
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
