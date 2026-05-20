using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class InvoiceTemplateModelMapper : ITypeConverter<ViewEntities.InvoiceTemplate, DBO.InvoiceTemplate>
    {
        public DBO.InvoiceTemplate Convert(ViewEntities.InvoiceTemplate source, DBO.InvoiceTemplate destination, ResolutionContext context)
        {
            return new DBO.InvoiceTemplate
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
}
