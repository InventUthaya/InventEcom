using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Encodings.Web;
using DofyEcom.Helper;
using DofyEcom.Public.API.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

namespace DOFY.Public.API.Filters;

public class TokenAuthenticationHandler : AuthenticationHandler<ServiceAPIAuthOptions>
{
    private readonly AppConfiguration appConfiguration;

    public TokenAuthenticationHandler(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IOptionsMonitor<ServiceAPIAuthOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
    : base(options, logger, encoder, clock)
    {
        appConfiguration = iAppConfiguration.Value;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (Request.Headers.TryGetValue("Authorization", out StringValues authTokenValues))
        {
            string tokenValue = string.Empty;
            string authTokenValue = authTokenValues.First();

            if (string.IsNullOrWhiteSpace(authTokenValue))
            {
                return await Task.FromResult(AuthenticateResult.Fail("Token is Invalid"));
            }

            if (authTokenValue.StartsWith(DOFYEcomConstants.ServiceAuthorizationHeaderScheme, StringComparison.OrdinalIgnoreCase))
            {
                tokenValue = authTokenValue.Substring(DOFYEcomConstants.ServiceAuthorizationHeaderScheme.Length).Trim();
            }

            if (string.Equals(tokenValue, appConfiguration.ApplicationConfiguration.BaseSecurityAPIkey))
            {
                return await this.TicketGenerationAsync(tokenValue);
            }

            if (authTokenValue.StartsWith("Bearer"))
            {
                authTokenValue = authTokenValue.Substring("Bearer".Length).ToString().Trim();
                var tokens = new JwtSecurityToken(jwtEncodedString: authTokenValue);
                DateTime? ValidTo = tokens?.ValidTo;

                if (DateTime.UtcNow > ValidTo)
                {
                    return await Task.FromResult(AuthenticateResult.Fail("Token is Expired"));
                }

                return await this.TicketGenerationAsync(authTokenValue);
            }

            return await Task.FromResult(AuthenticateResult.Fail("Invalid Token"));
        }

        return await Task.FromResult(AuthenticateResult.Fail("Token is null"));
    }

    private async Task<AuthenticateResult> TicketGenerationAsync(string bastToken)
    {
        var claims = new[] { new Claim("token", bastToken) };
        var identity = new ClaimsIdentity(claims, nameof(TokenAuthenticationHandler));
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name);

        return await Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
