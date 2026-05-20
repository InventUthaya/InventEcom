

using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class ProductReviewEntityMapper : ITypeConverter<DBO.ProductReview, ViewEntities.ProductReview>
    {
        public ViewEntities.ProductReview Convert(DBO.ProductReview source, ViewEntities.ProductReview destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.ProductReview();

            return new ViewEntities.ProductReview
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
