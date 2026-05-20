using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.Contracts.Interfaces.Admin
{
    public interface IRiderAssignmentModel : IEntityModel<RiderAssignment>
    {
        Task<long> AssignOrderToRiderOrCourierAsync(RiderAssignment request);

        Task<RiderDetailViewModel> GetAssignmentsByRiderIdAsync(long riderId);

        Task<IEnumerable<GetAllRiderViewModel>> GetAssignmentsByAllRidersAsync();

        Task<bool> AssignRiderToOrderAsync(long riderId, long orderDetailId);

        Task<ManagementUserViewModel> GetAllManagementUsersAsync(UserPaginationRequestViewModel request);
    }
}
