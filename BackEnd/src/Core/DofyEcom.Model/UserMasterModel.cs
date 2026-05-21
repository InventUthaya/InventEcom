using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Amazon.Runtime;
using AutoMapper;
using Dapper;
using DataTables.AspNet.Core;
using DofyEcom.Contracts;
using DofyEcom.Contracts.Requests;
using DofyEcom.DAL.Mapper;
using DofyEcom.Helper;
using DofyEcom.UploadHelper;
using DofyEcom.ViewEntities;
using DofyEcom.ViewEntities.ViewModel;
using Isopoh.Cryptography.Argon2;
using iText.StyledXmlParser.Jsoup.Parser;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace DofyEcom.Model
{
    public class UserMasterModel : BaseModel<DBO.UserMaster>, IUserMasterModel
    {

        private readonly IOptionsSnapshot<AppConfiguration> config;
        private readonly IMapper mapper;
        private readonly IPrincipal iPrincipal;
        private readonly CountryContext context;

        public UserMasterModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper, IPrincipal? iPrincipal = null, CountryContext requestContext = null)
            : base(iConfig, iMapper, iPrincipal, GetConnectionString(requestContext, iConfig?.Value.DatabaseConfiguration), requestContext)
        {
            this.config = iConfig;
            this.mapper = iMapper;
            this.iPrincipal = iPrincipal;
            this.context = requestContext;
        }

        public async Task<int> CreateUser(CreateOrUpdateUserRequest request)
        {
            try
            {
                if (request == null || request.User == null)
                {
                    throw new ApplicationException("User details are required.");
                }

                var user = new DBO.UserMaster();
                user = this.mapper.Map<ViewEntities.UserMaster, DBO.UserMaster>(request.User);

                var userId = this.AddItem(user);

                if (userId <= 0)
                {
                    throw new ApplicationException("Failed to create user.");
                }

                // Create UserLogin
                // Create UserLogin with password hashing
                if (request.UserLogin != null)
                {
                    // Validate required fields
                    if (string.IsNullOrEmpty(request.UserLogin.Email))
                    {
                        throw new ApplicationException("Email is required for user login.");
                    }

                    if (string.IsNullOrEmpty(request.UserLogin.PasswordHash))
                    {
                        throw new ApplicationException("Password is required for user login.");
                    }

                    var userLogin = this.mapper.Map<ViewEntities.UserLogin, DBO.UserLogin>(request.UserLogin);
                    userLogin.UserId = userId;

                    // Hash the password using Argon2
                    userLogin.PasswordHash = Argon2.Hash(request.UserLogin.PasswordHash); // Assuming PasswordHash contains the plain password from the request

                    userLogin.IsActive = true;

                    // Set additional properties if needed
                    userLogin.LastLogin = null; // Initialize as null since user hasn't logged in yet
                    userLogin.DisplayInList = request.UserLogin.DisplayInList ?? true; // Default to true if not specified

                    var loginId = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userLogin);

                    if (loginId <= 0)
                    {
                        throw new ApplicationException("Failed to create user login.");
                    }
                }

                // Create UserRoleMapping
                if (request.UserRole != null)
                {
                    var userRole = this.mapper.Map<ViewEntities.UserRoleMapping, DBO.UserRoleMapping>(request.UserRole);
                    userRole.UserId = (int)userId;
                    userRole.IsActive = true;
                    var roleId = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userRole);

                    if (roleId <= 0)
                    {
                        throw new ApplicationException("Failed to assign user role.");
                    }
                }
                // Partner Creation
                if (request.PartnerMaster != null)
                {
                    PartnerMaster part = new PartnerMaster();
                    part.AccountHolderName = request.PartnerMaster.AccountHolderName;
                    part.AccountNumber = request.PartnerMaster.AccountNumber;
                    part.PanCardNumber = request.PartnerMaster.PanCardNumber;
                    part.GSTNumber = request.PartnerMaster.GSTNumber;
                    part.PhoneNumber = request.PartnerMaster.PhoneNumber;
                    part.BankName = request.PartnerMaster.BankName;
                    part.CompanyName = request.PartnerMaster.CompanyName;
                    part.IsActive = true;
                    part.Name = request.PartnerMaster.Name;
                    part.Email = request.PartnerMaster.Email;
                    part.CommissionSlabId = request.PartnerMaster.CommissionSlabId;
                    part.IFSCCode = request.PartnerMaster.IFSCCode;

                    string signatureImagePath = $"partner/signature/images/{userId}";
                    string chequeLeafImagePath = $"partner/chequeLeaf/images/{userId}";

                    string savedSignaturePath = await UploadPartnerImages(request.PartnerMaster.Signature, (int)userId, signatureImagePath);
                    string savedChequeLeafPath = await UploadPartnerImages(request.PartnerMaster.ChequeLeaf, (int)userId, chequeLeafImagePath);

                    part.Signature = signatureImagePath + "/" + request.PartnerMaster.Signature.FileName;
                    part.ChequeLeaf = chequeLeafImagePath + "/" + request.PartnerMaster.ChequeLeaf.FileName;
                    part.IsActive = true;
                    var partner = this.mapper.Map<ViewEntities.PartnerMaster, DBO.PartnerMaster>(part);
                    partner.UserId = (int)userId;
                   
                    var partnerId = new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(partner);
                    if (partnerId <= 0)
                    {
                        throw new ApplicationException("Failed to add partner.");
                    }

                }

                // Create UserAddresses
                if (request.UserAddresses != null && request.UserAddresses.Count > 0)
                {
                    foreach (var address in request.UserAddresses)
                    {
                        var userAddress = this.mapper.Map<ViewEntities.UserAddress, DBO.UserAddress>(address);
                        userAddress.UserId = userId;

                        userAddress.IsActive = true;


                        var addressId = new UserAddressModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userAddress);

                        if (addressId <= 0)
                        {
                            throw new ApplicationException($"Failed to create address for user {userId}.");
                        }
                    }
                }

                return (int)userId;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while creating the user.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while creating the user.", ex);
            }
        }

        public async Task<UserDetailsViewModel> GetUserByIdAsync(int userId)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@UserId", userId);

                var result = this.ExecStoredProcedureQueryMultiple<UserDetailsViewModel, UserDetailsMapper>("sp_GetUserById", parameters);

                return await Task.FromResult(result == null ? null : mapper.Map<UserDetailsViewModel>(result));
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while retrieving user details.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while retrieving user details.", ex);
            }
        }

        public async Task<int> UpdateUser(int userId, CreateOrUpdateUserRequest request)
        {
            try
            {
                if (request == null || request.User == null)
                {
                    throw new ApplicationException("User details are required.");
                }

                if (userId <= 0)
                {
                    throw new ApplicationException("Invalid user ID.");
                }

                // Update UserMaster
                var user = this.mapper.Map<ViewEntities.UserMaster, DBO.UserMaster>(request.User);
                user.Id = userId;
                user.Modified = DateTime.UtcNow;
                this.UpdateItem(user);

                // Update UserLogin
                if (request.UserLogin != null)
                {
                    if (string.IsNullOrEmpty(request.UserLogin.Email))
                    {
                        throw new ApplicationException("Email is required for user login.");
                    }

                    var userLogin = this.mapper.Map<ViewEntities.UserLogin, DBO.UserLogin>(request.UserLogin);
                    userLogin.UserId = userId;
                    userLogin.Modified = DateTime.UtcNow;
                        
                    // Fetch existing UserLogin once
                    var existingLogin = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context)
                        .FindItem(x => x.UserId == userId);

                    if (!string.IsNullOrEmpty(request.UserLogin.PasswordHash))
                    {
                        userLogin.PasswordHash = Argon2.Hash(request.UserLogin.PasswordHash);
                    }
                    else
                    {
                        // Preserve existing PasswordHash if no new password is provided
                        userLogin.PasswordHash = existingLogin?.PasswordHash;
                    }

                    userLogin.IsActive = request.UserLogin.IsActive;
                    userLogin.DisplayInList = request.UserLogin.DisplayInList ?? true;

                    if (existingLogin != null)
                    {
                        userLogin.Id = existingLogin.Id;
                        new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(userLogin);
                    }
                    else
                    {
                        userLogin.Created = DateTime.UtcNow;
                        userLogin.LastLogin = null;
                        if (string.IsNullOrEmpty(userLogin.PasswordHash))
                        {
                            throw new ApplicationException("Password is required for new user login.");
                        }
                        var loginId = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userLogin);
                        if (loginId <= 0)
                        {
                            throw new ApplicationException("Failed to create user login.");
                        }
                    }
                }

                // Update UserRoleMapping
                if (request.UserRole != null)
                {
                    if (request.UserRole.RoleId <= 0)
                    {
                        throw new ApplicationException("Valid role ID is required.");
                    }

                    var userRole = this.mapper.Map<ViewEntities.UserRoleMapping, DBO.UserRoleMapping>(request.UserRole);
                    userRole.UserId = userId;
                    userRole.IsActive = request.UserRole.IsActive;
                    userRole.Modified = DateTime.UtcNow;

                    var existingRole = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context)
                        .FindItem(x => x.UserId == userId);

                    if (existingRole != null)
                    {
                        userRole.Id = existingRole.Id;
                        new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(userRole);
                    }
                    else
                    {
                        userRole.Created = DateTime.UtcNow;
                        var roleId = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(userRole);
                        if (roleId <= 0)
                        {
                            throw new ApplicationException("Failed to assign user role.");
                        }
                    }
                }

                //Update Partner Details

                if (request.PartnerMaster != null) 
                {
                    string signatureImagePath = $"partner/signature/images/{userId}";
                    string chequeLeafImagePath = $"partner/chequeLeaf/images/{userId}";

                    long partnerId = 0;
                    if(request.PartnerMaster.Id <= 0 || request.PartnerMaster.Id == null)
                    {
                        PartnerMaster part = new PartnerMaster();
                        part.AccountHolderName = request.PartnerMaster.AccountHolderName;
                        part.AccountNumber = request.PartnerMaster.AccountNumber;
                        part.PanCardNumber = request.PartnerMaster.PanCardNumber;
                        part.GSTNumber = request.PartnerMaster.GSTNumber;
                        part.PhoneNumber = request.PartnerMaster.PhoneNumber;
                        part.BankName = request.PartnerMaster.BankName;
                        part.CompanyName = request.PartnerMaster.CompanyName;
                        part.IsActive = true;
                        part.Name = request.PartnerMaster.Name;
                        part.Email = request.PartnerMaster.Email;
                        part.IFSCCode = request.PartnerMaster.IFSCCode;

                        if (request.PartnerMaster.Signature != null)
                        {
                            string savedSignaturePath = await UploadPartnerImages(request.PartnerMaster.Signature, (int)userId, signatureImagePath);
                            part.Signature = signatureImagePath + "/" + request.PartnerMaster.Signature.FileName;
                        }
                        else
                        {
                            part.Signature = null;
                        }

                        if (request.PartnerMaster.ChequeLeaf != null)
                        {
                            string savedChequeLeafPath = await UploadPartnerImages(request.PartnerMaster.ChequeLeaf, (int)userId, chequeLeafImagePath);
                            part.ChequeLeaf = chequeLeafImagePath + "/" + request.PartnerMaster.ChequeLeaf.FileName;
                        }
                        else
                        {
                            part.Signature = null;
                        }
                        var partner = this.mapper.Map<ViewEntities.PartnerMaster, DBO.PartnerMaster>(part);
                        partner.UserId = (int)userId;
                        partner.IsActive = true;
                        partnerId = new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context).AddItem(partner);
                    }
                    else
                    {
                        var existingPartner = new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context)
                        .FindItem(x => x.Id == (long) request.PartnerMaster.Id);

                        if(existingPartner != null)
                        {
                            if(request.PartnerMaster.Signature != null)
                            {
                                string savedSignaturePath = await UploadPartnerImages(request.PartnerMaster.Signature, (int)userId, signatureImagePath);
                                existingPartner.Signature = signatureImagePath + "/" + request.PartnerMaster.Signature.FileName;
                            };
                            if(request.PartnerMaster.ChequeLeaf != null)
                            {
                                string savedChequeLeafPath = await UploadPartnerImages(request.PartnerMaster.ChequeLeaf, (int)userId, chequeLeafImagePath);
                                existingPartner.ChequeLeaf = chequeLeafImagePath + "/" + request.PartnerMaster.ChequeLeaf.FileName;
                            }

                            existingPartner.AccountHolderName = request.PartnerMaster.AccountHolderName;
                            existingPartner.AccountNumber = request.PartnerMaster.AccountNumber;
                            existingPartner.PanCardNumber = request.PartnerMaster.PanCardNumber;
                            existingPartner.GSTNumber = request.PartnerMaster.GSTNumber;
                            existingPartner.PhoneNumber = request.PartnerMaster.PhoneNumber;
                            existingPartner.BankName = request.PartnerMaster.BankName;
                            existingPartner.CompanyName = request.PartnerMaster.CompanyName;
                            existingPartner.IsActive = true;
                            existingPartner.Name = request.PartnerMaster.Name;
                            existingPartner.Email = request.PartnerMaster.Email;
                            existingPartner.IFSCCode = request.PartnerMaster.IFSCCode;
                            existingPartner.Modified = DateTime.UtcNow;
                            new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(existingPartner);
                            partnerId = request.PartnerMaster.Id;

                        }
                    }
                }
                else
                {
                    var existingPartner = new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context)
                       .FindItem(x => x.UserId == userId);

                    if(existingPartner != null)
                    {
                        existingPartner.IsActive = false;
                        new PartnerMasterModel(this.config, this.mapper, this.iPrincipal, this.context).UpdateItem(existingPartner);
                    }
                }

                // Update UserAddresses
                if (request.UserAddresses != null)
                {
                    // Delete existing addresses
                    var addressModel = new UserAddressModel(this.config, this.mapper, this.iPrincipal, this.context);
                    var existingAddresses = addressModel.FindItems(x => x.UserId == userId);
                    foreach (var addr in existingAddresses)
                    {
                        addressModel.DeleteItem(addr.Id);
                    }

                    // Add new addresses
                    foreach (var address in request.UserAddresses)
                    {
                        var userAddress = this.mapper.Map<ViewEntities.UserAddress, DBO.UserAddress>(address);
                        userAddress.UserId = userId;
                        userAddress.IsActive = address.IsActive;
                        userAddress.Created = DateTime.UtcNow;
                        userAddress.Modified = DateTime.UtcNow;

                        var addressId = addressModel.AddItem(userAddress);
                        if (addressId <= 0)
                        {
                            throw new ApplicationException($"Failed to update address for user {userId}.");
                        }
                    }
                }

                return userId;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while updating the user.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating the user.", ex);
            }
        }

        public byte[] Export(IDataTablesRequest request, string gridType, string fileHeader, long userId, long periodId)
        {
            throw new NotImplementedException();
        }

        public ViewEntities.UserMaster Get(long id)
        {
            var result = this.FindItem(item => item.Id == id && item.IsActive == true);

            return this.mapper.Map<DBO.UserMaster, ViewEntities.UserMaster>(result);

        }

        public IEnumerable<UserMaster> GetList()
        {
            var results = this.FindItems(item => item.IsActive == true);
            if (results != null && results.Any())
            {
                return this.mapper.Map<IEnumerable<DBO.UserMaster>, IEnumerable<ViewEntities.UserMaster>>(results);
            }
            return new List<ViewEntities.UserMaster>();
        }

        public long Post(UserMaster item, IFormFileCollection postedFileCollection)
        {
            var mapperResult = this.mapper.Map<ViewEntities.UserMaster, DBO.UserMaster>(item);
            this.AddItem(mapperResult);
            return mapperResult.Id;
        }

        public long Post(UserMaster item)
        {
            var mapperResult = this.mapper.Map<ViewEntities.UserMaster, DBO.UserMaster>(item);
            AddItem(mapperResult);
            return mapperResult.Id;
        }

        public long Put(UserMaster item, IFormFileCollection postedFileCollection)
        {
            var mappedItem = this.mapper.Map<ViewEntities.UserMaster, DBO.UserMaster>(item);
            this.UpdateItem(mappedItem);
            return item.Id;
        }

        public long Put(UserMaster item)
        {
            var mappedItem = this.mapper.Map<ViewEntities.UserMaster, DBO.UserMaster>(item);
            this.UpdateItem(mappedItem);
            return item.Id;
        }

        public bool Remove(long id)
        {
            var user = this.FindById(id);
            if (user is not null)
            {
                user.IsActive = false;
                this.UpdateItem(user);
                return true;
            }
            return false;
        }

        public long AddorUpdateUser(IEnumerable<ViewEntities.UserMaster> items, long uid)
        {
            var existingRecords = this.FindItems(item => item.Id == uid && item.IsActive == true);
            if (existingRecords?.Count() > 0)
            {
                var itemToRemove = existingRecords.Where(item => !items.Any(availableItem => availableItem.Id == item.Id) && item.IsActive == true);
                foreach (var item in itemToRemove)
                {
                    item.IsActive = false;
                    this.UpdateItem(item);
                }
            }
            if (items != null && items?.Count() > 0)
            {
                var mapperResult = this.mapper.Map<IEnumerable<ViewEntities.UserMaster>, IEnumerable<DBO.UserMaster>>(items);
                foreach (var result in mapperResult)
                {
                    result.Id = uid;
                    result.IsActive = true;
                    var item = existingRecords?.Where(x => x.Id == result.Id)?.FirstOrDefault();
                    if (item?.Id > 0)
                    {
                        item.IsActive = result.IsActive;
                        this.UpdateItem(item);
                    }
                    else
                    {
                        this.AddItem(result);
                    }
                }
            }
            return uid;
        }

        // New methods for complete user operations
        //public long PostCompleteUser(UserMaster item)
        //{
        //    // 1. Insert UserMaster first
        //    var userId = this.Post(item);

        //    // 2. Handle nested objects using separate model methods
        //    if (item.UserLogin != null && !string.IsNullOrEmpty(item.UserLogin.Email))
        //    {
        //        item.UserLogin.UserID = userId;
        //        var userLoginModel = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context);
        //        userLoginModel.Post(item.UserLogin);
        //    }

        //    if (item.RoleMapping != null && item.RoleMapping.Id > 0)
        //    {
        //        item.RoleMapping.Id = (int)userId;
        //        var userRoleMappingModel = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context);
        //        userRoleMappingModel.Post(item.RoleMapping);
        //    }

        //    if (item.UserAddress != null && !string.IsNullOrEmpty(item.UserAddress.AddressLine1))
        //    {
        //        item.UserAddress.UserId = (int)userId;
        //        var userAddressModel = new UserAddressModel(this.config, this.mapper, this.iPrincipal, this.context);
        //        userAddressModel.Post(item.UserAddress);
        //    }

        //    return userId;
        //}

        //public long PutCompleteUser(UserMaster item)
        //{
        //    // 1. Update UserMaster
        //    var userId = this.Put(item);

        //    // 2. Handle nested objects using separate model upsert methods
        //    if (item.UserLogin != null)
        //    {
        //        item.UserLogin.UserID = userId;
        //        var userLoginModel = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context);
        //        userLoginModel.AddOrUpdate(item.UserLogin);
        //    }

        //    if (item.RoleMapping != null)
        //    {
        //        item.RoleMapping.Id = (int)userId;
        //        var userRoleMappingModel = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context);
        //        userRoleMappingModel.AddOrUpdate(item.RoleMapping);
        //    }

        //    if (item.UserAddress != null)
        //    {
        //        item.UserAddress.UserId = (int)userId;
        //        var userAddressModel = new UserAddressModel(this.config, this.mapper, this.iPrincipal, this.context);
        //        userAddressModel.AddOrUpdate(item.UserAddress);
        //    }

        //    return userId;
        //}

        //public UserMaster GetCompleteUser(long id)
        //{
        //    var userMaster = this.Get(id);
        //    if (userMaster != null)
        //    {
        //        // Load related data using separate model methods
        //        var userLoginModel = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context);
        //        var userRoleMappingModel = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context);
        //        var userAddressModel = new UserAddressModel(this.config, this.mapper, this.iPrincipal, this.context);

        //        userMaster.UserLogin = userLoginModel.GetByUserId(id);
        //        userMaster.RoleMapping = userRoleMappingModel.GetByUserId(id);
        //        userMaster.UserAddress = userAddressModel.GetByUserId(id);
        //    }
        //    return userMaster;
        //}


                public DofyEcom.Helper.ContactUsAddress GetAddress()
        {
            var result = new DofyEcom.Helper.ContactUsAddress();

            result.Address = this.config.Value?.ContactUsAddress_in_en?.Address ?? string.Empty;
            result.Phone = this.config.Value?.ContactUsAddress_in_en?.Phone ?? string.Empty;
            result.Timing = this.config.Value?.ContactUsAddress_in_en?.Timing ?? string.Empty;
            result.Email = this.config.Value?.ContactUsAddress_in_en?.Email ?? string.Empty;
            result.PromotionLinks = this.config.Value?.ContactUsAddress_in_en?.PromotionLinks != null ? this.config.Value?.ContactUsAddress_in_en?.PromotionLinks : null;

            return result;
        }


        public async Task<long> UpdateUserDetails(int? id, string? userName, string? Email, string? CustomerNumber)
        {
            try
            {
                var data = this.FindById((long)id);
                if(data == null) { return (long)id; }
                data.FullName = userName;
                this.Update(data);
                var userLoginModel = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context);
                var loginData = userLoginModel.FindItem(x => x.UserId == (long)id && x.IsActive == true);
                if(loginData != null)
                {
                    loginData.Email = Email;
                    loginData.Phone = CustomerNumber;
                    userLoginModel.Update(loginData);
                }
                return (long) id;
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while updating the user.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating the user.", ex);
            }
        }

        public async Task<bool> DeleteUser(int userId, bool isActive)
        {
            try
            {
                var user = this.FindById((long)userId);
                if (user == null) return false;
                user.IsActive = isActive;
                user.Modified = DateTime.UtcNow;
                this.UpdateItem(user);

                var userLoginModel = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context);
                var loginData = userLoginModel.FindItem(x => x.UserId == userId);
                if (loginData != null)
                {
                    loginData.IsActive = isActive;
                    loginData.Modified = DateTime.UtcNow;
                    userLoginModel.UpdateItem(loginData);
                }

                var userRoleMappingModel = new UserRoleMappingModel(this.config, this.mapper, this.iPrincipal, this.context);
                var roleData = userRoleMappingModel.FindItem(x => x.UserId == userId);
                if (roleData != null)
                {
                    roleData.IsActive = isActive;
                    roleData.Modified = DateTime.UtcNow;
                    userRoleMappingModel.UpdateItem(roleData);
                }
                return await Task.FromResult(true);
            }
            catch (SqlException sqlEx)
            {
                throw new ApplicationException("A database error occurred while updating the user status.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An unexpected error occurred while updating the user status.", ex);
            }
        }

        public async Task<bool> IsEmailOrPhoneExists(string? email, string? phone, int? excludeUserId = null)
        {
            var userLoginModel = new UserLoginModel(this.config, this.mapper, this.iPrincipal, this.context);

            if (!string.IsNullOrEmpty(email))
            {
                var existing = excludeUserId.HasValue
                    ? userLoginModel.FindItem(x => x.Email == email && x.IsActive == true && x.UserId != excludeUserId.Value)
                    : userLoginModel.FindItem(x => x.Email == email && x.IsActive == true);
                if (existing != null) return true;
            }

            if (!string.IsNullOrEmpty(phone))
            {
                var existing = excludeUserId.HasValue
                    ? userLoginModel.FindItem(x => x.Phone == phone && x.IsActive == true && x.UserId != excludeUserId.Value)
                    : userLoginModel.FindItem(x => x.Phone == phone && x.IsActive == true);
                if (existing != null) return true;
            }

            return false;
        }

        private async Task<string> UploadPartnerImages(IFormFile image,int userId, string baseFolder)
        {
            try
            {
                //string fileName = $"variant_{variantId}_{Guid.NewGuid():N}{Path.GetExtension(image.FileName)}";
                string filePath = $"{baseFolder}/{image.FileName}";

                if (this.config?.Value.AWSConfiguration?.EnableS3 == true)
                {
                    using (var stream = image.OpenReadStream())
                    {
                        await new S3ClientHelperService(this.config, this.GetS3FolderName(this.context.CountryCode)).FileUploadAsync(stream, filePath);
                    }
                }
                else
                {
                    string localPath = Path.Combine(this.config.Value.ApplicationConfiguration.AttachmentFilePath, baseFolder);
                    filePath = await SaveLocalAttachment(image, localPath, image.FileName);
                }

                return filePath;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Failed to upload variant image for userId {userId}", ex);
            }
        }

        private async Task<string> SaveLocalAttachment(IFormFile file, string absoluteFilePath, string fileName)
        {
            CreateDirectoryIfNotExist(absoluteFilePath);
            string fileFullPath = Path.Combine(absoluteFilePath, fileName);

            using (var stream = file.OpenReadStream())
            {
                byte[] bytesInStream = new byte[stream.Length];
                await stream.ReadAsync(bytesInStream, 0, bytesInStream.Length);
                await File.WriteAllBytesAsync(fileFullPath, bytesInStream);
            }

            return fileFullPath;
        }

        private void CreateDirectoryIfNotExist(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }




    }
}
