using AutoMapper;
using System;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class PromoCodeModelMapper : ITypeConverter<ViewEntities.PromoCode, DBO.PromoCode>
    {
        public DBO.PromoCode Convert(ViewEntities.PromoCode source, DBO.PromoCode destination, ResolutionContext context)
        {
            if (source == null) return null;

            return new DBO.PromoCode
            {
                Id = source.Id,
                Code = source.Code,
                Description = source.Description,
                DiscountType = source.DiscountType,
                Value = source.Value,
                StartDate = source.StartDate ?? DateTime.MinValue,
                EndDate = source.EndDate ?? DateTime.MinValue,
                UsageLimit = source.UsageLimit,
                PerUserLimit = source.PerUserLimit,
                UsedCount = source.UsedCount,
                IsActive = source.IsActive,
                Created = source.Created == default ? DateTime.Now : source.Created,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
