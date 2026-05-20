using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public interface IPaymentModel : IEntityModel<PaymentTransaction>
    {
        Task<PaymentTransaction?> InitiateRefundAsync(PaymentTransaction request);

        Task<bool> UpdatePaymentTransactionAsync(string orderId, int statusId, DateTime? paidOn);

        Task GetPaymentByIdAsync(long paymentId);
    }
}
