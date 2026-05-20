using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class BrandMasterEntityMapper : ITypeConverter<DBO.BrandMaster, ViewEntities.BrandMaster>
    {
        public ViewEntities.BrandMaster Convert(DBO.BrandMaster source, ViewEntities.BrandMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.BrandMaster();

            return new ViewEntities.BrandMaster
            {
                Id = source.Id,
                BrandName = source.BrandName,
                Description = source.Description,
                IsActive = source.IsActive,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy
            };
        }
    }
}