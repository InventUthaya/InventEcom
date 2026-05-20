using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.Contracts.Responses
{
    public class OrderCreateResponse
    {
        public string? OrderNumber { get; set; }
        public int CreatedOrderId { get; set; }
        public string Message { get; set; }
        public bool Success { get; set; }
    }
}
