using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class OrderDetailEntityMapper : ITypeConverter<DBO.OrderDetail, ViewEntities.OrderDetail>
    {
        public ViewEntities.OrderDetail Convert(DBO.OrderDetail source, ViewEntities.OrderDetail destination, ResolutionContext context)
        {
            return new ViewEntities.OrderDetail
            {
                Id = source?.Id ?? 0,
                OrderId = source?.OrderId ?? 0,
                SkuId = source?.SkuId ?? 0,
                Quantity = source?.Quantity ?? 0,
                UnitPrice = source?.UnitPrice ?? 0,
                TotalPrice = source?.TotalPrice ?? 0,
                TaxRate = source?.TaxRate ?? 0,
                TaxAmount = source?.TaxAmount ?? 0,
                DiscountAmount = source?.DiscountAmount ?? 0,
                DiscountId = source?.DiscountId,
                PromoId = source?.PromoId,
                IsFreeItem = source?.IsFreeItem ?? false,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
