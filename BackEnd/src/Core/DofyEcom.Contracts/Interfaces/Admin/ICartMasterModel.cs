namespace DofyEcom.Contracts
{
    using DofyEcom.ViewEntities;

    public interface ICartMasterModel : IEntityModel<Cart>
    {
        IEnumerable<Cart> GetActiveCartAsync(int userId);

        Task<long> AddToCart(Cart item);

        Task<Cart> UpdateCartItemAsync(Cart item);

    }
}
