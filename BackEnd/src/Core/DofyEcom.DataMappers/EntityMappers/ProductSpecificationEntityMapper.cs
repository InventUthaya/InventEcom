using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class ProductSpecificationEntityMapper : ITypeConverter<DBO.ProductSpecification, ViewEntities.ProductSpecification>
    {
        public ViewEntities.ProductSpecification Convert(DBO.ProductSpecification source, ViewEntities.ProductSpecification destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.ProductSpecification();

            return new ViewEntities.ProductSpecification
            {
                Id = source.Id,
                SpecValue = source.SpecValue,
                SpecKey = source.SpecKey,
                ProductId = source.ProductId,
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
