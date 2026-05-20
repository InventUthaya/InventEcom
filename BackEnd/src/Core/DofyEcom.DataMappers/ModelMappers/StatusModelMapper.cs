namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class StatusModelMapper
        : ITypeConverter<ViewEntities.StatusMaster, DBO.StatusMaster>
    {
        public DBO.StatusMaster Convert(
            ViewEntities.StatusMaster source,
            DBO.StatusMaster destination,
            ResolutionContext context)
        {
            if (source == null)
                return new DBO.StatusMaster();

            return new DBO.StatusMaster
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
