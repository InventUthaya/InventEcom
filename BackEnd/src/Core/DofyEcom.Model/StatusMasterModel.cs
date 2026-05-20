namespace DofyEcom.Model
{
    using System.Collections.Generic;
    using System.Security.Principal;
    using AutoMapper;
    using DofyEcom.Helper;
    using Microsoft.Extensions.Options;

    public class StatusMasterModel : BaseModel<DBO.StatusMaster>
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public StatusMasterModel(
            IOptionsSnapshot<AppConfiguration> iConfig,
            IMapper iMapper,
            IPrincipal? iPrincipal = null,
            CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal,
                  GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration),
                  requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public IEnumerable<DBO.StatusMaster> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            return results;
        }
    }
}
