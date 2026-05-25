namespace DofyEcom.Model
{
    using System;
    using System.Collections.Generic;
    using System.Security.Cryptography;
    using System.Security.Principal;
    using System.Threading.Tasks;
    using AutoMapper;
    using DataTables.AspNet.Core;
    using DofyEcom.Contracts;
    using DofyEcom.Helper;
    using DofyEcom.Helper.Extensions;
    using DofyEcom.Model;
    using DofyEcom.ViewEntities;
    using Isopoh.Cryptography.Argon2;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Caching.Memory;
    using Microsoft.Extensions.Options;
    using Org.BouncyCastle.Asn1.Ocsp;


    public class AuthModel : BaseModel<DBO.UserLogin>, IAuthModel, IDisposable
    {
        private readonly IOptionsSnapshot<AppConfiguration> iConfig;
        private readonly IMapper mapper;
        protected readonly IPrincipal? iPrinciple;
        private readonly CountryContext context;

        public AuthModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
         : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.iConfig = iConfig;
            this.mapper = iMapper;
            this.iPrinciple = iPrincipal;
            this.context = requestContext;
        }

        public List<string> CreateEncryptionPassword(string password)
        {
            string salt = string.Empty;
            string ivKey = string.Empty;
            string encryPassword = string.Empty;

            List<string> items = new List<string>();

            using (Rijndael myRijndael = Rijndael.Create())
            {
                salt = RijndaelSecurityEncryption.ByteArrayToHexaString(myRijndael.Key);
                ivKey = RijndaelSecurityEncryption.ByteArrayToHexaString(myRijndael.IV);
                encryPassword = RijndaelSecurityEncryption.EncryptwithRijndael(password, salt, ivKey);
            }

            items.Add(salt);
            items.Add(ivKey);
            items.Add(encryPassword);

            return items;
        }

        public async Task<ViewEntities.UserMaster> GetUserMaster(long userId)
        {
            var result = new UserMasterModel(this.iConfig, this.mapper, this.iPrinciple, this.context).FindById(userId);
            var user = this.mapper.Map<DBO.UserMaster, ViewEntities.UserMaster>(result);
            return user;
        }

        public async Task<ViewEntities.UserLogin> Authenticate(string phone)
        {

            var validUser = this.FindItem(item => item.Phone.ToLower() == phone.ToLower() && item.IsActive == true);

            if (validUser == null) return null;

            var result = this.mapper.Map<DBO.UserLogin, ViewEntities.UserLogin>(validUser);

            if (validUser != null)
            {

                string otpCode = this.GenerateOtp();

                // Generate timestamps
                DateTime generatedAt = DateTimeExtensions.GetCurrentIST();
                DateTime expiresAt = generatedAt.AddMinutes(5);

                // Create OTP model (assuming your AuthOTPModel.Post accepts this)
                var otpModel = new AuthOTP
                {
                    OTP = otpCode,
                    GeneratedTime = generatedAt,
                    ExpiredTime = expiresAt,
                    LoginId = validUser.Id
                };


                new AuthOTPModel(this.iConfig, this.mapper, this.iPrinciple).Post(otpModel);

                var template = new EmailTemplatesModel(this.iConfig, this.mapper, this.iPrinciple, this.context);
                long pendingemailId = template.LogOTP(validUser.Id, otpCode);
            }
            return result;
        }


        public async Task<ViewEntities.UserLogin> AuthenticateUser(string email, string password)
        {
            var validUser = this.FindItem(item => (item.Email.ToLower() == email.ToLower() || item.Phone.ToLower() == email.ToLower()) && item.IsActive == true);

            if (validUser == null)
            {
                return null;
            }
            bool isPasswordValid = Argon2.Verify(validUser.PasswordHash, password);
            if (!isPasswordValid)
            {
                return null;
            }
            validUser.LastLogin = DateTimeExtensions.GetCurrentIST() ; // Or DateTime.Now or DateTimeExtensions.GetCurrentIST()
            this.UpdateItem(validUser);
            string otpCode = this.GenerateOtp();
            DateTime generatedAt = DateTimeExtensions.GetCurrentIST();
            DateTime expiresAt = generatedAt.AddMinutes(5);
            var otpModel = new AuthOTP
            {
                OTP = otpCode,
                GeneratedTime = generatedAt,
                ExpiredTime = expiresAt,
                LoginId = validUser.Id
            };

            new AuthOTPModel(this.iConfig, this.mapper, this.iPrinciple).Post(otpModel);
            var template = new EmailTemplatesModel(this.iConfig, this.mapper, this.iPrinciple, this.context);
            long pendingemailId = template.LogOTP(validUser.Id, otpCode);


            var result = this.mapper.Map<DBO.UserLogin, ViewEntities.UserLogin>(validUser);
            return result;
        }

        public async Task<bool> VerifyOTP(int loginId, string otp)
        {
            var authOTPModel = new AuthOTPModel(this.iConfig, this.mapper, this.iPrinciple, this.context);
            bool res = authOTPModel.GetAuthorizationCode(loginId, otp);

            return res;
        }







        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public bool Remove(long id)
        {
            throw new NotImplementedException();
        }


        public void Dispose()
        {
        }

        public long Post(UserLogin item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Put(UserLogin item, IFormFileCollection postedFileCollection)
        {
            throw new NotImplementedException();
        }

        public long Post(UserLogin item)
        {
            throw new NotImplementedException();
        }

        public long Put(UserLogin item)
        {
            throw new NotImplementedException();
        }

        IEnumerable<UserLogin> IBaseModel<UserLogin>.GetList()
        {
            throw new NotImplementedException();
        }

        UserLogin IBaseModel<UserLogin>.Get(long id)
        {
            throw new NotImplementedException();
        }

        public async Task<ViewEntities.UserLogin> AuthenticateWithOTP(string userName, string passWord)
        {
            var loginData = this.FindItem(item => item.Phone.Trim() == userName.Trim() && item.IsActive == true);
            if (loginData is not null)
            {
               bool result = await VerifyOTP((int)loginData.Id, passWord);
                if (result)
                {
                     var userLogin = this.mapper.Map<DBO.UserLogin, ViewEntities.UserLogin>(loginData);
                     return userLogin;
                }
            }
            return null;
        }


        public async Task<long> AddUser(CreateUserRequestViewModel request)
        {
            if (request == null) return 0;

            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Phone) ||
                string.IsNullOrWhiteSpace(request.Email))
            {
                return 0;
            }

            var userLoginModel = new UserLoginModel(this.iConfig, this.mapper, this.iPrinciple, this.context);
            var existingLogin = userLoginModel.FindItem(u => u.Email == request.Email || u.Phone == request.Phone);

            if (existingLogin != null)
            {
                if (existingLogin.Email == request.Email) return -1;
                if (existingLogin.Phone == request.Phone) return 0;
            }

            var userMasterModel = new UserMasterModel(this.iConfig, this.mapper, this.iPrinciple, this.context);

            var newUserMaster = new UserMaster
            {
                FullName = request.Name.Trim(),
                IsActive = true,
                DisplayInList = true,
            };

            long userId = userMasterModel.Post(newUserMaster);

            if (userId <= 0) return 0;

            var newUserLogin = new UserLogin
            {
                UserId = (int)userId,
                Email = request.Email.Trim(),
                Phone = request.Phone.Trim(),
                PasswordHash = "",
                IsActive = true,
                DisplayInList = true
            };

            userLoginModel.Post(newUserLogin);

            var userRoleMappingModel = new UserRoleMappingModel(this.iConfig, this.mapper, this.iPrinciple, this.context);

            var newRoleMapping = new UserRoleMapping
            {
                UserId = (int)userId,
                RoleId = (int) ROLES_ENUM_PUBLIC.Customer,
                IsActive = true,
                DisplayInList = true
            };

            userRoleMappingModel.Post(newRoleMapping);

            return userId;
        }

        public async Task<bool> ForgotPassword(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return false;

            var validUser = this.FindItem(item => (item.Email.ToLower() == username.ToLower() || item.Phone.ToLower() == username.ToLower()) && item.IsActive == true);
            if (validUser == null) return false;

            string otpCode = this.GenerateOtp();
            DateTime generatedAt = DateTimeExtensions.GetCurrentIST();
            DateTime expiresAt = generatedAt.AddMinutes(5);

            var otpModel = new AuthOTP
            {
                OTP = otpCode,
                GeneratedTime = generatedAt,
                ExpiredTime = expiresAt,
                LoginId = validUser.Id
            };

            new AuthOTPModel(this.iConfig, this.mapper, this.iPrinciple).Post(otpModel);

            var template = new EmailTemplatesModel(this.iConfig, this.mapper, this.iPrinciple, this.context);
            long pendingemailId = template.LogForgotPasswordOTP(validUser.Id, otpCode);

            return true;
        }

        public async Task<bool> ResendOTP(string username)
        {
            return await ForgotPassword(username);
        }

        public async Task<bool> ResetPassword(string username, string otp, string newPassword)
        {
            var validUser = this.FindItem(item => (item.Email.ToLower() == username.ToLower() || item.Phone.ToLower() == username.ToLower()) && item.IsActive == true);
            if (validUser == null) return false;

            bool isOtpValid = await VerifyOTP((int)validUser.Id, otp);
            if (!isOtpValid) return false;

            validUser.PasswordHash = Argon2.Hash(newPassword);
            this.UpdateItem(validUser);

            return true;
        }
    }
}
