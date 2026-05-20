

namespace DofyEcom.ViewEntities
{
    public class UpdateOrderRequest
    {
        public int OrderId { get; set; }
        public int? StatusId { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Pincode { get; set; }

        public int AddressId { get; set; }
    }
}
