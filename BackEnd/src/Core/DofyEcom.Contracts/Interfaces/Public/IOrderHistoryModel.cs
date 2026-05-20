using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public interface IOrderHistoryModel : IEntityModel<OrderHistory>
    {

        IEnumerable<OrderHistory> GetAllByOrder(long id);
    }
}
