namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class DofyGeoModelMapper : ITypeConverter<ViewEntities.DofyGeo, DBO.DofyGeo>
    {
        public DBO.DofyGeo Convert(ViewEntities.DofyGeo source, DBO.DofyGeo destination, ResolutionContext context)
        {
            return new DBO.DofyGeo
            {
                Id = source?.Id ?? 0,
                Identifier = source?.Identifier ?? 0,
                Name = source?.Name,
                EnumName = source?.EnumName,
                Code = source?.Code,
                Level = source?.Level ?? 0,
                LevelName = source?.LevelName,
                Parent = source?.Parent ?? 0,
                RowOrder = source?.RowOrder ?? 0,
                DisplayInList = source?.DisplayInList ?? false,
                IsActive = source?.IsActive ?? false,
                Created = (DateTime)(source?.Created),
                CreatedBy = source?.CreatedBy ?? "0",
                Modified = (DateTime)(source?.Modified),
                ModifiedBy = source?.ModifiedBy ?? "0",
                SecondLanguage = source?.SecondLanguage,
                DeliveryDelay = source?.DeliveryDelay ?? 0,
                Distance = source?.Distance ?? 0,
                ClusterId = source?.ClusterId ?? 0,
                CutoffTime = source?.CutoffTime ?? default,
                DayCount = source?.DayCount ?? string.Empty,
            };
        }
    }
}
