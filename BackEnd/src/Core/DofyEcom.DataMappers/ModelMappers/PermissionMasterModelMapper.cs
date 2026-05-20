using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class PermissionMasterModelMapper : ITypeConverter<ViewEntities.PermissionMaster, DBO.PermissionMaster>
    {
        public DBO.PermissionMaster Convert(ViewEntities.PermissionMaster source, DBO.PermissionMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.PermissionMaster();

            return new DBO.PermissionMaster
            {
                Id = source.Id,
                PermissionName = source.PermissionName,
                PermissionCode = source.PermissionCode,
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
}
