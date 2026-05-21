using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using AutoMapper;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.Extensions.Options;
using DataTables.AspNet.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Model
{
    public class UserAddressModel : BaseModel<DBO.UserAddress>, IUserAddressModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public UserAddressModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public UserAddress Get(long id)
        {
            var result = this.FindItem(item => item.Id == id);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.UserAddress, ViewEntities.UserAddress>(result);
                return mapperResult;
            }
            return default;
        }

        public IEnumerable<UserAddress> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            if (results != null && results.Any())
            {
                return this.mapper.Map<IEnumerable<DBO.UserAddress>, IEnumerable<ViewEntities.UserAddress>>(results);
            }
            return new List<ViewEntities.UserAddress>();
        }

        public IEnumerable<UserAddress> GetByUserId(long userId)
        {
            var result = this.FindItems(item => item.UserId == userId && item.IsActive == true);

            if (result != null && result.Any())
            {
                return this.mapper.Map<IEnumerable<ViewEntities.UserAddress>>(result);
            }

            return new List<ViewEntities.UserAddress>();
        }

        public long Post(UserAddress item, IFormFileCollection postedFileCollection)
        {
            var mapperResult = this.mapper.Map<ViewEntities.UserAddress, DBO.UserAddress>(item);
            this.AddItem(mapperResult);
            return mapperResult.Id;
        }

        public long Post(UserAddress item)
        {
            var mapperResult = this.mapper.Map<ViewEntities.UserAddress, DBO.UserAddress>(item);
            this.AddItem(mapperResult);
            return mapperResult.Id;
        }

        public long Put(UserAddress item, IFormFileCollection postedFileCollection)
        {
            var mappedItem = this.mapper.Map<ViewEntities.UserAddress, DBO.UserAddress>(item);
            this.UpdateItem(mappedItem);
            return item.Id;
        }

        public long Put(UserAddress item)
        {
            if (item.isDefault == 1)
            {
                var existingAddresses = this.FindItems(x =>
                    x.UserId == item.UserId &&
                    x.Id != item.Id &&
                    x.IsActive == true);

                foreach (var address in existingAddresses)
                {
                    address.isDefault = 0;
                    this.UpdateItem(address);
                }
            }
            var mappedItem = this.mapper.Map<ViewEntities.UserAddress, DBO.UserAddress>(item);
            this.UpdateItem(mappedItem);

            return item.Id;
        }

        public bool Remove(long id)
        {
            var address = this.FindById(id);
            if (address is not null)
            {
                address.IsActive = false;
                this.UpdateItem(address);
                return true;
            }
            return false;
        }

        public long AddOrUpdate(UserAddress item)
        {
            // Convert long to int if needed - adjust based on your actual UserAddress property type
            var existing = this.FindItem(ua => ua.UserId == item.UserId && ua.IsActive == true);

            if (existing != null)
            {
                // Update existing - use the correct property name from your UserAddress ViewEntity
                item.Id = existing.Id; // Adjust this to match your UserAddress ID property name
                return this.Put(item);
            }
            else
            {
                // Create new
                return this.Post(item);
            }
        }

        public IActionResult Remove(string id, [FromQuery] string personId)
        {
            throw new NotImplementedException();
        }
    }
}
