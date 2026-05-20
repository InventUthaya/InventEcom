namespace DofyEcom.Model
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Common;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Security.Principal;
    using System.Text;
    using System.Threading.Tasks;
    using AutoMapper;
    using Dapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities.ViewModel;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Options;

    public class ScreenMasterModel : BaseModel<DBO.ScreenMaster>, IScreenMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public ScreenMasterModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public ViewEntities.ScreenMaster Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.ScreenMaster> GetList()
        {

            var results = this.FindItems(item => item.IsActive == true);
            return mapper.Map<IEnumerable<ViewEntities.ScreenMaster>>(results);
        }

        

        public async Task<List<ScreenPermissionViewModel>> GetScreensWithPermissionsAsync()
        {
            using (var connection = new SqlConnection(this.ConnectionString))
            {
                var lookup = new Dictionary<(int RoleId, int ScreenId), ScreenPermissionViewModel>();

                var result = await connection.QueryAsync<ScreenPermissionViewModel, string, ScreenPermissionViewModel>(
                    "SP_GetScreensWithPermissions",
                    (screen, permissionCode) =>
                    {
                        var key = (screen.RoleId, screen.ScreenId);

                        if (!lookup.TryGetValue(key, out var sp))
                        {
                            sp = screen;
                            sp.Permissions = new List<string>();
                            lookup.Add(key, sp);
                        }

                        if (!sp.Permissions.Contains(permissionCode))
                            sp.Permissions.Add(permissionCode);

                        return sp;
                    },
                    splitOn: "PermissionCode",
                    commandType: CommandType.StoredProcedure
                );

                return lookup.Values.ToList();
            }
        }

        public void CreateRolePermission(RolePermissionRequest request)
        {
            var rolepermission = new RolePermissionModel(config, mapper);
        }


        public long Post(ViewEntities.ScreenMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.ScreenMaster item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.ScreenMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.ScreenMaster item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

    }
}
