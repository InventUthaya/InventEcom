using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace DofyEcom.ViewEntities
{
    public class ProductReviewViewModel
    {
        public string username;

        public int SkuId { get; set; }
        public int UserId { get; set; }

        public int Rating { get; set; }
        public string? ReviewText { get; set; }
        public string ReviewDescription { get; set; }

        public List<IFormFile>? Images { get; set; }
        public DateTime ReviewDate { get; set; }
        public string ImageBase64 { get; set; }
    }
}
