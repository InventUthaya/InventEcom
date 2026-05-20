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
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class CommissionSlabDetailsModel : BaseModel<DBO.CommissionSlabDetails>, ICommissionSlabDetailsModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public CommissionSlabDetailsModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal iPrincipal = null, CountryContext requestContext = null)
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

        public CommissionSlabDetails Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<CommissionSlabDetails> GetList()
        {

                var filteredResult =this.FindItems(item => item.IsActive == true);

                var mapperResult = filteredResult.Select(product => this.mapper.Map<DBO.CommissionSlabDetails, ViewEntities.CommissionSlabDetails>(product));

                return mapperResult;

            return Enumerable.Empty<ViewEntities.CommissionSlabDetails>();
        }

        public long Post(CommissionSlabDetails item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(CommissionSlabDetails item)
        {
            throw new NotImplementedException();
        }

        public long Put(CommissionSlabDetails item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(CommissionSlabDetails item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
