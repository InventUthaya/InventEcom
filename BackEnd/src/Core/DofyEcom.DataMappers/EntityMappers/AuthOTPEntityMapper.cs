using AutoMapper;
namespace DofyEcom.DataMappers.EntityMappers;
public class AuthOTPEntityMapper : ITypeConverter<DBO.AuthOTP, ViewEntities.AuthOTP>
{
    public ViewEntities.AuthOTP Convert(DBO.AuthOTP source, ViewEntities.AuthOTP destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.AuthOTP();

        return new ViewEntities.AuthOTP
        {
            Id = source.Id,
            LoginId = source.LoginId,
            OTP = source.OTP,
            GeneratedTime = source.GeneratedTime,
            ExpiredTime = source.ExpiredTime,
            IsActive = source.IsActive,
            Created = source.Created,
            CreatedBy = source.CreatedBy,
            Modified = source.Modified,
            ModifiedBy = source.ModifiedBy
        };
    }
}

