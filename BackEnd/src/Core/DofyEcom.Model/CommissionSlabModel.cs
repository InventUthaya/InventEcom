

using System.Security.Principal;
using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class CommissionSlabModel : BaseModel<DBO.CommissionSlab>, ICommissionSlabModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public CommissionSlabModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal iPrincipal = null, CountryContext requestContext = null)
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

        public CommissionSlab Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<CommissionSlab> GetList()
        {
            throw new NotImplementedException();
        }

        public long Post(CommissionSlab item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(CommissionSlab item)
        {
            throw new NotImplementedException();
        }

        public long Put(CommissionSlab item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(CommissionSlab item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
