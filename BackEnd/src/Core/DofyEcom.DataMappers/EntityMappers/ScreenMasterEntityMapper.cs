using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers;
public class ScreenMasterEntityMapper : ITypeConverter<DBO.ScreenMaster, ViewEntities.ScreenMaster>
{
    public ViewEntities.ScreenMaster Convert(DBO.ScreenMaster source, ViewEntities.ScreenMaster destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.ScreenMaster();

        return new ViewEntities.ScreenMaster
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
