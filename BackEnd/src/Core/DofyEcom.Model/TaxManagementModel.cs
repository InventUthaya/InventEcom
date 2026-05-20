
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.DAL;
using DofyEcom.DAL;
using DofyEcom.DAL.Interfaces;
using DofyEcom.DBO;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using iText.Commons.Actions.Contexts;
using iText.Layout.Borders;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Org.BouncyCastle.Asn1.Ocsp;

namespace DofyEcom.Model
{
    public class TaxManagementModel : BaseModel<DBO.TaxManagement>, ITaxManagementModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private new readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public TaxManagementModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

        public ViewEntities.TaxManagement Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.TaxManagement> GetList()
        {
            throw new NotImplementedException();
        }

        public TaxPaginationResultViewModel GetTaxListAsync(TaxPaginationRequestViewModel request)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@IsActive", request.IsActive);
                parameters.Add("@SearchText", request.SearchText);
                parameters.Add("@Page", request.Page);
                parameters.Add("@PageSize", request.PageSize);
                parameters.Add("@SortColumn", request.SortColumn);
                parameters.Add("@SortOrder", request.SortOrder);

                var results = this.ExecStoredProcedure<TaxPaginationResponse>(
                    Database.SP_GetTaxList,
                    parameters
                ).ToList();

                int totalRecords = results.FirstOrDefault()?.TotalCount ?? 0;

                return new TaxPaginationResultViewModel
                {
                    Taxes = results,
                    TotalRecords = totalRecords,
                    Page = request.Page,
                    PageSize = request.PageSize,
                    TotalPages = (int)Math.Ceiling((double)totalRecords / request.PageSize)
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error while fetching tax list with pagination.", ex);
            }
        }

        public ViewEntities.TaxManagement GetTaxById(long id)
        {
            var result = this.FindItems(item => item.Id == id && item.IsActive == true)
                             .FirstOrDefault();

            if (result == null)
                return null;

            var mapperResult = this.mapper.Map<DBO.TaxManagement, ViewEntities.TaxManagement>(result);
            return mapperResult;
        }

        public long Post(ViewEntities.TaxManagement item)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@TaxMgmtId", item.Id);
                parameters.Add("@Igst", item.Igst);
                parameters.Add("@Cgst", item.Cgst);
                parameters.Add("@Sgst", item.Sgst);
                parameters.Add("@Tds", item.Tds);
                parameters.Add("@EffectiveStartDate", item.EffectiveStartDate);
                parameters.Add("@EffectiveEndDate", item.EffectiveEndDate);
                parameters.Add("@IsActive", item.IsActive);
                parameters.Add("@DisplayInList", item.DisplayInList);
                parameters.Add("@ModifiedBy", item.ModifiedBy);
                parameters.Add("@CreatedBy", item.CreatedBy);

                var results = this.ExecStoredProcedure<long>(Database.SP_CreateOrUpdateTaxManagement, parameters);
                var productId = results.FirstOrDefault();

                return (int)productId;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while creating the product.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while creating the product.", ex);
            }
        }
        public long Post(ViewEntities.TaxManagement item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.TaxManagement item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.TaxManagement item)
        {
            if (item is not null)
            {
                var mapperResult = this.mapper.Map<ViewEntities.TaxManagement, DBO.TaxManagement>(item);
                this.UpdateItem(mapperResult);
                return mapperResult.Id;
            }

            return default;
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }
    }
}
