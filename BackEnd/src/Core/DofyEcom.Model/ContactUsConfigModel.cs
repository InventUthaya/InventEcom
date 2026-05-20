namespace DofyEcom.Model
{
    using System.Security.Principal;
    using AutoMapper;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using Microsoft.Extensions.Options;

    public class ContactUsConfigModel : BaseModel<DBO.ContactUsConfig>, IContactUsConfigModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public ContactUsConfigModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal iPrincipal = null, CountryContext requestContext = null)
           : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public ViewEntities.ContactUsConfig Get(long id)
        {
            var result = this.FindItem(item => item.Id == id);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.ContactUsConfig, ViewEntities.ContactUsConfig>(result);

                return mapperResult;
            }

            return default;
        }

        public ViewEntities.ContactUsConfig GetContactUsConfig(int id)
        {
            var result = this.FindItem(item => item.Id == id);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.ContactUsConfig, ViewEntities.ContactUsConfig>(result);

                return mapperResult;
            }

            return default;
        }

        public IEnumerable<ViewEntities.ContactUsConfig> GetList()
        {
            var results = this.FindItems(item => item.Published == true);
            var mapperResults = this.mapper.Map<IEnumerable<DBO.ContactUsConfig>, IEnumerable<ViewEntities.ContactUsConfig>>(results);

            return mapperResults;
        }

        public ViewEntities.ContactUsConfig GeAlltList()
        {
            var results = this.FindItem(item => item.Published == true);
            var mapperResults = this.mapper.Map<DBO.ContactUsConfig, ViewEntities.ContactUsConfig>(results);

            return mapperResults;
        }
    }
}
