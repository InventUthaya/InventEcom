using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.Helper.Extensions;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class UserLoginModel : BaseModel<DBO.UserLogin>, IUserLoginModel
    {

        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;


        public UserLoginModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public ViewEntities.UserLogin Get(long id)
        {
            var result = this.FindItem(item => item.Id == id && item.IsActive == true);

            return this.mapper.Map<DBO.UserLogin, ViewEntities.UserLogin>(result);

        }

        //public ViewEntities.UserLogin Get(long id)
        //{
        //    var result = this.FindItem(item => item.Id == id);
        //    if (result is not null)
        //    {
        //        var mapperResult = this.mapper.Map<DBO.Logins, ViewEntities.Logins>(result);
        //        if (!string.IsNullOrEmpty(result?.PassWord) && (!string.IsNullOrEmpty(result?.Salt)) && (!string.IsNullOrEmpty(result?.IVKey)))
        //        {
        //            mapperResult.PassWord = RijndaelSecurityEncryption.DecryptwithRijndael(result.PassWord, result.Salt, result.IVKey);
        //        }

        //        return mapperResult;
        //    }

        //    return default;
        //}

        public IEnumerable<UserLogin> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            if (results != null && results.Any())
            {
                return this.mapper.Map<IEnumerable<DBO.UserLogin>, IEnumerable<ViewEntities.UserLogin>>(results);
            }
            return new List<ViewEntities.UserLogin>();
        }

        public UserLogin GetByUserId(long userId)
        {
            var result = this.FindItem(item => item.UserId == userId && item.IsActive == true);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.UserLogin, ViewEntities.UserLogin>(result);
                return mapperResult;
            }
            return new ViewEntities.UserLogin();
        }

        public UserLogin GetByEmail(string email)
        {
            var result = this.FindItem(item => item.Email == email && item.IsActive == true);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.UserLogin, ViewEntities.UserLogin>(result);
                return mapperResult;
            }
            return default;
        }

        public long Post(UserLogin item, IFormFileCollection postedFileCollection)
        {
            var mapperResult = this.mapper.Map<ViewEntities.UserLogin, DBO.UserLogin>(item);
            this.AddItem(mapperResult);
            return mapperResult.Id;
        }

        public long Post(UserLogin item)
        {
            var mapperResult = this.mapper.Map<ViewEntities.UserLogin, DBO.UserLogin>(item);
            this.AddItem(mapperResult);
            return mapperResult.Id;
        }

        public long Put(UserLogin item, IFormFileCollection postedFileCollection)
        {
            var mappedItem = this.mapper.Map<ViewEntities.UserLogin, DBO.UserLogin>(item);
            this.UpdateItem(mappedItem);
            return item.Id;
        }

        public long Put(UserLogin item)
        {
            var mappedItem = this.mapper.Map<ViewEntities.UserLogin, DBO.UserLogin>(item);
            this.UpdateItem(mappedItem);
            return item.Id;
        }

        public bool Remove(long id)
        {
            var login = this.FindById(id);
            if (login is not null)
            {
                login.IsActive = false;
                this.UpdateItem(login);
                return true;
            }
            return false;
        }

        public long AddOrUpdate(UserLogin item)
        {
            var existing = this.FindItem(ul => ul.UserId == item.UserId && ul.IsActive == true);

            if (existing != null)
            {
                item.Id = (int)existing.Id;
                return this.Put(item);
            }
            else
            {
                return this.Post(item);
            }
        }
    }
}
