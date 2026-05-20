using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using DofyEcom.DAL.Interfaces;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.DAL.Mapper
{
    public class ProductDetailsMapper : IMapper<ProductDetailsViewModel>
    {
        public ProductDetailsViewModel Map(SqlMapper.GridReader reader)
        {
            var productDetails = reader.Read<ProductDetailsViewModel>(true);
            ProductDetailsViewModel result = new ProductDetailsViewModel();
            if(productDetails?.Count() > 0)
            {
                result = productDetails.FirstOrDefault();
                result.Variants = reader.Read<ProductVariantResponse>(true);
                result.Specifications = reader.Read<ProductSpecificationResponse>(true);
                result.BoxItems = reader.Read<ProductBoxItemResponse>(true);
                result.ColorImages = reader.Read<ProductColorImageResponse>();
            }
            return result;
        }
    }
}
