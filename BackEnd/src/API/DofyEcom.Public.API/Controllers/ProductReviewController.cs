using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DofyEcom.Public.API.Controllers
{
    [Route("api/review")]
    [ApiController]
    public class ProductReviewController : BaseController<IProductReviewModel, ViewEntities.ProductReview>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IProductReviewModel productReviewModel;
        private readonly CountryContext requestContext;
        private IMapper mapper;

        public ProductReviewController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IProductReviewModel productReviewModel, CountryContext requestContext)
            : base(productReviewModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.productReviewModel = productReviewModel;
            this.requestContext = requestContext;
        }


        [HttpPost]
        [Route("GetProductReviews/{productId}")]
        public async Task<IEnumerable<ProductReviewViewModel>> GetProductReviews(int productId)
        {
            return await Task.Run(() =>
            {
                return this.Contract.GetProductReviews(productId);
            });
        }

    }
}
