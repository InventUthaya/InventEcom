using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ProductBoxItemModelMapper : ITypeConverter<ViewEntities.ProductBoxItem, DBO.ProductBoxItem>
    {
        public DBO.ProductBoxItem Convert(ViewEntities.ProductBoxItem source, DBO.ProductBoxItem destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.ProductBoxItem();

            return new DBO.ProductBoxItem
            {
                Id = source?.Id ?? 0,
                ProductId = source?.ProductId ?? 0,
                SpecKey = source?.SpecKey,
                SpecValue = source?.SpecValue,
                DisplayInList = source?.DisplayInList ?? false,
                IsActive = source?.IsActive ?? false,
                Created = source?.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
