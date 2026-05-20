using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers
{
    public class PaymentTransactionModelMapper : ITypeConverter<ViewEntities.PaymentTransaction, DBO.PaymentTransaction>
    {
        public DBO.PaymentTransaction Convert(ViewEntities.PaymentTransaction source, DBO.PaymentTransaction destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.PaymentTransaction();

            return new DBO.PaymentTransaction
            {
                Id = source?.Id ?? 0,
                OrderId = source?.OrderId ?? 0,
                PaymentMethod = source?.PaymentMethod,
                TransactionRef = source?.TransactionRef,
                Amount = source?.Amount ?? 0,
                PaidOn = source?.PaidOn,
                StatusId = source?.StatusId ?? 0,
                DisplayInList = source?.DisplayInList ?? false,
                IsActive = source?.IsActive ?? false,
                Created = source?.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
