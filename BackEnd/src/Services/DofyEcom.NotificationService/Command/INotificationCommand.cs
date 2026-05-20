namespace DofyEcom.NotificationService
{
    /// <summary>
    /// Command will host the actual job
    /// </summary>
    public interface INotificationCommand
    {
        void SendEmail(System.Net.Mail.SmtpClient smtpClient,string countryCode);

        void SendSMS(HttpClient httpClient, string countryCode);

        Task SendSMSUAE(HttpClient httpClient, string countryCode);
    }
}
