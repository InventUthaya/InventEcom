namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class ShoppingCartItemEntityMapper : ITypeConverter<DBO.ShoppingCartItem, ViewEntities.ShoppingCartItem>
    {
        public ViewEntities.ShoppingCartItem Convert(DBO.ShoppingCartItem source, ViewEntities.ShoppingCartItem destination, ResolutionContext context)
        {
            return new ViewEntities.ShoppingCartItem
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
