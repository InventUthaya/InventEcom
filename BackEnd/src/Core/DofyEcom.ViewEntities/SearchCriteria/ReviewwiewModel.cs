using Microsoft.AspNetCore.Http;

namespace DofyEcom.ViewEntities.ViewModel
{
    public class ReviewViewModel
    {
        public int SkuId { get; set; }
        public int UserId { get; set; }

        public int Rating { get; set; }
        public string? ReviewText { get; set; }
        public string ReviewDescription { get; set; }

        public List<IFormFile>? Images { get; set; }
    }
}

