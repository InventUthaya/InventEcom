using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.Contracts.Requests;
using DofyEcom.Contracts.Responses;
using DofyEcom.Helper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace DofyEcom.Contracts
{
    public interface IOrderDetailModel : IEntityModel<OrderDetail>
    {
        OrderCreateResponse CreateOrder(CreateOrderRequest request);
        IEnumerable<OrderResponseModel> GetOrders(GetOrdersCriteria item);
        Task<GetOrderDetailsViewModel> GetOrderDetails(int orderId);

        Task<List<OrderResponseModel>> GetOrderByCustomerId(int customerId, string? filterType);

        Task<byte[]> GenerateInvoice(int orderId);

        Task<List<ProductImageResponse>> GetImages(int productId, int categoryId);


        Task<bool> CancelOrder(int orderId, string reason);

        Task<bool> UpdateOrderStatusById(UpdateOrderStatusRequest request);

        List<OrderCreateResponse> CreateBulkOrder(List<CreateOrderRequest> requests);

        Task<bool> BulkCancelOrder(List<int> orderIds, string reason);

        bool DeleteOrderById(string orderIds, int customerId);

        EnableReturnButton GetReturnDaysConfig();
        Task<List<long>> AddToCart(AddToCartItemViewModel item);

        UpdateOrderResponse UpdateOrder(UpdateOrderRequest request);

        long AddAddress(UserAddress request);

        Task<PagedList<ShoppingCartItemViewModel>> GetShoppingCartDetails(int customerId);

        Task<long> RemoveCartItem(int cartId);

        Task<long> AddReview(ReviewViewModel model);


    }
}
