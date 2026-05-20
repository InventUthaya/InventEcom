using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities.ViewModel
{
    public class UserDetailsViewModel
    {

        public int UserId { get; set; }
        public string FullName { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public DateTime? Created { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? Modified { get; set; }
        public string ModifiedBy { get; set; }

        public IEnumerable<UserLoginResponse>? UserLogin { get; set; } = new List<UserLoginResponse>();
        public IEnumerable<UserRoleResponse>? UserRoles { get; set; } = new List<UserRoleResponse>();
        public IEnumerable<UserAddressResponse>? UserAddresses { get; set; } = new List<UserAddressResponse>();

        public IEnumerable<PartnerResponse>? PartnerMaster { get; set; } = new List<PartnerResponse>();
    }

    public class UserLoginResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public DateTime? Created { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? Modified { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class UserRoleResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public DateTime? Created { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? Modified { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class UserAddressResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string AddressType { get; set;}
        public int UserId { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Pincode { get; set; }
        public string Country { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public DateTime? Created { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? Modified { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class PartnerResponse
    {
        public int Id { get; set; }
        public long userId { get; set; }
        public string Name { get; set; }
        public string CompanyName { get; set; }
        public int commissionSlabId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string GSTNumber { get; set; }
        public string PanCardNumber { get; set; }
        public string BankName { get; set; }
        public string IFSCCode { get; set; }
        public string AccountNumber { get; set; }
        public string AccountHolderName { get; set; }
        public string ChequeLeaf { get; set; }
        public string Signature { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public string ModifiedBy { get; set; }

    }
}
