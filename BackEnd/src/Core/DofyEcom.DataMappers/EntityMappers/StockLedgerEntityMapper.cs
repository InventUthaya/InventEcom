namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class StockLedgerEntityMapper : ITypeConverter<DBO.StockLedger, ViewEntities.StockLedger>
    {
        public ViewEntities.StockLedger Convert(DBO.StockLedger source, ViewEntities.StockLedger destination, ResolutionContext context)
        {
            return new ViewEntities.StockLedger
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