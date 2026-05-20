using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.Contracts.Requests;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.Contracts
{
    public interface IUserMasterModel : IEntityModel<UserMaster>
    {
        Task<int> CreateUser(CreateOrUpdateUserRequest request);

        Task<int> UpdateUser(int userId, CreateOrUpdateUserRequest request);
        Task<UserDetailsViewModel> GetUserByIdAsync(int userId);

        DofyEcom.Helper.ContactUsAddress GetAddress();

        Task<long> UpdateUserDetails(int? id, string? userName, string? Email, string? CustomerNumber);

        Task<bool> DeleteUser(int userId, bool isActive);
    }
}
