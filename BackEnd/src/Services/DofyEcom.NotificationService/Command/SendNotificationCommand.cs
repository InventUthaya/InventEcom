namespace DofyEcom.NotificationService
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net;
    using System.Net.Mail;
    using System.Text;
    using System.Threading.Tasks;
    using DofyEcom.Helper;
    using Extensions;
    using Microsoft.Extensions.Options;
    using Newtonsoft.Json;
    using Serilog;

    public class SendNotificationCommand : INotificationCommand
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;

        private PendingTask NotificationTask;

        public SendNotificationCommand(PendingTask task, IOptionsSnapshot<AppConfiguration> _AppConfiguration)
        {
            this.NotificationTask = task;
            this.appConfiguration = _AppConfiguration;
        }

        /// <summary>
        /// method that actually sends email
        /// </summary>
        public void SendEmail(SmtpClient smtpClient, string countryCode)
        {
            ITaskChecker<PendingTask> taskChecker = new PendingTaskChecker(this.appConfiguration);
            taskChecker.UpdateRetryCount(this.NotificationTask, countryCode);

            using MailMessage message = new MailMessage();
            message.IsBodyHtml = true;

            string fromAddress = string.Concat(this.appConfiguration.Value.EmailConfiguration.EmailFromAddressDisplayName, '<',
                                                    this.appConfiguration.Value.EmailConfiguration.SMTPEmailFromAddress, '>');
            message.From = new MailAddress(fromAddress);
            string ccAddress = FormatMultipleEmailAddresses(this.NotificationTask?.EmailCC);
            string bccAddress = FormatMultipleEmailAddresses(this.NotificationTask?.EmailBCC);

            if (!string.IsNullOrEmpty(this.appConfiguration.Value.EmailConfiguration.DevEnvironmentToEmailAddress))
            {
                this.NotificationTask.EmailTo = this.appConfiguration.Value.EmailConfiguration.DevEnvironmentToEmailAddress;
                this.NotificationTask.EmailSubject = string.Concat("Dev Env:", this.NotificationTask.EmailSubject);
            }
            this.NotificationTask.EmailFrom = fromAddress;

            string toAddress = this.FormatMultipleEmailAddresses(this.NotificationTask?.EmailTo);
            message.To.Add(toAddress);

            message.Body = this.NotificationTask.Template;
            message.Subject = this.NotificationTask.EmailSubject.Replace('\r', ' ').Replace('\n', ' ');

            if (!string.IsNullOrEmpty(this.NotificationTask.Parms))
            {
                Dictionary<string, string> parms = this.ParseParams(this.NotificationTask.Parms);
                message.Body = this.NotificationTask.Template?.FormatWith(parms);
                message.Subject = message.Subject?.FormatWith(parms);

                if (!string.IsNullOrEmpty(this.NotificationTask.AdditionalInformation) && string.IsNullOrEmpty(this.NotificationTask.Attachment))
                {
                    message.Body = string.Concat(message.Body, this.NotificationTask.AdditionalInformation.FormatWith(parms));
                }
            }

            if (!string.IsNullOrEmpty(this.NotificationTask.AdditionalInformation) && !string.IsNullOrEmpty(this.NotificationTask.Attachment))
            {
                this.AddReportAttachments(message);
            }
            else
            {
                this.AddEmailAttachments(message);
            }

            try
            {
                message.Body = message.Body.FormatBody();
                smtpClient.Send(message);

                this.NotificationTask.Template = message.Body;

                // mark the pendingEmail as processed so that it is not picked up in the future
                taskChecker.MarkTaskAsProcessed(this.NotificationTask, countryCode);
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, $"Email Sending Exception Occur:{this.NotificationTask.Id}");
            }
        }

        public void SendSMS(HttpClient httpClient, string countryCode)
        {
            ITaskChecker<PendingTask> taskChecker = new PendingTaskChecker(this.appConfiguration);
            taskChecker.UpdateRetryCount(this.NotificationTask, countryCode);

            string apiurl = this.appConfiguration.Value?.SMSConfiguration?.SMSSendAPIURL ?? string.Empty;
            if (!string.IsNullOrEmpty(apiurl))
            {
                try
                {
                    if (!string.IsNullOrEmpty(this.appConfiguration.Value?.SMSConfiguration?.DevEnvironmentToMobile))
                    {
                        this.NotificationTask.EmailTo = this.appConfiguration.Value.SMSConfiguration.DevEnvironmentToMobile;
                    }

                    string smsContent = this.NotificationTask.Template;
                    string templateId = this.NotificationTask.EmailTemplatesTemplateId;

                    if (!string.IsNullOrEmpty(this.NotificationTask.Parms))
                    {
                        Dictionary<string, string> parms = this.ParseParams(this.NotificationTask.Parms);
                        smsContent = this.NotificationTask.Template?.FormatWith(parms) ?? string.Empty;
                    }

                    QikBerryNewBody bodyContent =new QikBerryNewBody()
                    {
                        to = this.NotificationTask?.EmailTo?.Length == 10 ? string.Concat("91", this.NotificationTask.EmailTo) : this.NotificationTask.EmailTo,
                        message = smsContent,
                        sender = this.appConfiguration.Value?.SMSConfiguration?.SenderName ?? "QIKBRY",
                        template_id = templateId,
                        service = this.appConfiguration.Value?.SMSConfiguration?.SMSServiceType ?? "T",
                    };

                    var json = JsonConvert.SerializeObject(bodyContent);
                    var stringContent = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                    var response = httpClient.PostAsync(apiurl, stringContent).Result;
                    string responseResult = response.Content.ReadAsStringAsync().Result;

                    if (response.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        this.NotificationTask.Template = smsContent;

                        // mark the pendingSMS as processed so that it is not picked up in the future
                        taskChecker.MarkTaskAsProcessed(this.NotificationTask, countryCode);
                    }
                    else
                    {
                        Log.Error($"SMS Sending Error Occured:{response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    Log.Fatal(ex, $"SMS Sending Exception Occur:{this.NotificationTask.Id}");
                }
            }
            else
            {
                Log.Error($"SMS Sending has been stopped or not working due to configiration, ApiUrl not available: {apiurl.Length <= 0}");
            }
        }

        public async Task SendSMSUAE(HttpClient httpClient,string countryCode)
        {
            ITaskChecker<PendingTask> taskChecker = new PendingTaskChecker(this.appConfiguration);
            taskChecker.UpdateRetryCount(this.NotificationTask, countryCode);

            string apiurl = this.appConfiguration.Value?.SMSConfigurationUAE?.SMSSendAPIURL ?? string.Empty;

            if (!string.IsNullOrEmpty(apiurl))
            {
                try
                {
                    // Check for dev environment overrides
                    if (!string.IsNullOrEmpty(this.appConfiguration.Value?.SMSConfigurationUAE?.DevEnvironmentToMobile))
                    {
                        this.NotificationTask.EmailTo = this.appConfiguration.Value.SMSConfigurationUAE.DevEnvironmentToMobile;
                    }

                    string smsContent = this.NotificationTask.Template;
                    if (!string.IsNullOrEmpty(this.NotificationTask.Parms))
                    {
                        Dictionary<string, string> parms = this.ParseParams(this.NotificationTask.Parms);
                        smsContent = this.NotificationTask.Template?.FormatWith(parms) ?? string.Empty;
                    }

                    var bodyContent = new SmsCountryNodesBody()
                    {
                        Text = smsContent,
                        Number = string.Concat("971" + (this.NotificationTask.EmailTo.StartsWith("0") ? this.NotificationTask.EmailTo.Substring(1) : this.NotificationTask.EmailTo)),
                        SenderId = this.appConfiguration.Value?.SMSConfigurationUAE?.SenderId ?? string.Empty,
                        DRNotifyHttpMethod = this.appConfiguration.Value?.SMSConfigurationUAE?.DRNotifyHttpMethod ?? string.Empty,
                        Tool = this.appConfiguration.Value?.SMSConfigurationUAE?.Tool ?? string.Empty
                    };

                    var json = JsonConvert.SerializeObject(bodyContent);
                    var stringContent = new StringContent(json, Encoding.UTF8, "application/json");

                    // Set the authorization header
                    var encodedURL = apiurl.Replace("authKey", this.appConfiguration.Value?.SMSConfigurationUAE?.AuthKey);
                    var response = httpClient.PostAsync(encodedURL, stringContent).Result;
                    string responseResult = response.Content.ReadAsStringAsync().Result;

                    if (response.StatusCode == System.Net.HttpStatusCode.Accepted)
                    {
                        this.NotificationTask.Template = smsContent;
                        taskChecker.MarkTaskAsProcessed(this.NotificationTask, countryCode);
                    }
                    else
                    {
                        Log.Error($"SMS Sending Error Occurred: {response.StatusCode}, Response: {responseResult}");
                    }
                }
                catch (Exception ex)
                {
                    Log.Fatal(ex, $"SMS Sending Exception Occurred: {this.NotificationTask.Id}");
                }
            }
            else
            {
                Log.Error($"SMS Sending has been stopped or not working due to configuration. ApiUrl not available: {apiurl.Length <= 0}");
            }
        }

        private Dictionary<string, string> ParseParams(string parameters)
        {
            var parms = new Dictionary<string, string>();
            string[] parmArray = parameters?.Split(',');
            foreach (string parm in parmArray)
            {
                // string should not be empty and string should not be in the form
                // =4 (first char) or s= (last char)
                // accepted s=5, thu=90 etc.
                if (!string.IsNullOrWhiteSpace(parm) &&
                    (parm.IndexOf('=') > 0 && parm.IndexOf('=') < (parm.Length - 1)))
                {
                    // first instance of the separator, in this case it is '='
                    int separatorIndex = parm.IndexOf('=');
                    string[] parmAndValue = parm.Split('=');

                    // extract text from 0th index to the separator, value is from the char next to separator to end of string. remember, there can be multiple instances of the separator, we are only interedted in the first instance
                    // example : http://localhost:59310?sendEmail=user@user.com
                    parms.Add(parm.Substring(0, separatorIndex).Trim(new char[] { ' ', '"' }), parm.Substring(separatorIndex + 1).Trim(new char[] { ' ', '"' }));
                }
            }

            return parms;
        }

        private string FormatMultipleEmailAddresses(string emailaddresses)
        {
            if (string.IsNullOrEmpty(emailaddresses))
            {
                return default;
            }

            string[] addresses = emailaddresses.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);

            return string.Join(",", addresses);
        }

        private void AddEmailAttachments(MailMessage message)
        {
            if (string.IsNullOrEmpty(this.NotificationTask?.Attachment))
            {
                return;
            }

            Log.Information($"The following attachment will send {this.NotificationTask?.Attachment} pending emailId {this.NotificationTask?.Id}");
            IEnumerable<string>? attachmentFilePath = this.NotificationTask?.Attachment?.Split(new string[] { ";;", ";" },
                                                                                                    StringSplitOptions.RemoveEmptyEntries);

            foreach (string attachment in attachmentFilePath)
            {
                if (!File.Exists(attachment))
                {
                    Log.Information($"File is not exists {attachment} following pending emailId {this.NotificationTask?.Id}");
                }

                Stream attachmentStream = File.OpenRead(attachment);
                string fileName = Path.GetFileName(attachment);
                if (attachmentStream != null)
                {
                    message.Attachments.Add(new Attachment(attachmentStream, fileName));
                }
            }
        }

        private void AddReportAttachments(MailMessage message)
        {
            Log.Information($"The following attachment will send {this.NotificationTask?.Attachment} pending emailId {this.NotificationTask?.Id}");
            IEnumerable<string>? attachmentFilePath = this.NotificationTask?.Attachment?.Split(new string[] { ";;", ";" },
                                                                                                    StringSplitOptions.RemoveEmptyEntries);

            foreach (string attachment in attachmentFilePath)
            {
                var filePath = string.Concat(this.appConfiguration.Value.ApplicationConfiguration.ReportBaseURL, attachment);

                WebClient myClient = new WebClient();
                byte[] bytes = myClient.DownloadData(filePath);
                System.IO.MemoryStream webPdf = new MemoryStream(bytes);

                Attachment attach = new Attachment(webPdf, System.Net.Mime.MediaTypeNames.Application.Pdf);
                attach.ContentDisposition.FileName = "Invoice.pdf";

                if (webPdf == null)
                {
                    Log.Information($"File is not exists in {filePath} following pending emailId {this.NotificationTask?.Id}");
                }

                if (webPdf != null)
                {
                    message.Attachments.Add(new Attachment(webPdf, "Invoice.pdf"));
                }
            }
        }
    }
}
