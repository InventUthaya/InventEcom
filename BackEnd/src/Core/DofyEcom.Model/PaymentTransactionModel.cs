using System;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Amazon.Runtime.Internal;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.DAL;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class PaymentTransactionModel : BaseModel<DBO.PaymentTransaction>, IPaymentModel
    {
        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly CountryContext context;
        private readonly IPrincipal iPrincipal;

        public PaymentTransactionModel(
            IOptionsSnapshot<AppConfiguration> iConfig,
            IMapper iMapper,
            IPrincipal iPrincipal = null,
            CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal,
                  GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration),
                  requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.context = requestContext;
            this.iPrincipal = iPrincipal;
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public PaymentTransaction Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<PaymentTransaction> GetList()
        {
            throw new NotImplementedException();
        }

        public async Task<PaymentTransaction?> InitiateRefundAsync(PaymentTransaction request)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@OrderId", request.OrderId);
                parameters.Add("@Amount", request.Amount);
                parameters.Add("@Reason", request.Reason);
                parameters.Add("@CreatedBy", request.CreatedBy);

                var result = await this.ExecStoredProcedureAsync<PaymentTransaction>("SP_InitiateRefund", parameters);

                return result.FirstOrDefault();
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("Database error while processing refund.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Unexpected error while processing refund.", ex);
            }
        }


        public long Post(PaymentTransaction item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(PaymentTransaction item)
        {
            throw new NotImplementedException();
        }

        public long Put(PaymentTransaction item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(PaymentTransaction item)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdatePaymentTransactionAsync(string orderId, int statusId, DateTime? paidOn)
        {
            if (orderId == null) { throw new ArgumentNullException(nameof(orderId)); }

            int orderID = int.Parse(orderId);

            var data = this.FindItem(x => x.OrderId == orderID);

            if (data == null) { return Task.FromResult(false); }

            data.StatusId = statusId;
            data.PaidOn = paidOn;
            this.Update(data);
            return Task.FromResult(true);
        }


        private async Task<dynamic?> GetPaymentByOrderIdAsync(long orderId)
        {

            var order = new OrderHeaderModel(this.config, this.mapper, this.principle, this.context).FindItem(o => o.Id == orderId);
            if (order == null) return null;

            // mimic IsRefundable flag logic
            return new
            {
                StripePaymentIntentId = order,
                UserId = order.UserId,
                IsRefundable = order.StatusId != null && order.StatusId != 99 // example
            };
        }

        private async Task UpdateOrderAfterRefund(long orderId, decimal amount)
        {

            var order = new OrderHeaderModel(this.config, this.mapper, this.principle, this.context).FindItem(o => o.Id == orderId);
            if (order != null)
            {
                order.GrandTotal -= amount;
                order.NetPayable -= amount;
                order.StatusId = 1;

                new OrderHeaderModel(this.config, this.mapper, this.principle, this.context).UpdateItem(order);
            }
        }

        private async Task UpdateReturnRequestStatus(long orderId)
        {
            var rr = this.FindItem(r => r.OrderId == orderId);
            if (rr != null)
            {
                rr.StatusId = 1;
                this.UpdateItem(rr);
            }
        }

        //public async Task LogRefundActivity(long userId, long orderId, string refundId)
        //{
        //    var logModel = new BaseModel<ActivityLog>(
        //        config, mapper, iPrincipal,
        //        GetConnectionString(this.requestContext, config?.Value.DatabaseConfiguration),
        //        requestContext);

        //    var log = new DBO.ActivityLog
        //    {
        //        UserID = userId,
        //        Action = $"Refund processed: {refundId}",
        //        TableName = "OrderHeader",
        //        RecordID = orderId,
        //        ActionDate = DateTime.UtcNow,
        //        IPAddress = "system",
        //        IsActive = true,
        //        DisplayInList = true,
        //        Created = DateTime.UtcNow,
        //        CreatedBy = userId.ToString()
        //    };

        //    await logModel.AddItemAsync(log);
        //}

        public async Task<long> InsertOrderHeaderAsync(DBO.OrderHeader orderHeader)
        {
            if (orderHeader == null)
                throw new ArgumentNullException(nameof(orderHeader));

            orderHeader.Created = DateTime.UtcNow;
            orderHeader.Modified = DateTime.UtcNow;
            orderHeader.IsActive = true;
            orderHeader.DisplayInList = true;

            return new OrderHeaderModel(this.config, this.mapper, this.principle, this.context).AddItem(orderHeader);
        }

        public async Task<long> InsertActivityLogAsync(DBO.ActivityLog log)
        {
            if (log == null)
                throw new ArgumentNullException(nameof(log));

            log.Created = DateTime.UtcNow;
            log.Modified = DateTime.UtcNow;
            log.IsActive = true;
            log.DisplayInList = true;

            //return await logModel.AddItemAsync(log);
            return 0;
        }

        public Task GetPaymentByIdAsync(long paymentId)
        {
            throw new NotImplementedException();
        }
    }

}
