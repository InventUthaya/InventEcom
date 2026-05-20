using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class ReturnsEntityMapper : ITypeConverter<DBO.Returns, ViewEntities.Returns>
    {
        public ViewEntities.Returns Convert(DBO.Returns source, ViewEntities.Returns destination, ResolutionContext context)
        {
            if (source == null) return null;

            return new ViewEntities.Returns
            {
                Id = source.Id,
                OrderId = source.OrderId,
                OrderDetailId = source.OrderDetailId,
                SkuId = source.SkuId,
                UserId = source.UserId,
                Reason = source.Reason,
                StatusId = source.StatusId,
                RefundAmount = source.RefundAmount,
                RefundPaymentId = source.RefundPaymentId,
                IsActive = source.IsActive,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy
            };
        }
    }
}
