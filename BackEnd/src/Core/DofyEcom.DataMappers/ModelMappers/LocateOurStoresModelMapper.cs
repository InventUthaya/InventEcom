namespace DofyEcom.DataMappers;

using AutoMapper;

public class LocateOurStoresModelMapper : ITypeConverter<ViewEntities.LocateOurStores, DBO.LocateOurStores>
{
    public DBO.LocateOurStores Convert(ViewEntities.LocateOurStores source, DBO.LocateOurStores destination, ResolutionContext context)
    {
        return new DBO.LocateOurStores
        {
            Id = source?.Id ?? 0,
            Address = source?.Address ?? null,
            StateId = source?.StateId ?? 0,
            CityId = source?.CityId ?? 0,
            Area = source?.Area ?? null,
            Pincode = source?.Pincode ?? 0,
            Location = source?.Location ?? null,
            Contact1 = source?.Contact1 ?? null,
            Contact2 = source?.Contact2 ?? null,
            Timing = source?.Timing ?? null,
            Image = source?.Image ?? null,
            CreatedOnUtc = source?.CreatedOnUtc ?? DateTime.MinValue,
            UpdatedOnUtc = source?.UpdatedOnUtc ?? DateTime.MinValue,
            PartnerId = source?.PartnerId ?? null
        };
    }
}

