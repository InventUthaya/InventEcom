using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class UserAddressModelMapper : ITypeConverter<ViewEntities.UserAddress, DBO.UserAddress>
    {
        public DBO.UserAddress Convert(ViewEntities.UserAddress source, DBO.UserAddress destination, ResolutionContext context)
        {
            return new DBO.UserAddress
            {
                Id = source.Id,
                UserId = source.UserId,
                AddressLine1 = source.AddressLine1,
                AddressLine2 = source.AddressLine2,
                Name = source.Name,
                AddressType = source.AddressType,
                PhoneNumber = source.PhoneNumber,
                City = source.City,
                State = source.State,
                Pincode = source.Pincode,
                Country = source.Country,
                isDefault = source.isDefault,
                IsActive = source.IsActive,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy
            };
        }
    }
}
