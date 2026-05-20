namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class ProductVariantEntityMapper : ITypeConverter<DBO.ProductVariant, ViewEntities.ProductVariant>
    {
        public ViewEntities.ProductVariant Convert(DBO.ProductVariant source, ViewEntities.ProductVariant destination, ResolutionContext context)
        {
            return new ViewEntities.ProductVariant
            {
                Id = source?.Id ?? 0,
                ProductId = source?.ProductId ?? 0,
                GradeId = source?.GradeId,
                ColorId = source?.ColorId,
                RamId = source?.RamId,
                ImagePath = source?.ImagePath,
                StorageId = source?.StorageId,
                Price = source?.Price ?? 0.00m,
                BasePrice = source?.BasePrice ?? 0.00m,
                DiscountPrice = source?.DiscountPrice ?? 0.00m,
                StockQty = source?.StockQty ?? 0,
                reminderQty = source?.reminderQty ?? 0,
                StatusId = source?.StatusId ?? 0,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerId = source?.PartnerId ?? null,
                IsReturnable = source.IsReturnable,
                IsReplacement = source.IsReplacement,
                ReturnDays = source.ReturnDays,
                ReplacementDays = source.ReplacementDays
            };
        }
    }
}
