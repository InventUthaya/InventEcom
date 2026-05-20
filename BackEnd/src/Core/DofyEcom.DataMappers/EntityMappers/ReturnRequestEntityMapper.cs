using AutoMapper;
using DofyEcom.DBO;
using DofyEcom.ViewEntities;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class ReturnRequestEntityMapper : ITypeConverter<DBO.ReturnRequest,ViewEntities.ReturnRequest>
    {
        public ViewEntities.ReturnRequest Convert(DBO.ReturnRequest source,ViewEntities. ReturnRequest destination, ResolutionContext context)
        {
            if (source == null) return null;

            return new ViewEntities.ReturnRequest
            {
                OrderId = source.OrderId,
                OrderDetailId = source.OrderDetailId,
                SkuId = source.StatusId,
                UserId = source.UserId,
                Reason = source.Reason,
                StatusId = source.StatusId, 
                //StatusName = source, 
                RefundAmount = source.RefundAmount,   
                RefundPaymentId = source.RefundPaymentId,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
