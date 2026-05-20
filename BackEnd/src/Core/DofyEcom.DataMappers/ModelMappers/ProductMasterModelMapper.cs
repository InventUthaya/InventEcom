using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ProductMasterModelMapper : ITypeConverter<ViewEntities.ProductMaster, DBO.ProductMaster>
    {
        public DBO.ProductMaster Convert(ViewEntities.ProductMaster source, DBO.ProductMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.ProductMaster();

            return new DBO.ProductMaster
            {
                Id = source?.Id ?? 0,
                ProductName = source?.ProductName,
                Description = source?.Description,
                CategoryId = source?.CategoryId ?? 0,
                BrandId = source?.BrandId ?? 0,
                TaxId = source?.TaxId ?? 0,
                SubCategoryId = source?.SubCategoryId ?? 0,
                ItemSubCategoryId = source?.ItemSubCategoryId ?? 0,
                StatusId = source?.StatusId ?? 0,
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
