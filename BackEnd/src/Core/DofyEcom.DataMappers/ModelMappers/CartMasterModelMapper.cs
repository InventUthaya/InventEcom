using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers
{
    public class CartMasterModelMapper : ITypeConverter<ViewEntities.Cart, DBO.Cart>
    {
        public DBO.Cart Convert(ViewEntities.Cart source, DBO.Cart destination, ResolutionContext context)
        {
            return new DBO.Cart
            {
                Id = source?.Id ?? 0,
                UserId = source?.UserId ?? 0,
                SkuId = source?.SkuId?? 0,
                Quantity = source?.Quantity ?? 0,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null

            };
        }
    }
}
