using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class CartMasterEntityMapper : ITypeConverter<DBO.Cart, ViewEntities.Cart>
    {
        public ViewEntities.Cart Convert(DBO.Cart source, ViewEntities.Cart destination, ResolutionContext context)
        {
            return new ViewEntities.Cart
            {
                Id = source?.Id ?? 0,
                UserId = source?.UserId ?? 0,
                SkuId = source?.SkuId ?? 0,
                Quantity = source?.Quantity ?? 0,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null

            };
        }
    }
}
