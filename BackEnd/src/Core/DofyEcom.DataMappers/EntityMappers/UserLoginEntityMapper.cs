using AutoMapper;
namespace DofyEcom.DataMappers.EntityMappers;
public class UserLoginEntityMapper : ITypeConverter<DBO.UserLogin, ViewEntities.UserLogin>
{
    public ViewEntities.UserLogin Convert(DBO.UserLogin source, ViewEntities.UserLogin destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.UserLogin();

        return new ViewEntities.UserLogin
        {
            Id = source.Id,
            UserId = source.UserId,
            Email = source.Email,
            Phone = source.Phone,
            PasswordHash = source.PasswordHash,
            LastLogin = source.LastLogin,
            DisplayInList = source.DisplayInList,
            IsActive = source.IsActive,
            Created = source.Created,
            CreatedBy = source.CreatedBy,
            Modified = source.Modified,
            ModifiedBy = source.ModifiedBy
        };
    }
}

