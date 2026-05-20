using AutoMapper;
using DofyEcom.DBO;
using DofyEcom.ViewEntities;

namespace DofyEcom.DataMappers
{
    public class RoleMasterEntityMapper : ITypeConverter<DBO.RoleMaster, ViewEntities.RoleMaster>
    {
        public ViewEntities.RoleMaster Convert(DBO.RoleMaster source, ViewEntities.RoleMaster destination, ResolutionContext context)
        {

            return new ViewEntities.RoleMaster
            {
                Id = (int)source.Id,
                RoleName = source.RoleName,
                Description = source.Description,
                IsActive = source.IsActive,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
            };
        }
    }
}