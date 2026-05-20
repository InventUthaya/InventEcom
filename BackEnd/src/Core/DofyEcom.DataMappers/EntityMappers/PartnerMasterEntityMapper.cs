using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class PartnerMasterEntityMapper : ITypeConverter<DBO.PartnerMaster, ViewEntities.PartnerMaster>
    {
        public ViewEntities.PartnerMaster Convert(DBO.PartnerMaster source, ViewEntities.PartnerMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.PartnerMaster();

            return new ViewEntities.PartnerMaster
            {
                Id = source.Id,
                UserId = source.UserId,
                CommissionSlabId = source.CommissionSlabId,
                CompanyName = source.CompanyName,
                Name = source.Name,
                Email = source.Email,
                PhoneNumber = source.PhoneNumber,
                GSTNumber = source.GSTNumber,
                PanCardNumber = source.PanCardNumber,
                BankName = source.BankName,
                IFSCCode = source.IFSCCode,
                AccountNumber = source.AccountNumber,
                AccountHolderName = source.AccountHolderName,
                ChequeLeaf = source.ChequeLeaf,
                Signature = source.Signature,
                IsActive = source.IsActive,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy
            };
        }
    }
}
