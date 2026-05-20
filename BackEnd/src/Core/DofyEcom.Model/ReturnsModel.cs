using System;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts.Interfaces;
using DofyEcom.DAL;
using DofyEcom.DBO;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class ReturnsModel : BaseModel<DBO.Returns>, IReturnsModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal? iPrincipal;
        private readonly CountryContext context;

        public ReturnsModel(
            IOptionsSnapshot<AppConfiguration> iConfig,
            IMapper iMapper,
            IPrincipal? iPrincipal = null,
            CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        // ========== USER API ==========
        public async Task<ViewEntities.Returns> CreateReturnAsync(ViewEntities.Returns model, string userId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@OrderID", model.OrderId);
                parameters.Add("@OrderDetailID", model.OrderDetailId);
                parameters.Add("@SkuID", model.SkuId);
                parameters.Add("@UserID", model.UserId);
                parameters.Add("@Reason", model.Reason);
                parameters.Add("@CreatedBy", userId);

                var dboResult = this.ExecStoredProcedure<DBO.Returns>(
                    Database.SP_CreateReturnRequest, parameters).FirstOrDefault();

                // ✅ Map DBO → ViewEntity
                var viewResult = this.mapper.Map<ViewEntities.Returns>(dboResult);

                return await Task.FromResult(viewResult);
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("Database error occurred while creating the return request.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Unexpected error occurred while creating the return request.", ex);
            }
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.Returns Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.Returns> GetList()
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.Returns item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.Returns item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.Returns item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.Returns item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }


        // ========== ADMIN API ==========
        public async Task<bool> UpdateReturnStatusAsync(int returnId, ViewEntities.Returns model, string adminId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@OrderID", model.OrderId);                 // from your model
                parameters.Add("@OrderDetailID", model.OrderDetailId);     // from your model
                parameters.Add("@SkuID", model.SkuId);
                parameters.Add("@ReturnID", returnId);
                parameters.Add("@StatusID", model.StatusId);
                parameters.Add("@RefundAmount", model.RefundAmount);
                parameters.Add("@RefundPaymentID", model.RefundPaymentId);
                parameters.Add("@ModifiedBy", adminId);

                var result = this.ExecStoredProcedure<int>(
                    Database.SP_UpdateReturnStatus, parameters).FirstOrDefault();

                return await Task.FromResult(result == 1);
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException($"Database error occurred while updating status for return ID {returnId}.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Unexpected error occurred while updating return status.", ex);
            }
        }


       
    }
}
