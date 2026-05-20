namespace DofyEcom.DataMappers.EntityMappers
{
    using AutoMapper;

    public class PartnerPaymentEntityMapper : ITypeConverter<DBO.PartnerPayment, ViewEntities.PartnerPayment>
    {
        public ViewEntities.PartnerPayment Convert(DBO.PartnerPayment source, ViewEntities.PartnerPayment destination, ResolutionContext context)
        {
            return new ViewEntities.PartnerPayment
            {
                Id = source?.Id ?? 0,
                PartnerId = source?.PartnerId ?? 0,
                CommissionAmount = source.CommissionAmount,
                CommissionPercentage = source.CommissionPercentage,
                UserId = source?.UserId ?? 0,
                AddressId = source?.AddressId ?? 0,
                OrderDate = source?.OrderDate,
                OrderNumber = source.OrderNumber,
                StatusId = source?.StatusId ?? 0,
                PromoId = source?.PromoId,
                ProductTotal = source?.ProductTotal ?? 0,
                ProductTaxTotal = source?.ProductTaxTotal ?? 0,
                GrandTotal = source?.GrandTotal ?? 0,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerAmount = source.PartnerAmount,
                SkuId = source.SkuId,
                BasePrice = source.BasePrice,
                TaxRate = source.TaxRate,
                paymentDone = source.paymentDone
            };
        }
    }
}

