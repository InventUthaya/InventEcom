namespace DofyEcom.Public.API.Helpers
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authentication.JwtBearer;

    public interface ITokenValidatorService
    {
        /// <summary>
        /// Validate Token
        /// </summary>
        /// <param name="context"></param>
        Task ValidateToken(TokenValidatedContext context);
    }
}
