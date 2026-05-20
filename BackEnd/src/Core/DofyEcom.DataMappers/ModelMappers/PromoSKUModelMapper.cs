using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class PromoSKUModelMapper : ITypeConverter<ViewEntities.PromoSKU, DBO.PromoSKU>
    {
        public DBO.PromoSKU Convert(ViewEntities.PromoSKU source, DBO.PromoSKU destination, ResolutionContext context)
        {
            if (source == null) return null;

            return new DBO.PromoSKU
            {
                Id = source.Id,
                PromoId = source.PromoId,
                SkuId = source.SkuId,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
