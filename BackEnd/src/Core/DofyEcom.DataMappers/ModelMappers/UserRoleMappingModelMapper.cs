using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class UserRoleMappingModelMapper : ITypeConverter<ViewEntities.UserRoleMapping, DBO.UserRoleMapping>
    {
         public DBO.UserRoleMapping Convert(ViewEntities.UserRoleMapping source, DBO.UserRoleMapping destination, ResolutionContext context)
    {
        return new DBO.UserRoleMapping
        {
            Id = source?.Id ?? 0,
            UserId = source?.UserId ?? 0,
            RoleId = source?.RoleId ?? 0,
            IsActive = source?.IsActive ?? true,
            DisplayInList = source?.DisplayInList ?? true,
            Created = source?.Created,
            CreatedBy = source?.CreatedBy,
            Modified = source?.Modified,
            ModifiedBy = source?.ModifiedBy
        };
    }
}
}
