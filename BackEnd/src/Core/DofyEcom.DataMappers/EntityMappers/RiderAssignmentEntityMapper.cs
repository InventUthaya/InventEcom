namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class RiderAssignmentEntityMapper : ITypeConverter<DBO.RiderAssignment, ViewEntities.RiderAssignment>
    {
        public ViewEntities.RiderAssignment Convert(DBO.RiderAssignment source, ViewEntities.RiderAssignment destination, ResolutionContext context)
        {
            return new ViewEntities.RiderAssignment
            {
                Id = source.Id,
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
