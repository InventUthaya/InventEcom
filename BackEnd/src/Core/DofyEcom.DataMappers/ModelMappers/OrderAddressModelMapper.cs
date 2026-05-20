using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    internal class OrderAddressModelMapper : ITypeConverter<ViewEntities.OrderAddress, DBO.OrderAddress>
    {
        public DBO.OrderAddress Convert(ViewEntities.OrderAddress source, DBO.OrderAddress destination, ResolutionContext context)
        {
            return new DBO.OrderAddress
            {
                Id = source?.Id ?? 0,
                AddressLine1 = source?.AddressLine1 ?? null,
                AddressLine2 = source?.AddressLine2 ?? null,
                City = source?.City ?? null,
                State = source?.State ?? null,
                Country = source?.Country ?? null,
                Pincode = source?.Pincode ?? null,
                OrderHeaderId = source?.OrderHeaderId ?? 0,
                AddressId = source?.AddressId ?? 0,
                IsActive = source?.IsActive ?? true,
                Created = source.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
