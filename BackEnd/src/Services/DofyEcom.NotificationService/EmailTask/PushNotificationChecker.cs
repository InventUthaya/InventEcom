namespace DofyEcom.NotificationService
{
    public class PushNotificationChecker
    {
        public long PersonId { get; set; }

        public long PushNotificationId { get; set; }

        public long Count { get; set; }

        public string FullName { get; set; }

        public string FCMToken { get; set; }

        public string ProductTypeName { get; set; }

        public string BrandMasterName { get; set; }

        public string BrandSeriesName { get; set; }

        public string SeriesModelName { get; set; }

        public string ThumbnailPath { get; set; }

        public string OrderCode { get; set; }

        public DateTime OrderDate { get; set; }
    }
}