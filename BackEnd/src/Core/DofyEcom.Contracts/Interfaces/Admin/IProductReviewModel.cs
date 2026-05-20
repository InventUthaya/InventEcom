

using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.Contracts
{
    public interface IProductReviewModel : IEntityModel<ProductReview>
    {
        IEnumerable<ProductReviewViewModel> GetProductReviews(int productId);

    }
}
