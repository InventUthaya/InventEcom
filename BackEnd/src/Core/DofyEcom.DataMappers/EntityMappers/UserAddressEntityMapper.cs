using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class UserAddressEntityMapper : ITypeConverter<DBO.UserAddress, ViewEntities.UserAddress>
    {

        public ViewEntities.UserAddress Convert(DBO.UserAddress source, ViewEntities.UserAddress destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.UserAddress();

            return new ViewEntities.UserAddress
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
