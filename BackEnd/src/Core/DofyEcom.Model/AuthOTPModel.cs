namespace DofyEcom.Model
{
    using AutoMapper;
    using System;
    using DataTables.AspNet.Core;
    using System.Security.Cryptography;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Options;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using DofyEcom.Model;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities;
    using DofyEcom.Helper.Extensions;
    using System.Security.Principal;
    using Microsoft.Extensions.Caching.Memory;
    using Org.BouncyCastle.Pqc.Crypto.Lms;

    public class AuthOTPModel : BaseModel<DBO.AuthOTP>, IAuthOTPModel, IDisposable
    {
        private readonly IOptionsSnapshot<AppConfiguration> iConfig;
        private readonly IMapper mapper;
        protected readonly IPrincipal? iPrinciple;
        private readonly CountryContext context;
        private readonly string defaultOtp;

        public AuthOTPModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
         : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.iConfig = iConfig;
            this.defaultOtp = this.iConfig.Value.EncryptionConfiguration.IsDefaultPassword
                ? this.iConfig.Value.EncryptionConfiguration.DefaultPassword
                : this.iConfig.Value.ApplicationConfiguration.DefaultOtp;
            this.mapper = iMapper;
            this.iPrinciple = iPrincipal;
            this.context = requestContext;
        }


        public long Post(ViewEntities.AuthOTP item)
        {
            var mapperResult = this.mapper.Map<ViewEntities.AuthOTP, DBO.AuthOTP>(item);
            var result = this.AddItem(mapperResult);

            return mapperResult.Id;
        }

        public bool GetAuthorizationCode(int loginId, string otp)
        {
            if (otp.ToString() == this.defaultOtp)
            {
                return true;
            }

            var latestOtp = this.GetAllItems()
                .Where(item => item.LoginId == loginId && item.OTP == otp)
                .OrderByDescending(item => item.Id) // Assuming Id is incremental
                .FirstOrDefault();

            if (latestOtp != null && latestOtp.ExpiredTime > DateTime.Now)
            {

                return true;
            }
            return false;
        }

        public Task<AuthOTP> Authenticate(string phone)
        {
            throw new NotImplementedException();
        }

        public long Post(AuthOTP item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(AuthOTP item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }



        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<AuthOTP> GetList()
        {
            throw new NotImplementedException();
        }

        public AuthOTP Get(long id)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public long Put(AuthOTP item)
        {
            throw new NotImplementedException();
        }
    }
}
