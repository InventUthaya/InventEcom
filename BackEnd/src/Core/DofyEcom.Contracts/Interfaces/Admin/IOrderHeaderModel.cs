
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Contracts.Interfaces.Admin
{
    public interface IOrderHeaderModel : IEntityModel<OrderHeader>
    {
        Task<bool> UpdateOrderStatus(int orderId, string statusName);

        Task<bool> CompleteOrderOTP(int orderId);
        Task<IEnumerable<LatestOrderDto>> GetLatestOrdersAsync(
        DateTime? fromDate,
        DateTime? toDate,
        int? partnerId
    );

        Task<bool> VerifyOrderOTP(int orderId, string otp);
        Task<IEnumerable<GraphPathDto>> GetGraphPathAsync(
       int? partnerId,
       string groupBy,
       DateTime? fromDate,
       DateTime? toDate
   );

        Task<TodayOrderDto> GetTodayOrdersAsync(
    DateTime? fromDate = null,
    DateTime? toDate = null,
    int? partnerId = null
);

        Task<IEnumerable<ViewEntities.DashboardStatistics>> GetDashboardStatisticsAsync();
        Task<IEnumerable<ViewEntities.DashboardStatistics>> GetStatisticsAsync(
     int? partnerId,
     string statusName,
     DateTime? fromDate,
     DateTime? toDate
 );

    }
}
