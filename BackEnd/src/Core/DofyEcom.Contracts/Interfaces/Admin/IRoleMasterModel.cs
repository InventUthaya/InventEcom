using System.Collections.Generic;
using System.Threading.Tasks;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;

namespace DofyEcom.Contract
{
    public interface IRoleMasterModel : IEntityModel<RoleMaster>
    {
        byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId);
        ViewEntities.RoleMaster Get(long id);
        IEnumerable<RoleMaster> GetList();
        IEnumerable<RoleMaster> GetActiveRolesForDropdown();
       
    }
}