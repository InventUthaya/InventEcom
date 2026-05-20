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
    public class OrderAddressModel : BaseModel<DBO.OrderDetail>, IOrderAddressModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;


        public OrderAddressModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public OrderAddress Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<OrderAddress> GetList()
        {
            throw new NotImplementedException();
        }

        public long Post(OrderAddress item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(OrderAddress item)
        {
            throw new NotImplementedException();
        }

        public long Put(OrderAddress item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(OrderAddress item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
