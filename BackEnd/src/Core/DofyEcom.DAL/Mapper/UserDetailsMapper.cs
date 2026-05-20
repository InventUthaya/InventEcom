using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using DofyEcom.DAL.Interfaces;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.DAL.Mapper
{
    public class UserDetailsMapper : IMapper<UserDetailsViewModel>
    {
        public UserDetailsViewModel Map(SqlMapper.GridReader reader)
        {
            var userDetails = reader.Read<UserDetailsViewModel>(true);
            UserDetailsViewModel result = new UserDetailsViewModel();
            if (userDetails?.Count() > 0)
            {
                result = userDetails.FirstOrDefault();
                result.UserLogin = reader.Read<UserLoginResponse>(true);
                result.UserRoles = reader.Read<UserRoleResponse>(true);
                result.UserAddresses = reader.Read<UserAddressResponse>(true);
                result.PartnerMaster = reader.Read<PartnerResponse>(true);
            }
            return result;
        }
    }
}
