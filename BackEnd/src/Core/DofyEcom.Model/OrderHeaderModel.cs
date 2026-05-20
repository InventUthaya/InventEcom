using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Amazon.Runtime.Internal;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Interfaces.Admin;
using DofyEcom.DBO;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class OrderHeaderModel : BaseModel<DBO.OrderHeader>, IOrderHeaderModel
    {

        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public OrderHeaderModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
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

       
        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateOrderStatus(int orderId, string statusName)
        {
            try
            {
                // Find the order by OrderID
                var order =  this.FindItem(x => x.Id == orderId);
                if (order == null)
                {
                    throw new ApplicationException($"Order with ID {orderId} not found.");
                }

                string Newstatus = statusName.Replace("-", " ");
                var status = new StatusMasterModel(this.config, this.mapper, this.principle, this.context).FindItem(s => s.StatusName.ToLower() == Newstatus.ToLower() && s.StatusType == "ORDER" && s.IsActive == true);

                if (status == null)
                {
                    throw new ApplicationException($"Status '{statusName}' not found in StatusMaster.");
                }

                // Update the order's StatusID
                order.StatusId = (int) status.Id;

                

                // Save the updated order
                this.UpdateItem(order);

                return true;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while updating order status.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating order status.", ex);
            }
        }

        public async Task<bool> CompleteOrderOTP(int orderId)
        {
            try
            {
                var order = this.FindItem(x => x.Id == (long)orderId);
                if (order == null)
                {
                    throw new ApplicationException($"Order with ID {orderId} not found.");
                }

                var userData = new UserLoginModel(this.config, this.mapper, this.principle, this.context).FindItem(u => u.UserId == order.UserId);


                if (userData == null)
                {
                    throw new ApplicationException("user not found.");
                }

                string otp = this.GenerateOtp();
                if (userData != null)
                {

                    var orderOTPModel = new OrderOTPModel(this.config, this.mapper);
                    orderOTPModel.AddOtp(
                        loginId: (int)(int)userData.Id,
                        orderId: (int)order.Id,
                        otp: otp
                    );

                    //var notification = new PendingEmailModel(this.config, this.mapper, (System.Security.Principal.IPrincipal)this.iPrincipal);
                    //notification.LoginOTP((long)validUser.Id, int.Parse(otp));
                }

                return true;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while updating order status.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating order status.", ex);
            }
        }

        public async Task<bool> VerifyOrderOTP(int orderId, string otp)
        {
            try
            {
                var order = this.FindItem(x => x.Id == (long)orderId);
                if (order == null)
                {
                    throw new ApplicationException($"Order with ID {orderId} not found.");
                }

                var userData = new UserLoginModel(this.config, this.mapper, this.principle, this.context).FindItem(u => u.UserId == order.UserId);


                if (userData == null)
                {
                    throw new ApplicationException("user not found.");
                }

                var orderOTPModel = new OrderOTPModel(this.config, this.mapper);
                bool res = orderOTPModel.GetAuthorizationCode(
                        loginId: (int)userData.Id,
                        orderId: (int)order.Id,
                        otp: otp
                    );

                return res;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while updating order status.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating order status.", ex);
            }
        }
        public async Task<IEnumerable<ViewEntities.DashboardStatistics>> GetStatisticsAsync(
     int? partnerId,
     string statusName,
     DateTime? fromDate,
     DateTime? toDate
 )
        {
            var param = new
            {
                PartnerId = partnerId,
                StatusName = statusName,
                FromDate = fromDate,
                ToDate = toDate
            };

            return await ExecStoredProcedureAsync<ViewEntities.DashboardStatistics>(
                Database.SP_GetStaticCount,
                param
            );
        }

        public async Task<IEnumerable<LatestOrderDto>> GetLatestOrdersAsync(
      DateTime? fromDate,
      DateTime? toDate,
      int? partnerId
  )
        {
            return await ExecStoredProcedureAsync<LatestOrderDto>(
                Database.SP_GetLatestOrder,
                new
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    PartnerId = partnerId
                }
            );
        }

        public async Task<TodayOrderDto> GetTodayOrdersAsync(
      DateTime? fromDate = null,
      DateTime? toDate = null,
      int? partnerId = null
  )
        {
            var connectionString = config.Value.DatabaseConfiguration.ConnectionStringIndia;

            using var connection = new SqlConnection(connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@FromDate", fromDate);
            parameters.Add("@ToDate", toDate);
            parameters.Add("@PartnerId", partnerId);

            var result = await connection.QuerySingleOrDefaultAsync<TodayOrderDto>(
                "SP_TodayOrder",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result ?? new TodayOrderDto();
        }

        public async Task<IEnumerable<GraphPathDto>> GetGraphPathAsync(
            int? partnerId,
            string groupBy,
            DateTime? fromDate,
            DateTime? toDate
        )
        {
            var param = new
            {
                PartnerId = partnerId,
                GroupBy = groupBy,
                FromDate = fromDate,
                ToDate = toDate
            };

            return await this.ExecStoredProcedureAsync<GraphPathDto>(
                Database.SP_GetGraphPath,
                param
            );
        }

        byte[] IEntityModel<ViewEntities.OrderHeader>.Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        ViewEntities.OrderHeader IBaseModel<ViewEntities.OrderHeader>.Get(long id)
        {
            throw new NotImplementedException();
        }

        IEnumerable<ViewEntities.OrderHeader> IBaseModel<ViewEntities.OrderHeader>.GetList()
        {
            throw new NotImplementedException();
        }

        long IEntityModel<ViewEntities.OrderHeader>.Post(ViewEntities.OrderHeader item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        long IEntityModel<ViewEntities.OrderHeader>.Post(ViewEntities.OrderHeader item)
        {
            throw new NotImplementedException();
        }

        long IEntityModel<ViewEntities.OrderHeader>.Put(ViewEntities.OrderHeader item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        long IEntityModel<ViewEntities.OrderHeader>.Put(ViewEntities.OrderHeader item)
        {
            throw new NotImplementedException();
        }

        bool IEntityModel<ViewEntities.OrderHeader>.Remove(long id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ViewEntities.DashboardStatistics>> GetDashboardStatisticsAsync()
        {
            var result = await this.ExecStoredProcedureAsync<ViewEntities.DashboardStatistics>(Database.SP_GetDashboardStatistics);
            return result;
        }


        public async Task<bool> UpdateRefundOrderStatus(int orderId)
        {
            try
            {
                var order = this.FindItem(x => x.Id == orderId);
                if (order == null)
                {
                    throw new ApplicationException($"Order with ID {orderId} not found.");
                }
                order.StatusId = DOFYEcomConstants.REFUND_COMPLETED;
                this.UpdateItem(order);

                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating order status.", ex);
            }
        }

        public async Task<bool> UpdateReplacementOrderStatus(int orderId)
        {
            try
            {
                var order = this.FindItem(x => x.Id == orderId);
                if (order == null)
                {
                    throw new ApplicationException($"Order with ID {orderId} not found.");
                }
                order.StatusId = DOFYEcomConstants.REPLACEMENT_COMPLETED;
                this.UpdateItem(order);

                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating order status.", ex);
            }
        }
    }
}
