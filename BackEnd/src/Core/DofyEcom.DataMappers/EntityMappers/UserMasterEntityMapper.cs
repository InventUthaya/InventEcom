using AutoMapper;
namespace DofyEcom.DataMappers.EntityMappers;
public class UserMasterEntityMapper : ITypeConverter<DBO.UserMaster, ViewEntities.UserMaster>
{
    public ViewEntities.UserMaster Convert(DBO.UserMaster source, ViewEntities.UserMaster destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.UserMaster();

        return new ViewEntities.UserMaster
        {
            Id = source.Id,
            FullName = source.FullName,
            DisplayInList = source.DisplayInList,
            IsActive = source.IsActive,
            Created = source.Created,
            CreatedBy = source.CreatedBy,
            Modified = source.Modified,
            ModifiedBy = source.ModifiedBy
        };
    }
}

