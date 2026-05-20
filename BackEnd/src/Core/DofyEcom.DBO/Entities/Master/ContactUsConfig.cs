namespace DofyEcom.DBO
{
    public class ContactUsConfig : EntityBase
    {
        public string Name { get; set; }

        public string EnumName { get; set; }

        public string WhatsAppPhone { get; set; }

        public string BuyPhone { get; set; }

        public string OrderPhone { get; set; }

        public string Address { get; set; }

        public string BuyEmail { get; set; }

        public string OrderEmail { get; set; }

        public string BusinessEmail { get; set; }

        public string? FaceBookLink { get; set; }

        public string? InstagramLink { get; set; }

        public string? LinkedInLink { get; set; }

        public string? TikTokLink { get; set; }

        public string? YouTubeLink { get; set; }

        public string? TwitterLink { get; set; }

        public bool Published { get; set; }

        public DateTime CreatedOnUtc { get; set; }

        public DateTime UpdatedOnUtc { get; set; }

        public string TCNNumber { get; set; }

        public int? PartnerId { get; set; }

    }
}
