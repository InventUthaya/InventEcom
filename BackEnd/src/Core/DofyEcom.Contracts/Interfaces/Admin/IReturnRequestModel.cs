using System.Collections.Generic;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Contracts.Interfaces
{
    public interface IReturnRequestModel : IEntityModel<Returns>
    {
        Task<IEnumerable<ReturnRequest>> GetReturnListAsync(RefundFilterRequest filter);

        long UpdateRefund(RefundUpdate data);

        long UpdateReplacement(RefundUpdate data);


        Task<ReturnRequest?> GetReturnByIdAsync(int id);

        Task<bool> UpdateReturnStatusAsync(
            int orderId,
            int orderDetailId,
            int skuId,
            int returnId,
            int statusId,
            string note,
            decimal? refundAmount = null,
            int? refundPaymentId = null
        );
        Task<bool> DeleteRefundAsync(int id);
        Task<int> CreateReturnAsync(int orderId, int orderDetailId, int skuId, int userId, string reason, decimal? refundAmount, int partnerId, bool isReturn);
        Task<bool> EditReturnAsync(int returnId, string reason, decimal? refundAmount);

        //Task<ReturnRequest?> GetReturnByIdAsync(int id);


    }
}