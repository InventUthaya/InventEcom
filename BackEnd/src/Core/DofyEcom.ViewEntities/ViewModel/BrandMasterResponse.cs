using System;

namespace DofyEcom.ViewEntities
{
    public class BrandMasterResponse
    {
        public int Id { get; set; }
        public string BrandName { get; set; }
        public string Description { get; set; }
        public int IsActive { get; set; }
        public int DisplayInList { get; set; }
        public string ImagePath { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Modified { get; set; }
        public int? PartnerId { get; set; }
        public int TotalCount { get; set; }
    }
}
