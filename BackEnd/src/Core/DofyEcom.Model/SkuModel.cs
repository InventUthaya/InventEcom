using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.DAL.Interfaces;
using DofyEcom.DBO;
using DofyEcom.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class SkuModel : BaseModel<DBO.Sku>, ISkuModel
    {

        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public SkuModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public ViewEntities.Sku Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.Sku> GetList()
        {
            var result = this.GetAllItems();

            if (result is not null)
            {
                var filteredResult = result.Where(item => item.IsActive == true);

                var mapperResult = filteredResult.Select(sku => this.mapper.Map<DBO.Sku, ViewEntities.Sku>(sku));

                return mapperResult;
            }

            return Enumerable.Empty<ViewEntities.Sku>();
        }

        public List<ViewEntities.Sku> GetSKUDetailsByVariantId(int variantId)
        {
            List<ViewEntities.Sku> data = (List<ViewEntities.Sku>)this.FindItems(x => x.VariantId == variantId);
            return data;


        }

        public long Post(ViewEntities.Sku item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.Sku item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.Sku item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.Sku item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
        public List<ViewEntities.Sku> GetProductImage(int productId)
        {
            var dboData = this.FindItems(x => x.ProductId == productId).ToList();

            var viewData = this.mapper.Map<List<ViewEntities.Sku>>(dboData);

            return viewData;
        }


    }
}
