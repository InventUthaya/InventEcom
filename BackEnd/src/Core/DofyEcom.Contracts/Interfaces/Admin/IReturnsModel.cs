using System.Collections.Generic;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts.Interfaces
{
    public interface IReturnsModel : IEntityModel<Returns>
    {
        //Task<IEnumerable<ReturnRequest>> GetReturnListAsync(RefundFilterRequest filter);

        Task<Returns> CreateReturnAsync(Returns model, string userId);
        Task<bool> UpdateReturnStatusAsync(int returnId, Returns model, string adminId);
    }
}