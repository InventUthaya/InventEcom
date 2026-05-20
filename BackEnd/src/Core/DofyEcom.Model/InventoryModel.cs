using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.DAL.Interfaces;
using DofyEcom.DBO;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class InventoryModel : BaseModel<DBO.Sku>, IInventoryModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;
        private  ISkuModel _isku;

        public InventoryModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, ISkuModel isku, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
            this._isku = isku;
        }

        public async Task<bool> AdjustStockAsync(UpdateVariantStockRequest request)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@SkuID", request.SkuID);
                parameters.Add("@Delta", request.Delta);
                parameters.Add("@TransactionType", request.TransactionType);
                parameters.Add("@ReferenceID", request.ReferenceID);
                parameters.Add("@Remarks", request.Remarks);
                parameters.Add("@ModifiedBy", request.ModifiedBy);

                var result = this.ExecStoredProcedure<int>("SP_UpdateVariantStock", parameters);

                return result.FirstOrDefault() == 1;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while adjusting stock.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while adjusting stock.", ex);
            }
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
            throw new NotImplementedException();
        }

        public async Task<VariantStockLedgerResponse> GetVariantStockAndLedgerAsync(
            int variantId,
            int page = 1,
            int pageSize = 50)
        {
            try
            {
                // Reuse the SKU fetch method
                List<ViewEntities.Sku> skuList = _isku.GetSKUDetailsByVariantId(variantId);

                if (skuList == null || !skuList.Any())
                    throw new ApplicationException("SKU not found for given VariantID.");

                // Get variant details
                DBO.Sku variant = this.FindItemById(variantId);

                var response = new VariantStockLedgerResponse
                {
                    VariantId = variantId,
                    StockQty = variant?.StockQty ?? 0,
                    Ledger = new List<ViewEntities.StockLedger>()
                };

                // Loop through SKU list and fetch ledger for each SkuID
                foreach (var sku in skuList)
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@SkuID", sku.Id);
                    parameters.Add("@Page", page);
                    parameters.Add("@PageSize", pageSize);

                    var ledger = this.ExecStoredProcedure<ViewEntities.StockLedger>(
                        "SP_GetStockLedger",
                        parameters
                    );

                    if (ledger != null && ledger.Any())
                    {
                        response.Ledger.AddRange(ledger);
                    }
                }

                return response;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while fetching stock ledger.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while fetching stock ledger.", ex);
            }
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
    }
}
