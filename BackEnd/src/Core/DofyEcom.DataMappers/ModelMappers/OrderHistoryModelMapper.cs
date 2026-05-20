using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class OrderHistoryModelMapper : ITypeConverter<ViewEntities.OrderHistory, DBO.OrderHistory>
    {
        public DBO.OrderHistory Convert(ViewEntities.OrderHistory source, DBO.OrderHistory destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.OrderHistory();

            return new DBO.OrderHistory
            {
                Id = source.Id,
                OrderId = source.OrderId,
                StatusId = source.StatusId,
                IsActive = source.IsActive,
                Description = source.Description,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
                //PartnerId = source?.PartnerId ?? null
            };
        }
    }
}