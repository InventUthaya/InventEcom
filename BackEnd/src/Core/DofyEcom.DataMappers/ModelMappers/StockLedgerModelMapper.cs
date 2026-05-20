namespace DofyEcom.DataMappers
{

    using AutoMapper;

    public class StockLedgerModelMapper : ITypeConverter<ViewEntities.StockLedger, DBO.StockLedger>
    {
        public DBO.StockLedger Convert(ViewEntities.StockLedger source, DBO.StockLedger destination, ResolutionContext context)
        {
            return new DBO.StockLedger
            {
                Id = source?.Id ?? 0,
                SkuId = source?.SkuId ?? 0,
                TransactionType = source?.TransactionType,
                Quantity = source?.Quantity ?? 0,
                ReferenceId = source?.ReferenceId,
                TransactionDate = source?.TransactionDate,
                Remarks = source?.Remarks,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source?.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source?.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }

}