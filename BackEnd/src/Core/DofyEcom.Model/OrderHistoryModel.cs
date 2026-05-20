namespace DofyEcom.Model
{
    using System;
    using System.Collections.Generic;
    using System.Security.Principal;
    using AutoMapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.ViewEntities;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Options;

    public class OrderHistoryModel : BaseModel<DBO.OrderHistory>, IOrderHistoryModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> iConfig;
        private readonly IMapper mapper;
        protected readonly IPrincipal? iPrinciple;
        private readonly CountryContext context;
        private readonly string defaultOtp;

        public OrderHistoryModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public OrderHistory Get(long id)
        {

            var result = this.FindItem(item => item.OrderId == id && item.IsActive == true);
            if (result is not null)
            {
                return mapper.Map<ViewEntities.OrderHistory>(result);
            }
            return default;
        }
        public IEnumerable<ViewEntities.OrderHistory> GetAllByOrder(long id)
        {
            var result = this.FindItems(item => item.OrderId == id && item.IsActive == true);
            if (result != null && result.Any())
            {
                return mapper.Map<IEnumerable<ViewEntities.OrderHistory>>(result);
            }
            return Enumerable.Empty<ViewEntities.OrderHistory>();
        }





        public void Dispose()
        {
        }

        public long Post(OrderHistory item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(OrderHistory item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(OrderHistory item)
        {
            throw new NotImplementedException();
        }

        public long Put(OrderHistory item)
        {
            throw new NotImplementedException();
        }

        IEnumerable<OrderHistory> IBaseModel<OrderHistory>.GetList()
        {
            throw new NotImplementedException();
        }

        OrderHistory IBaseModel<OrderHistory>.Get(long id)
        {
            throw new NotImplementedException();
        }
    }
}
