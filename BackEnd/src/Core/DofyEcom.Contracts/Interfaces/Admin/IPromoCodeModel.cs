using System.Collections.Generic;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public interface IPromoCodeModel : IEntityModel<PromoCode>
    {
        Task<(IEnumerable<PromoCode> Data, int TotalCount)> GetPromoCodeListAsync(int page = 1, int pageSize = 20, string searchText = null, string sortColumn = "Created", string sortOrder = "DESC", bool? isActive = null, int? partnerId = null);
        Task<PromoCode> GetPromoByIdAsync(int id);
        Task<int> SavePromoAsync(PromoCode promo, IEnumerable<int> skuIds = null);
        Task<bool> HidePromoAsync(int id); // set IsActive = false
        //Task<IEnumerable<PromoSKU>> GetSKUsByPromoAsync(int promoId);
        //Task<bool> AssignSKUsToPromoAsync(int promoId, IEnumerable<int> skuIds);


        Task<ViewEntities.PromoCode> GetAvailablePromoCode(int customerId, string promoCode);

    }
}
