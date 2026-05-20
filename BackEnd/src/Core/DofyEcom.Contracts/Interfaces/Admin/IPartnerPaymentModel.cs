using DofyEcom.Contracts.Requests;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.SearchCriteria;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.Contracts.Interfaces.Admin
{
    public interface IPartnerPaymentModel : IEntityModel<PartnerPayment>
    {
        Task<IEnumerable<PartnerPaymentResponse>> GetPartnersData(PartnerpaymentSearch request);

        Task<IEnumerable<PartnerByIdResponse>> GetPartnerbyId(PartnerpaymentSearch request);

        Task<IEnumerable<PaymentStates>> paymentStates(PaymentStatusUpdate request);
        

        long updategrouppaymentstatus(PaymentStatusUpdate request);

        long updatepaymentstatus(PaymentStatusUpdate request);

    }
}
