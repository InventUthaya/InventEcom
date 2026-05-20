namespace DofyEcom.NotificationService
{
    public class SmsCountryBody
    {
        public SmsCountryNodesBody root { get; set; } = new SmsCountryNodesBody();
    }

    public class SmsCountryNodesBody
    {
        public string Text { get; set; }

        public string Number { get; set; }

        public string SenderId { get; set; }

        public string DRNotifyHttpMethod { get; set; }

        public string Tool { get; set; }
    }
}

