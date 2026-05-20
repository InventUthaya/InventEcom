using System.Collections.Generic;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Contracts.Interfaces.Admin
{
    public interface IUserAddressModel : IEntityModel<UserAddress>
    {

        IEnumerable<UserAddress> GetByUserId(long userId);

    }
}
