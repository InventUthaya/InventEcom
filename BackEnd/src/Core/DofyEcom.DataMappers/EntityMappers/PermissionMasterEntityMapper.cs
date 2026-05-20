
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers;


public class PermissionMasterEntityMapper : ITypeConverter<DBO.PermissionMaster, ViewEntities.PermissionMaster>
{
    public ViewEntities.PermissionMaster Convert(DBO.PermissionMaster source, ViewEntities.PermissionMaster destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.PermissionMaster();

        return new ViewEntities.PermissionMaster
        {
            Id =source.Id,
            PermissionName = source.PermissionName,
            PermissionCode = source.PermissionCode,
            DisplayInList = source.DisplayInList,
            IsActive = source.IsActive,
            Created = source?.Created,
            CreatedBy = source.CreatedBy,
            Modified = source.Modified,
            ModifiedBy = source.ModifiedBy
        };
    }
}
