using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class OrderHeaderModelMapper : ITypeConverter<ViewEntities.OrderHeader, DBO.OrderHeader>
    {
        public DBO.OrderHeader Convert(ViewEntities.OrderHeader source, DBO.OrderHeader destination, ResolutionContext context)
        {
            return new DBO.OrderHeader
            {
                Id = source.Id,
                //OrderId = source?.OrderId ?? 0,
                UserId = source?.UserId ?? 0,
                AddressId = source?.AddressId ?? 0,
                OrderDate = source?.OrderDate,
                OrderNumber = source.OrderNumber,
                StatusId = source?.StatusId ?? 0,
                PromoId = source?.PromoId,
                ProductTotal = source?.ProductTotal ?? 0,
                ProductTaxTotal = source?.ProductTaxTotal ?? 0,
                ChargeTotal = source?.ChargeTotal ?? 0,
                ChargeTaxTotal = source?.ChargeTaxTotal ?? 0,
                DiscountTotal = source?.DiscountTotal ?? 0,
                GrandTotal = source?.GrandTotal ?? 0,
                NetPayable = source?.NetPayable ?? 0,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
