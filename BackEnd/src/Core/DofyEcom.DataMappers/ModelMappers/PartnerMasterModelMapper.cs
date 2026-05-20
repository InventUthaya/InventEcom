using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class PartnerMasterModelMapper : ITypeConverter<ViewEntities.PartnerMaster, DBO.PartnerMaster>
    {
        public DBO.PartnerMaster Convert(ViewEntities.PartnerMaster source, DBO.PartnerMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.PartnerMaster();

            return new DBO.PartnerMaster
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