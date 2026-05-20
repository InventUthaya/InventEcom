using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DofyEcom.DBO;
using DofyEcom.ViewEntities;

namespace DofyEcom.DataMappers
{
    public class RoleMasterModelMapper : ITypeConverter<ViewEntities.RoleMaster, DBO.RoleMaster>
    {
        public DBO.RoleMaster Convert(ViewEntities.RoleMaster source, DBO.RoleMaster destination, ResolutionContext context)
        {

            return new DBO.RoleMaster
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