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

    public class OrderOTPModel : BaseModel<DBO.OrderOTP>
    {
        private readonly IOptionsSnapshot<AppConfiguration> iConfig;
        private readonly IMapper mapper;
        protected readonly IPrincipal? iPrinciple;
        private readonly CountryContext context;
        private readonly string defaultOtp;

        public OrderOTPModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
         : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)


        {
            this.iConfig = iConfig;
            this.mapper = iMapper;
            this.iPrinciple = iPrincipal;
            this.context = requestContext;
            this.defaultOtp = this.iConfig.Value.ApplicationConfiguration.DefaultOtp;
        }

        public long AddOtp(int loginId,int orderId, string otp)
        {
            var validOtp = this.FindItem(item =>
            item.LoginId == loginId &&
            item.OrderId == orderId &&
             item.IsActive == true &&
            item.IsVerified == false);

            if (validOtp != null)
            {
                validOtp.IsActive = false;
                this.Update(validOtp);
            }

            var now = DateTime.Now;


            var orderOTP = new DBO.OrderOTP
            {
                LoginId = loginId,
                OrderId = orderId,
                OTP = otp,
                IsVerified = false,
                Created = now,
                CreatedBy = "1",
                GeneratedTime = now,
                ExpiredTime = now.AddMinutes(5),
                IsActive = true,
            };

            return this.Add(orderOTP);
        }

        public bool GetAuthorizationCode(int loginId,int orderId, string otp)
        {
            if (otp.ToString() == this.defaultOtp)
            {
                return true;
            }

            var validOtp = this.FindItem(item =>
                item.LoginId == loginId &&
                (item.OTP == otp) &&
                item.OrderId == orderId &&
                item.IsActive == true &&
                item.IsVerified == false);

            if (validOtp != null && validOtp.ExpiredTime > DateTime.Now)
            {

                validOtp.IsVerified = true;
                this.Update(validOtp);
                return true;
            }

            return false;
        }


    }
}
