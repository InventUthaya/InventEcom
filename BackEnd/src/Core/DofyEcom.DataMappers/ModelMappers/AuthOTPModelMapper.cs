using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class AuthOTPModelMapper : ITypeConverter<ViewEntities.AuthOTP, DBO.AuthOTP>
    {
        public DBO.AuthOTP Convert(ViewEntities.AuthOTP source, DBO.AuthOTP destination, ResolutionContext context)
        {
            return new DBO.AuthOTP
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
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}

