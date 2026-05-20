using AutoMapper;

namespace DofyEcom.DataMappers.EntityMappers
{
    public class StatusEntityMapper: ITypeConverter<DBO.StatusMaster, ViewEntities.StatusMaster>{
        public ViewEntities.StatusMaster Convert(
            DBO.StatusMaster source,
            ViewEntities.StatusMaster destination,
            ResolutionContext context)
        {
            if (source == null)
                return new ViewEntities.StatusMaster();

            return new ViewEntities.StatusMaster
            {
                Id = source.Id,
                StatusType = source.StatusType,
                StatusName = source.StatusName,
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
