using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DofyEcom.ViewEntities
{
    public class TaxPaginationResponse
    {
        public int Id { get; set; }
        public decimal? Igst { get; set; }
        public decimal? Cgst { get; set; }
        public decimal? Sgst { get; set; }
        public decimal? Tds { get; set; }
        public bool DisplayInList { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public int? PartnerId { get; set; }
        public bool IsActive { get; set; }
        public DateTime Created { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? Modified { get; set; }
        public string? ModifiedBy { get; set; }
        public int TotalCount { get; set; }
    }

    public class TaxPaginationResultViewModel
    {
        public List<TaxPaginationResponse> Taxes { get; set; } = new List<TaxPaginationResponse>();
        public int TotalRecords { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
