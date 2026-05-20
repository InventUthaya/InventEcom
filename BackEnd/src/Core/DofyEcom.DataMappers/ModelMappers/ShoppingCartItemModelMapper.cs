namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class ShoppingCartItemModelMapper : ITypeConverter<ViewEntities.ShoppingCartItem, DBO.ShoppingCartItem>
    {
        public DBO.ShoppingCartItem Convert(ViewEntities.ShoppingCartItem source, DBO.ShoppingCartItem destination, ResolutionContext context)
        {
            return new DBO.ShoppingCartItem
            {
                Id = source?.Id ?? 0,
                StoreId = source?.StoreId ?? 0,
                ParentItemId = source?.ParentItemId ?? 0,
                BundleItemId = source?.BundleItemId ?? 0,
                CustomerId = source?.CustomerId ?? 0,
                ProductId = source?.ProductId ?? 0,
                AttributesXml = source?.AttributesXml,
                CustomerEnteredPrice = source?.CustomerEnteredPrice ?? 0,
                Quantity = source?.Quantity ?? 0,
                ShoppingCartTypeId = source?.ShoppingCartTypeId ?? 0,
                CreatedOnUtc = source?.CreatedOnUtc ?? DateTime.UtcNow,
                UpdatedOnUtc = source?.UpdatedOnUtc ?? DateTime.UtcNow,
            };
        }
    }
}
