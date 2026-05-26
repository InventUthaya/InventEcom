using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities.ViewModel
{
    public class GetOrderDetailsViewModel
    {
        public OrderHeaderDto OrderHeader { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; } = new();
        public List<ProductDetailDto> ProductDetails { get; set; } = new();
        public List<OrderChargeDto> Charges { get; set; } = new();
        public List<PaymentTransactionDto> Payments { get; set; } = new();
        public List<OrderStatusHistoryDto> StatusHistory { get; set; } = new();
        public List<OrderTrack> OrderTrack { get; set; } = new();
           public List<BillingTrack>BillingTrack{ get; set; } = new();

    }

    public class OrderHeaderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string OrderNumber { get; set; }
        public int? AddressId { get; set; }
        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PinCode { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal ProductTotal { get; set; }
        public decimal ProductTaxTotal { get; set; }
        public decimal ChargeTotal { get; set; }
        public decimal ChargeTaxTotal { get; set; }
        public decimal DiscountTotal { get; set; }
        public decimal NetPayable { get; set; }
        public string OrderStatus { get; set; }

        public DateTime? Modified { get; set; }
        public DateTime Created { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }
        public string? StatusId { get; set; }
        public string? PromoCode { get; set; }
        public string? PromoType { get; set; }
        public decimal? PromoValue { get; set; }
    }

    public class OrderDetailDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int SkuId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }

        public string? ImagePath { get; set; }
        public bool IsFreeItem { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Modified { get; set; }
    }

    public class ProductDetailDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? BrandId { get; set; }
        public string BrandName { get; set; }
        public string RamSize { get; set; }
        public string ColorName { get; set; }
        public decimal BasePrice { get; set; }
        public decimal DiscountPrice { get; set; }
        public int? TaxId { get; set; }
        public decimal? TaxRate { get; set; }
        public int StatusId { get; set; }
        public string ProductStatus { get; set; }
    }

    public class OrderChargeDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string ChargeName { get; set; }
        public decimal Amount { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class PaymentTransactionDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionRef { get; set; }
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime PaidOn { get; set; }
    }

    public class OrderStatusHistoryDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int NewStatusId { get; set; }
        public string NewStatusName { get; set; }
        public string ChangedBy { get; set; }
        public DateTime ChangedOn { get; set; }
        public string Note { get; set; }
    }

    public class OrderTrack
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int NewStatusId { get; set; }
        public string StatusName { get; set; }
        public string NewStatusName { get; set; }
        public string ChangedBy { get; set; }
        public DateTime ChangedOn { get; set; }
        public string Note { get; set; }
    }

    public class BillingTrack
    {
        public int Id { get; set; }
        public string Description { get; set; }
        
    }
}
