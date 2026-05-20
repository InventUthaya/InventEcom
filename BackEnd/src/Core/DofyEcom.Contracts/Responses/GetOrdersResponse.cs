using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.Contracts.Responses
{
    
    public class OrderResponse
    {
        public int Id { get; set; }

        public int UserID { get; set; }

        public string FullName { get; set; }

        public DateTime OrderDate { get; set; }

        public int StatusID { get; set; }

        public string StatusName { get; set; }

        public decimal NetPayable { get; set; }
    }

    // Collection response class for the list of orders
    public class GetOrdersResponse
    {
        public List<OrderResponse> Orders { get; set; } = new List<OrderResponse>();
    }
}
