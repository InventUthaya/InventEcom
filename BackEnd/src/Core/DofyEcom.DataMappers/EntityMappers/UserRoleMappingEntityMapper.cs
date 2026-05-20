using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class UserRoleMappingEntityMapper : ITypeConverter<DBO.UserRoleMapping, ViewEntities.UserRoleMapping>
    {

        public ViewEntities.UserRoleMapping Convert(DBO.UserRoleMapping source, ViewEntities.UserRoleMapping destination, ResolutionContext context)
        {
            return new ViewEntities.UserRoleMapping
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
