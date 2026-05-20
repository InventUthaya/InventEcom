using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class PromoSKUEntityMapper : ITypeConverter<DBO.PromoSKU, ViewEntities.PromoSKU>
    {
        public ViewEntities.PromoSKU Convert(DBO.PromoSKU source, ViewEntities.PromoSKU destination, ResolutionContext context)
        {
            if (source == null) return null;

            return new ViewEntities.PromoSKU
            {
                Id = (int)source.Id,
                PromoId = source.PromoId,
                SkuId = source.SkuId,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
