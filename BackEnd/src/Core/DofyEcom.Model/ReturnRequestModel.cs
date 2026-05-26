using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Amazon.Runtime.Internal;
using AutoMapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces;
using DofyEcom.DBO;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class ReturnRequestModel : BaseModel<DBO.ReturnRequest>, IReturnRequestModel
    {
        private readonly IPrincipal _user;
        private readonly IMapper _mapper;
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly CountryContext context;


        public ReturnRequestModel(
            IOptionsSnapshot<AppConfiguration> config,
            IMapper mapper,
            IPrincipal principal,
            CountryContext context)
            : base(config, mapper, principal,
                  BaseModel<DBO.ReturnRequest>.GetConnectionString(context, config.Value.DatabaseConfiguration),
                  context)
        {
            _user = principal;
            _mapper = mapper;
            this.config = config;
            this.context = context;

        }


        public async Task<IEnumerable<ViewEntities.ReturnRequest>> GetReturnListAsync(RefundFilterRequest filter)
        {
            var statusCsv = filter.StatusId != null
                ? string.Join(",", filter.StatusId)
                : null;

            return await ExecStoredProcedureAsync<ViewEntities.ReturnRequest>(
                "SP_GetReturnList",
                new
                {
                    OrderNumber = filter.OrderNumber,
                    Customer = filter.Customer,
                    StatusId = statusCsv,   
                    OrderDate = filter.OrderDate
                }
            );
        }

        public long UpdateRefund(RefundUpdate data)
        {
            var requestData = this.FindItem(x => x.Id == data.OrderId);

            if (requestData == null)
                return 0;

            requestData.StatusId = DOFYEcomConstants.REFUND_COMPLETED;

            this.UpdateItem(requestData);

            var orderHeaderModel = new OrderHeaderModel(this.config,this.mapper,this._user,this.context);

            orderHeaderModel.UpdateRefundOrderStatus(requestData.OrderId);

            return requestData.Id;
        }

        public long UpdateReplacement(RefundUpdate data)
        {
            var requestData = this.FindItem(x => x.Id == data.OrderId);

            if (requestData == null)
                return 0;

            requestData.StatusId = DOFYEcomConstants.REPLACEMENT_COMPLETED;

            this.UpdateItem(requestData);

            var orderHeaderModel = new OrderHeaderModel(this.config, this.mapper, this._user, this.context);

            orderHeaderModel.UpdateReplacementOrderStatus(requestData.OrderId);

            return requestData.Id;
        }

        


        public async Task<ViewEntities.ReturnRequest?> GetReturnByIdAsync(int id)
        {
            var result = await ExecStoredProcedureAsync<ViewEntities.ReturnRequest>(
                "SP_GetReturnById",
                new { Id = id });

            return result.FirstOrDefault();
        }

        public async Task<bool> DeleteRefundAsync(int id)
        {
            var result = await ExecStoredProcedureAsync<int>(
                "SP_DeleteReturn",
                new { Id = id }
            );

            return result.FirstOrDefault() == 1;
        }

        public async Task<bool> UpdateReturnStatusAsync(
            int orderId,
            int orderDetailId,
            int skuId,
            int returnId,
            int statusId,
            string note,
            decimal? refundAmount = null,
            int? refundPaymentId = null)
        {
            var result = await ExecStoredProcedureAsync<int>(
                "SP_UpdateReturnStatus",
                new
                {
                    OrderId = orderId,
                    OrderdetailId = orderDetailId,
                    SkuId = skuId,
                    ReturnId = returnId,
                    StatusId = statusId,
                    RefundAmount = refundAmount,
                    RefundPaymentId = refundPaymentId,
                    ModifiedBy = _user.Identity?.Name ?? "system"
                });

            return result.FirstOrDefault() == 1;
        }



        public async Task<int> CreateReturnAsync(int orderId, int orderDetailId, int skuId, int userId, string reason, decimal? refundAmount, int partnerId, bool isReturn)
        {
            var result = await ExecStoredProcedureAsync<int>(
                "SP_CreateReturnRequest",
                new
                {
                    OrderId = orderId,
                    OrderDetailId = orderDetailId,
                    SkuId = skuId,
                    UserId = userId,
                    Reason = reason,
                    RefundAmount = refundAmount,
                    PartnerId = partnerId,
                    IsReturn = isReturn,
                    CreatedBy = _user.Identity?.Name ?? "system"
                });
            return result.FirstOrDefault();
        }

        public async Task<ViewEntities.Returns> CreateReturnAsync(ViewEntities.Returns model, string userId)
        {
            var result = await ExecStoredProcedureAsync<DBO.Returns>(
                "SP_CreateReturn",
                new
                {
                    model.OrderId,
                    model.OrderDetailId,
                    model.Reason,
                    //model.Quantity,
                    CreatedBy = userId
                });

            return _mapper.Map<ViewEntities.Returns>(result.FirstOrDefault());
        }

        public async Task<bool> UpdateReturnStatusAsync(int returnId, ViewEntities.Returns model, string adminId)
        {
            var result = await ExecStoredProcedureAsync<int>(
                "SP_UpdateReturnStatus",
                new
                {
                    ReturnId = returnId,
                    Status = model.StatusId,
                    //Note = model.Note,
                    ModifiedBy = adminId
                });

            return result.FirstOrDefault() == 1;
        }

        public async Task<bool> EditReturnAsync(int returnId, string reason, decimal? refundAmount)
        {
            var result = await ExecStoredProcedureAsync<int>(
                "SP_EditReturnRequest",
                new
                {
                    ReturnId = returnId,
                    Reason = reason,
                    RefundAmount = refundAmount,
                    ModifiedBy = _user.Identity?.Name ?? "system"
                });

            return result.FirstOrDefault() == 1;
        }

        public long Post(ViewEntities.Returns item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.Returns item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(ViewEntities.Returns item)
        {
            throw new NotImplementedException();
        }

        public long Put(ViewEntities.Returns item)
        {
            throw new NotImplementedException();
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ViewEntities.Returns> GetList()
        {
            throw new NotImplementedException();
        }

        public ViewEntities.Returns Get(long id)
        {
            throw new NotImplementedException();
        }

        // ---------------- UNUSED CRUD (SAFE RETURNS) --------------------

        //public long Post(ViewEntities.Returns item, IFormFileCollection postedFileCollection) => 0;
        //public long Put(ViewEntities.Returns item, IFormFileCollection postedFileCollection) => 0;
        //public long Post(ViewEntities.Returns item) => 0;
        //public long Put(ViewEntities.Returns item) => 0;
        //public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId) => new byte[0];
        //public bool Remove(long id) => false;
        //public IEnumerable<ViewEntities.Returns> GetList() => Enumerable.Empty<ViewEntities.Returns>();
        //public ViewEntities.Returns Get(long id) => new ViewEntities.Returns();
    }
}
