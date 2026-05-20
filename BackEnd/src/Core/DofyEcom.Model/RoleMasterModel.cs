using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contract;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.DataMappers;
using DofyEcom.DataMappers.EntityMappers;
using DofyEcom.DataMappers.ModelMappers;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class RoleMasterModel : BaseModel<DBO.RoleMaster>, IRoleMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private readonly RoleMasterEntityMapper entityMapper;
        private readonly RoleMasterModelMapper modelMapper;

        public RoleMasterModel(
            IOptionsSnapshot<AppConfiguration> iConfig,
            IMapper iMapper,
            IPrincipal? iPrincipal = null,
            CountryContext requestContext = null)
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

        public ViewEntities.RoleMaster Get(long id)
        {
            var result = this.FindItem(item => item.Id == id && item.IsActive == true);
            if (result is not null)
            {
                return mapper.Map<ViewEntities.RoleMaster>(result);
            }
            return default;
        }

        public IEnumerable<RoleMaster> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            return mapper.Map<IEnumerable<ViewEntities.RoleMaster>>(results);
        }


        /// <summary>
        /// Get all active roles for dropdowns (optimized for user management)
        /// </summary>
        public IEnumerable<RoleMaster> GetActiveRolesForDropdown()
        {
            var results = this.FindItems(item => item.IsActive == true && item.DisplayInList == true)
                           .OrderBy(r => r.RoleName);

            if (results != null && results.Any())
            {
                var viewEntities = new List<ViewEntities.RoleMaster>();
                foreach (var result in results)
                {
                    viewEntities.Add(entityMapper.Convert(result, new ViewEntities.RoleMaster(), null));
                }
                return viewEntities;
            }
            return new List<ViewEntities.RoleMaster>();
        }

        public long Post(RoleMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.RoleMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Post(RoleMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.RoleMaster(), null);
            dboItem.Created = DateTime.Now;
            dboItem.CreatedBy = iPrincipal?.Identity?.Name ?? "System";
            dboItem.IsActive = true;
            dboItem.DisplayInList = true;

            this.AddItem(dboItem);
            return dboItem.Id;
        }

        public long Put(RoleMaster item, IFormFileCollection postedFileCollection)
        {
            var dboItem = modelMapper.Convert(item, new DBO.RoleMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public long Put(RoleMaster item)
        {
            var dboItem = modelMapper.Convert(item, new DBO.RoleMaster(), null);
            dboItem.Modified = DateTime.Now;
            dboItem.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

            this.UpdateItem(dboItem);
            return item.Id;
        }

        public bool Remove(long id)
        {
            var role = this.FindById(id);
            if (role is not null)
            {
                // Don't hard delete roles, just deactivate
                role.IsActive = false;
                role.Modified = DateTime.Now;
                role.ModifiedBy = iPrincipal?.Identity?.Name ?? "System";

                this.UpdateItem(role);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Check if role can be deleted (not used by any user)
        /// </summary>
        public bool CanDeleteRole(long roleId)
        {
            try
            {
                var userRoleMappingModel = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context);
                var activeMappings = userRoleMappingModel.FindItems(urm => urm.RoleId == roleId && urm.IsActive == true);
                return !activeMappings.Any();
            }
            catch
            {
                return false; // If error, assume role is in use
            }
        }

        /// <summary>
        /// Get role name by ID (for display purposes)
        /// </summary>
        public string GetRoleNameById(long roleId)
        {
            var role = this.Get((int)roleId);
            return role?.RoleName ?? "Unknown Role";
        }
    }
}