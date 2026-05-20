using DofyEcom.DBO;
using DofyEcom.Helper.Attributes;

namespace DofyEcom.DBO;

public class LocateOurStores : EntityBase
{
    public string Address { get; set; }

    public int StateId { get; set; }

    public int CityId { get; set; }

    public string Area { get; set; }

    public int Pincode { get; set; }

    public string Location { get; set; }

    public string Contact1 { get; set; }
    [DBIgnore]
    public string EncryptedId { get; set; }

    public string Contact2 { get; set; }

    public string Timing { get; set; }

    public string Image { get; set; }

    public DateTime CreatedOnUtc { get; set; }

    public DateTime UpdatedOnUtc { get; set; }
    public int? PartnerId { get; set; }

}
