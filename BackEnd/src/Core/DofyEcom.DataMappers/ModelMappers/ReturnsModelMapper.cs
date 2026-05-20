using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ReturnsModelMapper : ITypeConverter<ViewEntities.Returns, DBO.Returns>
    {
        public DBO.Returns Convert(ViewEntities.Returns source, DBO.Returns destination, ResolutionContext context)
        {
            return new DBO.Returns
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
                Created = source?.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy
            };
        }
    }
}
