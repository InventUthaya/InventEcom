using AutoMapper;
using System;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class PromoCodeEntityMapper : ITypeConverter<DBO.PromoCode, ViewEntities.PromoCode>
    {
        public ViewEntities.PromoCode Convert(DBO.PromoCode source, ViewEntities.PromoCode destination, ResolutionContext context)
        {
            if (source == null) return null;

            return new ViewEntities.PromoCode
            {
                Id = (int)source.Id,
                Code = source.Code,
                Description = source.Description,
                DiscountType = source.DiscountType,
                Value = source.Value,
                StartDate = source.StartDate,
                EndDate = source.EndDate,

                UsageLimit = source.UsageLimit,
                PerUserLimit = source.PerUserLimit,
                UsedCount = source.UsedCount,

                IsActive = source.IsActive,

                Created = source.Created ?? null,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
