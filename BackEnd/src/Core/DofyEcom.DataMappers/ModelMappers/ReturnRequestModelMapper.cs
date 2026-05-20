using AutoMapper;
using DofyEcom.DBO;
using ViewEntities = DofyEcom.ViewEntities;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ReturnRequestModelMapper : ITypeConverter<ViewEntities.ReturnRequest, DBO.ReturnRequest>
    {
        public DBO.ReturnRequest Convert(ViewEntities.ReturnRequest source, DBO.ReturnRequest destination, ResolutionContext context)
        {
            return new DBO.ReturnRequest
            {
                OrderId = source.OrderId,
                OrderDetailId = source.OrderDetailId,
                SkuId = source.SkuId,
                UserId = source.UserId,
                Reason = source.Reason,
                StatusId = source.StatusId,
                RefundAmount = source.RefundAmount,
                RefundPaymentId = source.RefundPaymentId,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
