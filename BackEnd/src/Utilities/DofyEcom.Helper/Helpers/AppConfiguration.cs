namespace DofyEcom.Helper
{
    using Microsoft.Extensions.Configuration;

    public class AppConfiguration
    {
        public AppConfiguration()
        {

        }

        public DBConfiguration DBConfiguration { get; set; }

        //public IConfiguration Configuration { get; set; }

        public ProfileImagePathConfiguration ProfileImagePathConfiguration { get; set; }

        public EmailConfiguration EmailConfiguration { get; set; }

        public SMSConfiguration SMSConfiguration { get; set; }

        public SMSConfigurationUAE SMSConfigurationUAE { get; set; }

        public DatabaseConfiguration DatabaseConfiguration { get; set; }

        public ApplicationConfiguration ApplicationConfiguration { get; set; }

        public EncryptionConfiguration EncryptionConfiguration { get; set; }

        public AWSConfiguration AWSConfiguration { get; set; }

        public ContactUsAddress ContactUsAddress_in_en { get; set; }

        public ContactUsAddress ContactUsAddress_ae_en { get; set; }

        public ContactUsAddress ContactUsAddress_ae_ar { get; set; }

        public ContactUsAddress ContactUsAddress_Tamilnadu { get; set; }

        public ContactUsAddress ContactUsAddress_Telangana { get; set; }

        public ContactUsAddress ContactUsAddress_Kerala { get; set; }

        public ContactUsAddress ContactUsAddress_Karnataka { get; set; }

        public ContactUsAddress ContactUsAddress_Maharashtra { get; set; }

        public ContactUsAddress ContactUsAddress_Andhra_Pradesh { get; set; }

        public ContactUsAddress ContactUsAddress_Pondicherry { get; set; }

        public ContactUsAddress ContactUsAddress_Dubai { get; set; }

        public ContactUsAddress ContactUsAddress_Sharjah { get; set; }

        public ContactUsAddress ContactUsAddress_Ajman { get; set; }

        public AboutUsRiders AboutUsRiders { get; set; }

        public IOSAPNSConfiguration IOSAPNSConfiguration { get; set; }

        public ServiceConfigurationIn ServiceConfigurationIn { get; set; }

        public ServiceConfigurationUAE ServiceConfigurationUAE { get; set; }

        public AESEncryptionConfiguration AESEncryptionConfiguration { get; set; }

        public StripeConfig StripeConfig { get; set; }
        public PayPalConfig PayPalConfig { get; set; }

        public EnableReturnButton EnableReturnButton { get; set; }


    }
    public class EnableReturnButton
        {
            public string ReturnDays { get; set; }
        }

    public class StripeConfig
    {
        public string AttachmentPath { get; set; }
        public string MasterDataFromCache { get; set; }
        public string AdminURL { get; set; }
        public string VerificationLink { get; set; }
        public string ResetLink { get; set; }
        public string Stripe_Secret_Key { get; set; }
        public string Stripe_Public_Key { get; set; }
    }

    public class PayPalConfig
    {
        public string PayPal_Client_Key { get; set; }
        public string PayPal_Secret_Key { get; set; }
    }

    public record DBConfiguration
    {
        public string CoreDBConnectionString { get; set; }
    }

    public class ServiceConfigurationIn
    {
        public bool EnableOTPSMS { get; set; }

        public bool EnableOtherSMS { get; set; }

        public bool EnableEmail { get; set; }

        public bool EnablePushNotification { get; set; }

        public bool EnableMisReport { get; set; }
    }

    public class ServiceConfigurationUAE
    {
        public bool EnableOTPSMS { get; set; }

        public bool EnableOtherSMS { get; set; }

        public bool EnableEmail { get; set; }

        public bool EnablePushNotification { get; set; }

        public bool EnableMisReport { get; set; }
    }

    public class ProfileImagePathConfiguration
    {
        public string ImagePath { get; set; }
    }

    public class ContactUsAddress
    {
        public string Address { get; set; }

        public string Phone { get; set; }

        public string SellRelatedQueriesPhone { get; set; }

        public string SellOrderQueriesPhone { get; set; }

        public string Timing { get; set; }

        public string Email { get; set; }

        public string SellRelatedQueriesEmail { get; set; }

        public string SellOrderQueriesEmail { get; set; }

        public string BusinessQueriesEmail { get; set; }

        public CorporateTradeIn? CorporateTradeIn { get; set; }

        public BecomePartner? BecomePartner { get; set; }

        public PromotionLinks? PromotionLinks { get; set; }
    }

    public class PromotionLinks
    {
        public string faceBook { get; set; }

        public string instagram { get; set; }

        public string linkedIn { get; set; }

        public string tikTok { get; set; }

        public string youTube { get; set; }

        public string Twitter { get; set; }
    }

    public class CorporateTradeIn
    {
        public string SellRelatedQueriesPhone { get; set; }

        public string BusinessQueriesEmail { get; set; }
    }

    public class BecomePartner
    {
        public string SellRelatedQueriesPhone { get; set; }

        public string BusinessQueriesEmail { get; set; }
    }

    public class AboutUsRiders
    {
        public string RiderNumber { get; set; }

        public string RandomThreshold { get; set; }

        public int AnimationTime { get; set; }
    }

    public class IOSAPNSConfiguration
    {
        public string BundleId { get; set; }

        public string KeyId { get; set; }

        public string TeamId { get; set; }

        public string ApnsAuthKeyPath { get; set; }

        public string ApnsURL { get; set; }

        public string ProdURL { get; set; }

    }

    public class EmailConfiguration
    {
        public string EmailFromAddressDisplayName { get; set; }

        public string SMTPClientHostName { get; set; }

        public int SMTPClientPort { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public bool EnableSSL { get; set; }

        public string SMTPDeliveryFormat { get; set; }

        public string SMTPDeliveryMethod { get; set; }

        public string SMTPEmailFromAddress { get; set; }

        public string DevEnvironmentToEmailAddress { get; set; }

        public long DailyEmailTime { get; set; }

        public string MISReportToMail { get; set; }
    }

    public class SMSConfiguration
    {
        public string SenderName { get; set; }

        public string SMSSendAPIURL { get; set; }

        public string GlobalMessage { get; set; }

        public string SMSServiceType { get; set; }

        public string SMSFormat { get; set; }

        public string SMSProvider { get; set; }

        public string AuthorizationKey { get; set; }

        public string DevEnvironmentToMobile { get; set; }
    }

    public class SMSConfigurationUAE
    {
        public string SenderId { get; set; }

        public string DRNotifyHttpMethod { get; set; }

        public string Tool { get; set; }

        public string SMSSendAPIURL { get; set; }

        public string AuthKey { get; set; }

        public string AuthToken { get; set; }

        public string Authorization { get; set; }

        public string DevEnvironmentToMobile { get; set; }
    }

    public class DatabaseConfiguration
    {
        public string ConnectionStringIndia { get; set; }

        public string ConnectionStringUAE { get; set; }

        public string ProviderName { get; set; }
    }

    public class ApplicationConfiguration
    {
        public string BaseSecurityAPIkey { get; set; }

        public string ReportSecurityAPIKey { get; set; }

        public string BaseURL { get; set; }

        public string PublicURL { get; set; }

        public string AdminURL { get; set; }

        public string ReportBaseURL { get; set; }

        public bool MasterDataFromCache { get; set; }

        public string ApplicationURL { get; set; }

        public string DofyContactNo { get; set; }

        public long TimerValue { get; set; }

        public long RetryCount { get; set; }

        public string AttachmentFilePath { get; set; }

        public string AttachmentFilePathForImport { get; set; }

        public string AppstoreURL { get; set; }

        public string PlaystoreURL { get; set; }

        public string EmailImagePath { get; set; }

        public string InvoiceTemplatesPath { get; set; }

        public long AppUpdateDuration { get; set; }

        public string CDN { get; set; }

        public long PushNotificationCoolingPeriod { get; set; }

        public long PushNotificationMaxCount { get; set; }

        public string CDNPath { get; set; }

        public string DefaultOtp {  get; set; }

        public string StripSecretKey { get; set; }

        public string StripPublishableKey { get; set; }
    }

    public class EncryptionConfiguration
    {
        public string Issuer { get; set; }

        public string Audience { get; set; }

        public string GrantType { get; set; }

        public string SecurityKey { get; set; }

        public string ClientSecrect { get; set; }

        public int ExpirationInMinutes { get; set; }

        public string DataBase { get; set; }

        public int RandomDigitsCount { get; set; }

        public int OTPExpirationInMinutes { get; set; }

        public bool IsDefaultPassword { get; set; }

        public string DefaultPassword { get; set; }

        public string AES_EncryptionKey { get; set; }
    }

    public class AWSConfiguration
    {
        public string AWSRegion { get; set; }

        public string AWSAccessKey { get; set; }

        public string AWSSecretKey { get; set; }

        public string AWSBucketName { get; set; }

        public string Environment { get; set; }

        public bool EnableS3 { get; set; }
    }

    public class AESEncryptionConfiguration
    {
        public string EncryptionKey { get; set; }
    }
}
