using System;
using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class GradeMasterModelMapper : ITypeConverter<ViewEntities.GradeMaster, DBO.GradeMaster>
    {
        public DBO.GradeMaster Convert(ViewEntities.GradeMaster source, DBO.GradeMaster destination, ResolutionContext context)
        {
            if (source == null)
                return new DBO.GradeMaster();

            return new DBO.GradeMaster
            {
                Id = source.Id,
                GradeName = source.GradeName,
                Description = source.Description,
                IsActive = source.IsActive,
                DisplayInList = source.DisplayInList,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}