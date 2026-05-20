namespace DofyEcom.Public.API.Helpers
{
    using System;
    using System.IdentityModel.Tokens.Jwt;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.Extensions.Configuration;
    using Microsoft.IdentityModel.Tokens;

    public class TokenValidatorService : ITokenValidatorService
    {
        private SecurityToken validToken;
        private readonly IConfiguration configuration;

        public TokenValidatorService(IConfiguration iConfiguration)
        {
            this.configuration = iConfiguration;
        }

        public async Task ValidateToken(TokenValidatedContext context)
        {
            var jwtSecureToken = context.SecurityToken as JwtSecurityToken;
            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();

            if (string.IsNullOrEmpty(jwtSecureToken.RawData))
            {
                context.Fail(new UnauthorizedAccessException());
            }

            var tokenParameters = new TokenValidationParameters
            {
                ValidIssuer = this.configuration["Jwt:Issuer"],
                ValidateIssuer = true,
                ValidAudience = this.configuration["Jwt:Audience"],
                ValidateAudience = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.configuration["Jwt:SecurityKey"])),
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                RequireExpirationTime = true,
            };

            jwtSecurityTokenHandler.ValidateToken(Convert.ToString(jwtSecureToken.RawData), tokenParameters, out this.validToken);

            if (this.validToken.ValidTo < DateTime.UtcNow)
            {
                context.Fail(new UnauthorizedAccessException());
                return;
            }
        }
    }
}
