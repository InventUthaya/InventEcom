namespace DofyEcom.Admin.API.Controllers
{
    using System.Security.Claims;
    using System.Security.Principal;
    using AutoMapper;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.Logger;
    using DofyEcom.Model;
    using System.IdentityModel.Tokens.Jwt;
    using Microsoft.IdentityModel.Tokens;
    using DofyEcom.ViewEntities;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using Microsoft.AspNetCore.Authentication.Cookies;
    using Microsoft.AspNetCore.Authentication;
    using DofyEcom.Admin.API.Controllers;
    using DofyEcom.Admin.API;

    [AllowAnonymous]
    [Route("api/auth")]

    public class AuthController : BaseController<IAuthModel, ViewEntities.UserLogin>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IAuthModel authModel;
        private IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext requestContext;

        public AuthController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IAuthModel iauthModel, IPrincipal iPrincipal , CountryContext requestContext)
            : base(iauthModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this.authModel = iauthModel;
            this.iPrincipal = iPrincipal;
            this.requestContext = requestContext;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Login/{phone}")]
        public async Task<IActionResult> Login(string phone)
        {
            try
            {
                this.RemoveClaims();

                return await this.ValidateUser(phone);
            }
            catch (Exception ex)
            {
                SeriLogger.Error(ex, "Error in username and password");
                return StatusCode(500, new { Status = "Internal Server Error", Message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("userlogin")]
        public async Task<IActionResult> UserLogin([FromQuery] string email, [FromQuery] string password)
        {
            try
            {
                this.RemoveClaims();

                return await this.ValidateUserLogin(email, password);
            }
            catch (Exception ex)
            {
                SeriLogger.Error(ex, "Error in username and password");
                return StatusCode(500, new { Status = "Internal Server Error", Message = ex.Message });
            }
        }

        [HttpPost("VerifyOTP")]
        public async Task<IActionResult> VerifyOTP(int loginId, string otp)
        {

            var success = await this.Contract.VerifyOTP(loginId, otp);
            if (success)
                return Ok(new { message = "OTP Validated successfully." });

            return Unauthorized(new { message = "Incorrect OTP" });
        }



        private void RemoveClaims()
        {
            var claimPrincipal = this.User as ClaimsPrincipal;
            var identity = claimPrincipal.Identity as ClaimsIdentity;
            try
            {
                if (claimPrincipal.Claims.Count() > 0)
                {

                    var claim = (from c in claimPrincipal.Claims
                                 where c.Type == "EmployeeCode"
                                 select c).Single();
                    identity.RemoveClaim(claim);

                    claim = (from c in claimPrincipal.Claims
                             where c.Type == "Id"
                             select c).Single();
                    identity.RemoveClaim(claim);
                    claim = (from c in claimPrincipal.Claims
                             where c.Type == "Name"
                             select c).Single();
                    identity.RemoveClaim(claim);
                    claim = (from c in claimPrincipal.Claims
                             where c.Type == "Email"
                             select c).Single();
                    identity.RemoveClaim(claim);
                    claim = (from c in claimPrincipal.Claims
                             where c.Type == "RoleId"
                             select c).Single();
                    identity.RemoveClaim(claim);

                }
            }
            catch (Exception ex)
            {
                SeriLogger.Error(ex, "ValidateUser Method Error");
            }
        }



        private async Task<IActionResult> ValidateUserLogin( string email, string password)
        {

            UserLogin user = null;
            using (IAuthModel auth = new AuthModel(this.appConfiguration, this.mapper))
            {

                user = await auth.AuthenticateUser(email,password);
            }
            if (user == null)
            {
                return Unauthorized("User Name or Password is wrong" );
            }
            var Webtoken = await this.GenerateJsonWebToken(user);
            if (Webtoken == null) { return Unauthorized(); }

            return this.Ok(Webtoken);

        }

        private async Task<IActionResult> ValidateUser(string phone)
        {

            UserLogin user = null;
            using (IAuthModel auth = new AuthModel(this.appConfiguration, this.mapper))
            {

                user = await auth.Authenticate(phone);
            }
            if (user == null)
            {
                return this.Ok(new { Status = "User Name or Password is wrong" });
            }

            return this.Ok(new { Status = true });

        }


        private async Task<object> GenerateJsonWebToken(UserLogin item)
        {
            if (item is not null)
            {
                var roleData = new UserRoleMappingModel(this.appConfiguration, this.mapper).FindItem(x => x.UserId == (int) item.UserId);
                var roleDatadto = this.mapper.Map<ViewEntities.UserRoleMapping>(roleData);
                var screendata = new ScreenMasterModel(this.appConfiguration, this.mapper);
                var RoleMapping = new RolePermissionModel(this.appConfiguration, this.mapper);
                var RoleMappingdata = RoleMapping.GetByRoleId(Convert.ToInt32(roleData.RoleId));
                var parntermaster = new PartnerMasterModel(this.appConfiguration, this.mapper).FindItem(x => x.UserId == (long)item.UserId);
                var parntermasterdto = this.mapper.Map<ViewEntities.PartnerMaster>(parntermaster);
                var data = screendata.GetList();
                var screenMasterJson = System.Text.Json.JsonSerializer.Serialize(data);
                var RoleAccessJson = System.Text.Json.JsonSerializer.Serialize(RoleMappingdata);
                var encryptedRole = EncryptAES(item.Id.ToString()); 

                var token = new JwtTokenBuilder()
                                  .AddSecurityKey(JwtSecurityKey.Create(this.appConfiguration?.Value?.EncryptionConfiguration?.ClientSecrect))
                                  .AddSubject("Token")
                                  .AddSubject("ScreenMaster")
                                  .AddSubject("RolePermission")
                                  .AddIssuer(this.appConfiguration?.Value?.EncryptionConfiguration?.Issuer)
                                  .AddAudience(this.appConfiguration?.Value?.EncryptionConfiguration?.Audience)
                                  .AddClaim("Id", item.Id.ToString())
                                  .AddClaim("ScreenMaster", screenMasterJson)
                                  .AddClaim("RolePermission", RoleAccessJson)
                                  .AddClaim("RoleId", roleData.RoleId.ToString())
                                  .AddExpiry(Convert.ToInt32(this.appConfiguration?.Value?.EncryptionConfiguration?.ExpirationInMinutes))
                                  .Build(this.CreateClaims(item, encryptedRole, roleDatadto, parntermasterdto));

                var result = new
                {
                    Token = token.Value,
                    ScreenMaster = screenMasterJson,
                    RolePermission = RoleAccessJson
                };

                return await Task.FromResult(result);
            }
            return default;
        }

        [NonAction]
        private List<Claim> CreateClaims(UserLogin user, string encryptedRole, UserRoleMapping roleDatadto,PartnerMaster parntermasterdto)
        {
            var claims = new List<System.Security.Claims.Claim>
                {
 
                    new System.Security.Claims.Claim(ClaimTypes.PrimaryGroupSid, Convert.ToString(user.UserId)),
                    new System.Security.Claims.Claim(ClaimTypes.PrimarySid, Convert.ToString(user.Id)),
                    new System.Security.Claims.Claim(ClaimTypes.GivenName, Convert.ToString(user.Email)),
                    new System.Security.Claims.Claim("LoginId", user.Id.ToString()),
                    new System.Security.Claims.Claim("UserId", user.UserId.ToString()),
                    new System.Security.Claims.Claim("Email", user.Email),
                    new System.Security.Claims.Claim("Phone", user.Phone),
                    new System.Security.Claims.Claim("RoleId", roleDatadto.RoleId.ToString()),
                };
            if (roleDatadto?.RoleId == 5)
            {
                claims.Add(new Claim("PartnerId", parntermasterdto.Id.ToString()));
            }

            var identity = new ClaimsIdentity(claims, "local", "name", "role");
            this.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            return claims;
        }

        public sealed class JwtTokenBuilder
        {
            private SecurityKey securityKey = null;
            private string subject = string.Empty;
            private string issuer = string.Empty;
            private string audience = string.Empty;
            private Dictionary<string, string> claims = new Dictionary<string, string>();
            private int expiryInMinutes = 20;

            public JwtTokenBuilder AddSecurityKey(SecurityKey securityKey)
            {
                this.securityKey = securityKey;
                return this;
            }

            public JwtTokenBuilder AddSubject(string subject)
            {
                this.subject = subject;
                return this;
            }

            public JwtTokenBuilder AddIssuer(string issuer)
            {
                this.issuer = issuer;
                return this;
            }

            public JwtTokenBuilder AddAudience(string audience)
            {
                this.audience = audience;
                return this;
            }

            public JwtTokenBuilder AddClaim(string type, string value)
            {
                this.claims.Add(type, value);
                return this;
            }

            public JwtTokenBuilder AddClaims(Dictionary<string, string> claims)
            {
                this.claims.Union(claims);
                return this;
            }

            public JwtTokenBuilder AddExpiry(int expiryInMinutes)
            {
                this.expiryInMinutes = expiryInMinutes;
                return this;
            }

            public JwtToken Build(List<System.Security.Claims.Claim> claims)
            {
                this.EnsureArguments();

                var token = new JwtSecurityToken(
                                  issuer: this.issuer,
                                  audience: this.audience,
                                  claims: claims,
                                  expires: DateTime.UtcNow.AddMinutes(this.expiryInMinutes),
                                  signingCredentials: new SigningCredentials(
                                                            this.securityKey,
                                                            SecurityAlgorithms.HmacSha256));

                return new JwtToken(token);
            }

            private void EnsureArguments()
            {
                if (this.securityKey == null)
                {
                    throw new ArgumentNullException("Security Key");
                }

                if (string.IsNullOrEmpty(this.subject))
                {
                    throw new ArgumentNullException("Subject");
                }

                if (string.IsNullOrEmpty(this.issuer))
                {
                    throw new ArgumentNullException("Issuer");
                }

                if (string.IsNullOrEmpty(this.audience))
                {
                    throw new ArgumentNullException("Audience");
                }
            }

            public sealed class JwtToken
            {
                private JwtSecurityToken token;

                internal JwtToken(JwtSecurityToken token)
                {
                    this.token = token;
                }

                public DateTime ValidTo => this.token.ValidTo;

                public string Value => new JwtSecurityTokenHandler().WriteToken(this.token);
            }

        }
    }
}