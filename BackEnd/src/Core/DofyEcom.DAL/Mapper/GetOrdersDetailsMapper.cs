using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using DofyEcom.DAL.Interfaces;
using DofyEcom.DBO;
using DofyEcom.ViewEntities.ViewModel;

namespace DofyEcom.DAL.Mapper
{
    public class GetOrdersDetailsMapper : IMapper<GetOrderDetailsViewModel>
    {
        public GetOrderDetailsViewModel Map(SqlMapper.GridReader reader)
        {
            var header = reader.Read<OrderHeaderDto>(true).FirstOrDefault();

            var result = new GetOrderDetailsViewModel
            {
                OrderHeader = header,
                OrderDetails = reader.Read<OrderDetailDto>(true).ToList(),
                ProductDetails = reader.Read<ProductDetailDto>(true).ToList(),
                Charges = reader.Read<OrderChargeDto>(true).ToList(),
                Payments = reader.Read<PaymentTransactionDto>(true).ToList(),
                StatusHistory = reader.Read<OrderStatusHistoryDto>(true).ToList(),
                OrderTrack = reader.Read<OrderTrack>(true).ToList(),
                BillingTrack = reader.Read<BillingTrack>(true).ToList(),

                
            };

            return result;
        }
    }

}
