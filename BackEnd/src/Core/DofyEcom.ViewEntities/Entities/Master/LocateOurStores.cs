using DofyEcom.Helper.Attributes;
using DofyEcom.ViewEntities;

namespace DofyEcom.ViewEntities;

public class LocateOurStores : EntityBase
{
    public string Address { get; set; }

    public int StateId { get; set; }

    public int CityId { get; set; }

    public string Area { get; set; }

    public int Pincode { get; set; }

    public string Location { get; set; }

    public string Contact1 { get; set; }

    public string Contact2 { get; set; }

    [DBIgnore]
    public string EncryptedId { get; set; }
    public string Timing { get; set; }

    public string Image { get; set; }

    public DateTime CreatedOnUtc { get; set; }

    public DateTime UpdatedOnUtc { get; set; }
    public int? PartnerId { get; set; }

}

public class LocateOurStoresSearch : EntityBase
{
    public string Address { get; set; }

    public int StateId { get; set; }

    public int CityId { get; set; }

    public string Area { get; set; }

    public int Pincode { get; set; }

    public string Location { get; set; }

    public string Contact1 { get; set; }

    public string Contact2 { get; set; }

    public string Timing { get; set; }

    public string Image { get; set; }

    public int? TotalRowsCount { get; set; }

    public string StateName { get; set; }

    public string CityName { get; set; }

    public string VillageName { get; set; }

    public string CountryName { get; set; }

    public DateTime CreatedOnUtc { get; set; }

    public DateTime UpdatedOnUtc { get; set; }

}
