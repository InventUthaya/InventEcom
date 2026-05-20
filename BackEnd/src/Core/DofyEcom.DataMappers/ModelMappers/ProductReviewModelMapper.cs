

using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ProductReviewModelMapper : ITypeConverter<ViewEntities.ProductReview, DBO.ProductReview>
    {
        public DBO.ProductReview Convert(ViewEntities.ProductReview source, DBO.ProductReview destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.ProductReview();

            return new DBO.ProductReview
            {
                Id = source.Id,
                UserId = source.UserId,
                SkuId = source.SkuId,
                Rating = source.Rating,
                ImagePath = source.ImagePath,
                ReviewDate = source.ReviewDate,
                ReviewText = source.ReviewText,
                ReviewDescription = source.ReviewDescription,
                IsActive = source.IsActive,
                Created = source?.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
