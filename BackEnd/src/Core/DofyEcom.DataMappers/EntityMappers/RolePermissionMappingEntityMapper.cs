using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers;
public class RolePermissionMappingEntityMapper : ITypeConverter<DBO.RolePermissionMapping, ViewEntities.RolePermissionMapping>
{
    public ViewEntities.RolePermissionMapping Convert(DBO.RolePermissionMapping source, ViewEntities.RolePermissionMapping destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.RolePermissionMapping();

        return new ViewEntities.RolePermissionMapping
        {
            Id = source.Id,
            RoleId = source.RoleId,
            ScreenId = source.ScreenId,
            PermissionId = source.PermissionId,
            DisplayInList = source.DisplayInList,
            IsActive = source.IsActive,
            Created = source.Created,
            CreatedBy = source.CreatedBy,
            Modified = source.Modified,
            ModifiedBy = source.ModifiedBy,
        };
    }
}
