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
    public class PartnerMasterModel : BaseModel<DBO.PartnerMaster>, IPartnerMaster
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public PartnerMasterModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public PartnerMaster Get(long id)
        {
            throw new NotImplementedException();
        }

        //public IEnumerable<PartnerMaster> GetList()
        //{
        //    throw new NotImplementedException();
        //}

        public long Post(PartnerMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(PartnerMaster item)
        {
            throw new NotImplementedException();
        }

        public long Put(PartnerMaster item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(PartnerMaster item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<PartnerMaster>GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            return mapper.Map<IEnumerable<ViewEntities.PartnerMaster>>(results); 
        }
    }
}
