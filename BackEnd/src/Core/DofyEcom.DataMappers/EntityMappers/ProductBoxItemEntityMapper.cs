using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DofyEcom.DBO;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class ProductBoxItemEntityMapper : ITypeConverter<DBO.ProductBoxItem, ViewEntities.ProductBoxItem>
    {
        public ViewEntities.ProductBoxItem Convert(DBO.ProductBoxItem source, ViewEntities.ProductBoxItem destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.ProductBoxItem();

            return new ViewEntities.ProductBoxItem
            {
                Id = source.Id,
                ProductId = source.ProductId,
                SpecKey = source.SpecKey,
                SpecValue = source.SpecValue,
                DisplayInList = source.DisplayInList,
                IsActive = source.IsActive,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
