namespace DofyEcom.DataMappers
{
    using AutoMapper;

    public class ContactUsConfigEntityMapper : ITypeConverter<DBO.ContactUsConfig, ViewEntities.ContactUsConfig>
    {
        public ViewEntities.ContactUsConfig Convert(DBO.ContactUsConfig source, ViewEntities.ContactUsConfig destination, ResolutionContext context)
        {
            return new ViewEntities.ContactUsConfig
            {
                Id = source?.Id ?? 0,
                Name = source?.Name ?? string.Empty,
                EnumName = source?.EnumName ?? string.Empty,
                WhatsAppPhone = source?.WhatsAppPhone ?? string.Empty,
                BuyPhone = source?.BuyPhone ?? string.Empty,
                OrderPhone = source?.OrderPhone ?? string.Empty,
                Address = source?.Address ?? string.Empty,
                BuyEmail = source?.BuyEmail ?? string.Empty,
                OrderEmail =source?.OrderEmail ?? string.Empty,
                BusinessEmail = source?.BusinessEmail ?? string.Empty,
                FaceBookLink = source?.FaceBookLink ?? string.Empty,
                InstagramLink = source?.InstagramLink ?? string.Empty,
                LinkedInLink = source?.LinkedInLink ?? string.Empty,
                TikTokLink = source?.TikTokLink ?? string.Empty,
                YouTubeLink = source?.YouTubeLink ?? string.Empty,
                TwitterLink = source?.TwitterLink ?? string.Empty,
                Published = source?.Published ?? false,
                CreatedOnUtc = source?.CreatedOnUtc ?? DateTime.MinValue,
                UpdatedOnUtc = source?.UpdatedOnUtc ?? DateTime.MinValue,
                TCNNumber = source?.TCNNumber ?? string.Empty,
            };
        }
    }
}