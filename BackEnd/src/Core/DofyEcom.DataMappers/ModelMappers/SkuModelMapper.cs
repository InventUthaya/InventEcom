namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class SKUModelMapper : ITypeConverter<ViewEntities.Sku, DBO.Sku>
    {
        public DBO.Sku Convert(ViewEntities.Sku source, DofyEcom.DBO.Sku destination, ResolutionContext context)
        {
            return new DBO.Sku
            {
                Id = source?.Id ?? 0,
                ProductId = source?.ProductId ?? 0,
                VariantId = source.VariantId,
                SkuCode = source?.SkuCode,
                Barcode = source?.Barcode,
                ImagePath = source?.ImagePath,
                MRP = source?.MRP ?? 0,
                SellingPrice = source?.SellingPrice ?? 0,
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
