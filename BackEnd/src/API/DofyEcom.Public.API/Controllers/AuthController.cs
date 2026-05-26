namespace DofyEcom.Public.API.Controllers
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
    using DofyEcom.Public.API.Controllers;
    using static DofyEcom.Public.API.Startup;

    [AllowAnonymous]
    [Route("api/auth")]

    public class AuthController : BaseController<IAuthModel, ViewEntities.UserLogin>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly IAuthModel authModel;
        private IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly IUserMasterModel _iUserMasterModel;
        private readonly CountryContext requestContext;

        public AuthController(IOptionsSnapshot<AppConfiguration> iAppConfiguration, IMapper iMapper,
            IAuthModel iauthModel, IUserMasterModel iuserMasterModel, IPrincipal iPrincipal , CountryContext requestContext)
            : base(iauthModel, iAppConfiguration, requestContext: requestContext)
        {
            this.appConfiguration = iAppConfiguration;
            this.mapper = iMapper;
            this._iUserMasterModel = iuserMasterModel;
            this.authModel = iauthModel;
            this.iPrincipal = iPrincipal;
            this.requestContext = requestContext;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("signIn/{phoneNumber}")]
        public async Task<IActionResult> Login(string phoneNumber)
        {
            try
            {
                this.RemoveClaims();

                return await this.ValidateUser(phoneNumber);
            }
            catch (Exception ex)
            {
                SeriLogger.Error(ex, "Error in username and password");
                return StatusCode(500, new { Status = "Internal Server Error", Message = ex.Message });
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("authenticate/{userName}/{password}")]
        public async Task<IActionResult> Authenticate(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password)) { return BadRequest(); }
            var result = await this.Contract.AuthenticateWithOTP(userName, password);
            if (result is null) { return Content("not valid user"); }
            object webtoken = await this.GenerateJsonWebToken(result);
            if (webtoken is null) { return Unauthorized(); }

            return Ok(new
            {
                token = webtoken
            });
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

        [HttpPost]
        [Route("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestViewModel item)
        {
            var result = await this.Contract.AddUser(item);

            if (result == 0)
            {
                return Content("Already registerd number");
            }
            else if (result == -1)
            {
                return Content("Already registerd email");

            }

            return Ok(new { message = "User created successfully", personId = result });
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
                return this.Ok("Invalid Credentials");
            }

            return this.Ok("Valid");

        }


        private async Task<object> GenerateJsonWebToken(UserLogin item)
        {
            if (item is not null)
            {
                var data = await this.Contract.GetUserMaster(item.UserId);
                var encryptedRole = EncryptAES(item.Id.ToString());
                var token = new JwtTokenBuilder()
                                  .AddSecurityKey(JwtSecurityKey.Create(this.appConfiguration?.Value?.EncryptionConfiguration?.ClientSecrect))
                                  .AddSubject("Token")
                                  .AddIssuer(this.appConfiguration?.Value?.EncryptionConfiguration?.Issuer)
                                  .AddAudience(this.appConfiguration?.Value?.EncryptionConfiguration?.Audience)
                                  .AddClaim("PersonId", EncryptAES(item.UserId.ToString()))
                                  .AddClaim("Email", item.Email.ToString())
                                  .AddClaim("MobileNumber", item.Phone.ToString())
                                  .AddClaim("LoginId", item.Id.ToString())
                                  .AddClaim("RoleId", encryptedRole)
                                  .AddExpiry(Convert.ToInt32(this.appConfiguration?.Value?.EncryptionConfiguration?.ExpirationInMinutes))
                                  .Build(this.CreateClaims(item, encryptedRole, data));

                var result = new
                {
                    Token = token.Value
                };

                return await Task.FromResult(result);
            }
            return default;
        }

        [NonAction]
        private List<Claim> CreateClaims(UserLogin user, string encryptedRole, UserMaster userMaster)
        {
            var claims = new List<System.Security.Claims.Claim>
                {
                    new System.Security.Claims.Claim(ClaimTypes.PrimaryGroupSid, Convert.ToString(user.UserId)),
                    new System.Security.Claims.Claim(ClaimTypes.PrimarySid, Convert.ToString(user.Id)),
                    new System.Security.Claims.Claim(ClaimTypes.GivenName, Convert.ToString(user.Email)),
                    new System.Security.Claims.Claim("LoginId", user.Id.ToString()),
                    new System.Security.Claims.Claim("PersonId", user.UserId.ToString()),
                    new System.Security.Claims.Claim("Email", user.Email),
                    new System.Security.Claims.Claim("name", userMaster.FullName),
                    new System.Security.Claims.Claim("Password", user.PasswordHash),
                    new System.Security.Claims.Claim("MobileNumber", user.Phone),
                };

            var identity = new ClaimsIdentity(claims, "local", "name", "role");
            this.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            return claims;
        }

        [HttpGet]
        [Route("DeleteAccount")]
        public async Task<IActionResult> DeleteAccount([FromQuery] long id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid ID");
                }

                var success = await this.Contract.DeleteAccount(id);
                if (success)
                {
                    return Ok(true);
                }

                return Ok(false);
            }
            catch (Exception ex)
            {
                SeriLogger.Error(ex, "Error deleting/deactivating account");
                return StatusCode(500, new { Status = "Internal Server Error", Message = ex.Message });
            }
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