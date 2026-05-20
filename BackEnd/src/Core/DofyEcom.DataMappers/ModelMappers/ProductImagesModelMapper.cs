using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ProductImagesModelMapper : ITypeConverter<ViewEntities.ProductImages, DBO.ProductImages>
    {
        public DBO.ProductImages Convert(ViewEntities.ProductImages source, DBO.ProductImages destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.ProductImages();

            return new DBO.ProductImages
            {
                Id = source?.Id ?? 0,
                ProductId = source?.ProductId ?? 0,
                ColorId = source?.ColorId ?? 0,
                ImagePath = source?.ImagePath ?? "",
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
