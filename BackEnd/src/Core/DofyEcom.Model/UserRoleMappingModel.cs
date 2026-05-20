using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class UserRoleMappingModel : BaseModel<DBO.UserRoleMapping>, IUserRoleMappingModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public UserRoleMappingModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public UserRoleMapping Get(long id)
        {
            var result = this.FindItem(item => item.Id == id);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.UserRoleMapping, ViewEntities.UserRoleMapping>(result);
                return mapperResult;
            }
            return default;
        }

        public IEnumerable<UserRoleMapping> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            if (results != null && results.Any())
            {
                return this.mapper.Map<IEnumerable<DBO.UserRoleMapping>, IEnumerable<ViewEntities.UserRoleMapping>>(results);
            }
            return new List<ViewEntities.UserRoleMapping>();
        }

        public UserRoleMapping GetByUserId(long userId)
        {
            var result = this.FindItem(item => item.Id == userId && item.IsActive == true);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.UserRoleMapping, ViewEntities.UserRoleMapping>(result);
                return mapperResult;
            }
            return new ViewEntities.UserRoleMapping();
        }

        public IEnumerable<UserRoleMapping> GetRolesByUserId(long userId)
        {
            var results = this.FindItems(item => item.Id == userId && item.IsActive == true);
            if (results != null && results.Any())
            {
                return this.mapper.Map<IEnumerable<DBO.UserRoleMapping>, IEnumerable<ViewEntities.UserRoleMapping>>(results);
            }
            return new List<ViewEntities.UserRoleMapping>();
        }

        public long Post(UserRoleMapping item, IFormFileCollection postedFileCollection)
        {
            var mapperResult = this.mapper.Map<ViewEntities.UserRoleMapping, DBO.UserRoleMapping>(item);
            this.AddItem(mapperResult);
            return mapperResult.Id;
        }

        public long Post(UserRoleMapping item)
        {
            var mapperResult = this.mapper.Map<ViewEntities.UserRoleMapping, DBO.UserRoleMapping>(item);
            this.AddItem(mapperResult);
            return mapperResult.Id;
        }

        public long Put(UserRoleMapping item, IFormFileCollection postedFileCollection)
        {
            var mappedItem = this.mapper.Map<ViewEntities.UserRoleMapping, DBO.UserRoleMapping>(item);
            this.UpdateItem(mappedItem);
            return item.Id;
        }

        public long Put(UserRoleMapping item)
        {
            var mappedItem = this.mapper.Map<ViewEntities.UserRoleMapping, DBO.UserRoleMapping>(item);
            this.UpdateItem(mappedItem);
            return item.Id;
        }

        public bool Remove(long id)
        {
            var roleMapping = this.FindById(id);
            if (roleMapping is not null)
            {
                roleMapping.IsActive = false;
                this.UpdateItem(roleMapping);
                return true;
            }
            return false;
        }

        public bool RemoveByUserId(long userId)
        {
            var roleMappings = this.FindItems(rm => rm.Id == userId && rm.IsActive == true);
            if (roleMappings != null && roleMappings.Any())
            {
                foreach (var mapping in roleMappings)
                {
                    mapping.IsActive = false;
                    this.UpdateItem(mapping);
                }
                return true;
            }
            return false;
        }

        public long AddOrUpdate(UserRoleMapping item)
        {
            var existing = this.FindItem(rm => rm.Id == item.Id && rm.Id == item.Id && rm.IsActive == true);

            if (existing != null)
            {
                item.UserId = (int)existing.Id;
                return this.Put(item);
            }
            else
            {
                return this.Post(item);
            }
        }
    }
}
