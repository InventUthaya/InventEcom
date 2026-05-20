using DofyEcom.ViewEntities;

namespace DofyEcom.Contracts
{
    public interface IInvoiceTemplateModel : IEntityModel<InvoiceTemplate>
    {
        Task<ViewEntities.InvoiceTemplate> GetTypeByEnum(string EnumName);

    }
}
