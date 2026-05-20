namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class RiderAssignmentModelMapper : ITypeConverter<ViewEntities.RiderAssignment, DBO.RiderAssignment>
    {
        public DBO.RiderAssignment Convert(ViewEntities.RiderAssignment source, DBO.RiderAssignment destination, ResolutionContext context)
        {
            return new DBO.RiderAssignment
            {
                Id = source?.Id ?? 0,
                OrderId = source?.OrderId ?? 0,
                RiderId = source?.RiderId,
                CourierId = source?.CourierId,
                AssignedDate = source?.AssignedDate,
                StatusId = source?.StatusId,
                IsActive = source?.IsActive ?? true,
                DisplayInList = source?.DisplayInList ?? true,
                Created = source?.Created,
                CreatedBy = source.CreatedBy,
                Modified = source?.Modified,
                ModifiedBy = source.ModifiedBy,
                PartnerId = source?.PartnerId ?? null
            };
        }
    }
}
