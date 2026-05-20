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

    public class DiscountMasterModel : BaseModel<DBO.DiscountMaster>, IDiscountMasterModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> iConfig;
        private readonly IMapper mapper;
        protected readonly IPrincipal? iPrinciple;
        private readonly CountryContext context;
        private readonly string defaultOtp;

        public DiscountMasterModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
         : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)


        {
            this.iConfig = iConfig;
            this.defaultOtp = this.iConfig.Value.ApplicationConfiguration.DefaultOtp;
            this.mapper = iMapper;
            this.iPrinciple = iPrincipal;
            this.context = requestContext;
        }

        public IEnumerable<ViewEntities.DiscountMaster> GetDiscountList()
        {
            var results = base.ExecViewResult<ViewEntities.DiscountMaster>(Database.VW_Discounts, item => item.Id > 0);

            return results;
        }

        public long Post(DiscountMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(DiscountMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(DiscountMaster item)
        {
            throw new NotImplementedException();
        }

        public long Put(DiscountMaster item)
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

        public IEnumerable<DiscountMaster> GetList()
        {
            throw new NotImplementedException();
        }

        public DiscountMaster Get(long id)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
        }
    }
}
