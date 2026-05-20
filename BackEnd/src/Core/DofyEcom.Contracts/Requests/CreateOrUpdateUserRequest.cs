using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DofyEcom.ViewEntities;
using Microsoft.AspNetCore.Http;

namespace DofyEcom.Contracts.Requests
{
    public class CreateOrUpdateUserRequest
    {
        public UserMaster User { get; set; }

        public UserLogin UserLogin { get; set; }

        public UserRoleMapping UserRole { get; set; }

        public List<UserAddress> UserAddresses { get; set; } 

        public PartnerMasterData? PartnerMaster { get; set; }

    }

    public class PartnerMasterData 
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string CompanyName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string GSTNumber { get; set; }
        public string PanCardNumber { get; set; }
        public string BankName { get; set; }
        public string IFSCCode { get; set; }
        public string AccountNumber { get; set; }
        public string AccountHolderName { get; set; }
        public long CommissionSlabId { get; set; }
        public IFormFile? ChequeLeaf { get; set; }
        public IFormFile? Signature { get; set; }
    }

}
