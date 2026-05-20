using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class RolePermissionMappingModelMapper : ITypeConverter<ViewEntities.RolePermissionMapping, DBO.RolePermissionMapping>
    {
        public DBO.RolePermissionMapping Convert(ViewEntities.RolePermissionMapping source, DBO.RolePermissionMapping destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.RolePermissionMapping();

            return new DBO.RolePermissionMapping
            {
                Id = source.Id,
                RoleId = source?.RoleId ?? 0,
                ScreenId = source?.ScreenId ?? 0,
                PermissionId = source?.PermissionId ?? 0,
                DisplayInList = source?.DisplayInList ?? true ,
                IsActive = source.IsActive,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
            };
        }
    }
}
