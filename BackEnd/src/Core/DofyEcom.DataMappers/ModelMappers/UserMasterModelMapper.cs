using AutoMapper;

namespace DofyEcom.DataMappers.ModelMappers
{
    public class UserMasterModelMapper : ITypeConverter<ViewEntities.UserMaster, DBO.UserMaster>
    {
        public DBO.UserMaster Convert(ViewEntities.UserMaster source, DBO.UserMaster destination, ResolutionContext context)
        {
            return new DBO.UserMaster
            {
                Id = source.Id,
                FullName = source.FullName,
                DisplayInList = source.DisplayInList,
                IsActive = source.IsActive,
                Created = source.Created,
                CreatedBy = source.CreatedBy,
                Modified = source.Modified,
                ModifiedBy = source.ModifiedBy
            };
        }
    }
}

