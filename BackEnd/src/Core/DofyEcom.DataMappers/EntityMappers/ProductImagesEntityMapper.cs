using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers;
public class ProductImagesEntityMapper : ITypeConverter<DBO.ProductImages, ViewEntities.ProductImages>
{
    public ViewEntities.ProductImages Convert(DBO.ProductImages source, ViewEntities.ProductImages destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.ProductImages();

        return new ViewEntities.ProductImages
        {
            Id = source?.Id ?? 0,
            ProductId = source?.ProductId ?? 0,
            ColorId = source?.ColorId ?? 0,
            ImagePath = source?.ImagePath ?? "",
            IsActive = source?.IsActive ?? false,
            Created = source?.Created,
            CreatedBy = source?.CreatedBy,
            Modified = source?.Modified,
            ModifiedBy = source?.ModifiedBy,
            PartnerId = source?.PartnerId ?? null
        };
    }
}
