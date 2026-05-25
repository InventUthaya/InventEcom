using Org.BouncyCastle.Asn1.Ocsp;

namespace DofyEcom.ViewEntities.SearchCriteria
{
    public class PromoListCriteria
    {
        public int pageIndex { get; set; } = 0;
        public int pageSize { get; set; } = 20;

        public bool? IsActive { get; set; }   // true / false / null (all)

        public string? SearchText { get; set; }
        public string sortColumn { get; set; } = "Created";
        public string sortOrder { get; set; } = "DESC";
        public int? PartnerId { get; set; }
    }
}
