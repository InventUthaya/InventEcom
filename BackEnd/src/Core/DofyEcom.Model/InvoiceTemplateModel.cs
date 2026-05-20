namespace DofyEcom.Model
{
    using System.Security.Principal;
    using System.Threading.Tasks;
    using AutoMapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Options;
    using static iText.StyledXmlParser.Jsoup.Select.Evaluator;

    public class InvoiceTemplateModel : BaseModel<DBO.InvoiceTemplate>, IInvoiceTemplateModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private IInvoiceTemplateModel template;

      
        public InvoiceTemplateModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IInvoiceTemplateModel template, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
            this.template = template;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.InvoiceTemplate Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.InvoiceTemplate> GetList()
        {
            throw new NotImplementedException();
        }

        public Task<ViewEntities.InvoiceTemplate> GetTypeByEnum(string EnumName)
        {
            var result = this.FindItem(item => item.EnumName == EnumName);
            if (result is not null)
            {
                var mapperResult = this.mapper.Map<DBO.InvoiceTemplate, ViewEntities.InvoiceTemplate>(result);
                return Task.FromResult(mapperResult);
            }

            return Task.FromResult<ViewEntities.InvoiceTemplate>(null);
        }


        public long Post(ViewEntities.InvoiceTemplate item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.InvoiceTemplate item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.InvoiceTemplate item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.InvoiceTemplate item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
