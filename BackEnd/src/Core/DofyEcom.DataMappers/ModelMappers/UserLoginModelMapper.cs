using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class UserLoginModelMapper : ITypeConverter<ViewEntities.UserLogin, DBO.UserLogin>
    {
        public DBO.UserLogin Convert(ViewEntities.UserLogin source, DBO.UserLogin destination, ResolutionContext context)
        {
            return new DBO.UserLogin
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
}
