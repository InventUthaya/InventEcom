using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class PaymentTransactionEntityMapper : ITypeConverter<DBO.PaymentTransaction, ViewEntities.PaymentTransaction>
    {
        public ViewEntities.PaymentTransaction Convert(DBO.PaymentTransaction source, ViewEntities.PaymentTransaction destination, ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.PaymentTransaction();

            return new ViewEntities.PaymentTransaction
            {
                Id = source.Id,
                OrderId = source.OrderId,
                PaymentMethod = source.PaymentMethod,
                TransactionRef = source.TransactionRef,
                Amount = source.Amount,
                PaidOn = source.PaidOn,
                StatusId = source.StatusId,
                DisplayInList = source.DisplayInList,
                Reason = string.Empty,
                IsActive = source.IsActive,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy
            };
        }
    }
}
