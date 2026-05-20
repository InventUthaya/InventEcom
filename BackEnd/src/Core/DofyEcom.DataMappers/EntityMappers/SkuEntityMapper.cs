namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class SKUEntityMapper : ITypeConverter<DBO.Sku, ViewEntities.Sku>
    {
        public ViewEntities.Sku Convert(DBO.Sku source, ViewEntities.Sku destination, ResolutionContext context)
        {
            return new ViewEntities.Sku
            {
                Id = source?.Id ?? 0,
                ProductId = source?.ProductId ?? 0,
                VariantId = source.VariantId,
                SkuCode = source?.SkuCode,
                Barcode = source?.Barcode,
                ImagePath = source?.ImagePath,
                MRP = source?.MRP ?? 0.00m,
                SellingPrice = source?.SellingPrice ?? 0.00m,
                StockQty = source?.StockQty ?? 0,
                StatusId = source?.StatusId ?? 0,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}