namespace DofyEcom.ViewEntities
{
    public class OrderResponseModel
    {
        public long Id { get; set; }
        public string EncryptedCustomerId { get; set; }
        public string ProductName { get; set; }

        public string AttributeDescription { get; set; }
        public string OrderNumber { get; set; }
        public string CustomerName { get; set; }
        public DateTime Orderdate { get; set; }
        public string StatusName { get; set; }
        public string TotalPrice { get; set; }
        public long OrderStatusId { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public long ZipPostalCode { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public DateTime UpdatedOrderDate { get; set; }
        public decimal? NetPayable { get; set; }
        public long? ProductId { get; set; }
        public string? ImagePath { get; set; }
        public string FormattedMediaFileName { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public int statusId { get; set; }

        public int PartnerId { get; set; }
        public int OrderDetailId { get; set; }
        public int skuId { get; set; }
        public bool IsReturnable { get; set;}
        public bool IsReplacement  { get; set;}
        public int ReturnDays { get; set; }
        public int ReplacementDays { get; set; }
        public int Quantity { get; set; }

        public int TotalCount { get; set; }
    }
}
