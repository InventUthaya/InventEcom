using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class GradeMasterEntityMapper : ITypeConverter<DBO.GradeMaster, ViewEntities.GradeMaster>
    {
        public ViewEntities.GradeMaster Convert(DBO.GradeMaster source, ViewEntities.GradeMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.GradeMaster();

            return new ViewEntities.GradeMaster
            {
                Id = source.Id,
                GradeName = source.GradeName,
                Description = source.Description,
                IsActive = source.IsActive,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}