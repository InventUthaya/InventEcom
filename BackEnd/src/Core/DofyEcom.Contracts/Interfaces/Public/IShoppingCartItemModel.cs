namespace DofyEcom.Contracts
{
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;

    public interface IShoppingCartItemModel : IEntityModel<ShoppingCartItem>
    {
        // PagedList<ShoppingCartItemViewModel> GetShoppingCartById(long productId);
        PagedList<ShoppingCartItemViewModel> GetShoppingCartDetails(int customerId);

        IEnumerable<ShoppingCartItem> GetShoppingCartByCustomerId(int customerId);
    }
}
