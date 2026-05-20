using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class OrderHistoryEntityMapper : ITypeConverter<DBO.OrderHistory, ViewEntities.OrderHistory>
    {
        public ViewEntities.OrderHistory Convert(DBO.OrderHistory source, ViewEntities.OrderHistory destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.OrderHistory();

            return new ViewEntities.OrderHistory
            {
                Id = source.Id,
                OrderId = source.OrderId,
                StatusId = source.StatusId,
                IsActive = source.IsActive,
                Description= source.Description,
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
