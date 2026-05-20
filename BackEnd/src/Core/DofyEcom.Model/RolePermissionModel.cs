
namespace DofyEcom.Model
{
    using System.Security.Principal;
    using AutoMapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities;
    using DofyEcom.ViewEntities.ViewModel;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Options;


    public class RolePermissionModel : BaseModel<DBO.RolePermissionMapping>, IRolePermissionModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public RolePermissionModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.RolePermissionMapping Get(long id)
        {
            throw new NotImplementedException();

        }

        public IEnumerable<ViewEntities.RolePermissionMapping> GetByRoleId(int RoleId)
        {
            var results = this.FindItems(item => item.IsActive == true && item.RoleId == RoleId);
            return mapper.Map<IEnumerable<ViewEntities.RolePermissionMapping>>(results);
        }

        public IEnumerable<ViewEntities.RolePermissionMapping> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            return mapper.Map<IEnumerable<ViewEntities.RolePermissionMapping>>(results);
        }



        public long Post(ViewEntities.RolePermissionMapping item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long CreateRolePermission(RolePermissionUpdateRequest item)
        {
            if (item == null || item.updates == null || !item.updates.Any())
                return 0;

            long updatedCount = 0;

            foreach (var update in item.updates.DistinctBy(x => x.ScreenId))
            {
                var existing = this.FindItem(x =>
                    x.RoleId == item.roleId &&
                    x.ScreenId == update.ScreenId
                );

                if (existing != null)
                {
                    existing.IsActive = update.IsActive;
                    existing.Modified = DateTime.UtcNow;

                    this.UpdateItem(existing);
                    updatedCount++;
                }
                // ❌ No insert if record not found
            }

            return updatedCount;
        }


        public long Put(ViewEntities.RolePermissionMapping item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.RolePermissionMapping item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public long CreateRolePermission(RolePermissionRequest request)
        {
            throw new NotImplementedException();
        }

        public long Post(RolePermissionMapping item)
        {
            throw new NotImplementedException();
        }
    }
}
