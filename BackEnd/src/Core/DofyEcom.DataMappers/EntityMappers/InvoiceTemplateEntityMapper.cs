using AutoMapper;
namespace DofyEcom.DataMappers.EntityMappers;
public class InvoiceTemplateEntityMapper : ITypeConverter<DBO.InvoiceTemplate, ViewEntities.InvoiceTemplate>
{
    public ViewEntities.InvoiceTemplate Convert(DBO.InvoiceTemplate source, ViewEntities.InvoiceTemplate destination, ResolutionContext context)
    {
        if (source == null)
            return new ViewEntities.InvoiceTemplate();

        return new ViewEntities.InvoiceTemplate
        {
            Id = source.Id,
            InvoiceTypeId = source.InvoiceTypeId,
            EnumName = source.EnumName,
            Template = source.Template,
            IsActive = source.IsActive,
            Created = source.Created,
            CreatedBy = source.CreatedBy,
            Modified = source.Modified,
            ModifiedBy = source.ModifiedBy
        };
    }
}