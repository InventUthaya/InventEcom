using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class ScreenMasterModelMapper : ITypeConverter<ViewEntities.ScreenMaster, DBO.ScreenMaster>
    {
        public DBO.ScreenMaster Convert(ViewEntities.ScreenMaster source, DBO.ScreenMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.ScreenMaster();

            return new DBO.ScreenMaster
            {
                Id = source.Id,
                ScreenName = source.ScreenName,
                ScreenCode = source.ScreenCode,
                Icon = source.Icon,
                IsSidebar = source.IsSidebar,
                ParentScreenId = source.ParentScreenId,
                DisplayInList = source.DisplayInList,
                IsActive = source.IsActive,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy
            };
        }
    }
}
