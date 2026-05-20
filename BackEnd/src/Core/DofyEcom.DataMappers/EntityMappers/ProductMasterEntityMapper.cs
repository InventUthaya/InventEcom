using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers;


public class ProductMasterEntityMapper : ITypeConverter<DBO.ProductMaster, ViewEntities.ProductMaster>
{
    public ViewEntities.ProductMaster Convert(DBO.ProductMaster source, ViewEntities.ProductMaster destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.ProductMaster();

        return new ViewEntities.ProductMaster
        {
            Id = source.Id,
            ProductName = source.ProductName,
            Description = source.Description,
            CategoryId = source.CategoryId,
            BrandId = source.BrandId,
            SubCategoryId = source.SubCategoryId,
            ItemSubCategoryId = source.ItemSubCategoryId,
            TaxId = source.TaxId,
            StatusId = source.StatusId,
            DisplayInList = source.DisplayInList,
            IsActive = source.IsActive,
            Created = source.Created,
            CreatedBy = source.CreatedBy,
            Modified = source.Modified,
            ModifiedBy = source.ModifiedBy,
            PartnerId = source?.PartnerId ?? null
        };
    }
}
