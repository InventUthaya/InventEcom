namespace DOFY.NotificationService
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http.Headers;
    using System.Net.Mail;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using DofyEcom.Helper;
    using DofyEcom.Logger;
    using DofyEcom.NotificationService;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Options;
    using Org.BouncyCastle.Asn1.Ocsp;

    public class NotificationSenderService : BackgroundService
    {
        private System.Timers.Timer pendingEmailCheckTimer;
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;
        private readonly long defaultTimerValue;

        public NotificationSenderService(IOptionsSnapshot<AppConfiguration> _AppConfiguration)
        {
            this.defaultTimerValue = 30000;
            this.pendingEmailCheckTimer = new System.Timers.Timer();
            this.appConfiguration = _AppConfiguration;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {

            if (Environment.UserInteractive)
            {
                Console.WriteLine("Dofy Notification Service started as a Console Application");
                Console.WriteLine(" 1. Run Service");
                Console.WriteLine(" 2. Exit");
                Console.Write("Enter Option: ");
                string input = Console.ReadLine();

                switch (input)
                {
                    case "1":
                        Console.WriteLine("Running Service - Press Enter To Exit");
                        await base.StartAsync(cancellationToken);
                        break;
                }

                Console.Read();
                await StopAsync(cancellationToken);
            }

            await base.StartAsync(cancellationToken);
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            this.pendingEmailCheckTimer.Stop();
            this.pendingEmailCheckTimer.Dispose();
            this.pendingEmailCheckTimer = null;

            await base.StopAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!stoppingToken.IsCancellationRequested)
            {
                StartEmailCheckTimer();
            }
        }

        public override void Dispose()
        {
            this.pendingEmailCheckTimer = null;
        }

        private void StartEmailCheckTimer()
        {
            this.pendingEmailCheckTimer.Interval = this.appConfiguration?.Value?.ApplicationConfiguration?.TimerValue ?? defaultTimerValue;
            this.pendingEmailCheckTimer.Elapsed += new System.Timers.ElapsedEventHandler(this.OnPendingEmailCheckTimerExpired);
            this.pendingEmailCheckTimer.Start();
        }

        private void OnPendingEmailCheckTimerExpired(object sender, System.Timers.ElapsedEventArgs args)
        {
            this.pendingEmailCheckTimer.Stop();

            try
            {
                this.ServiceDecider();
            }
            catch (Exception ex)
            {
                SeriLogger.Fatal(ex, "ProcessPendingTasks Exception Occur");
            }
            finally
            {
                this.pendingEmailCheckTimer.Start();
            }
        }

        private void ServiceDecider()
        {
            var EnableOTPSMSIN = this.appConfiguration.Value?.ServiceConfigurationIn?.EnableOTPSMS ?? false;
            var EnableOtherSMSIN = this.appConfiguration.Value?.ServiceConfigurationIn?.EnableOtherSMS ?? false;
            var EnableEmailIN = this.appConfiguration.Value?.ServiceConfigurationIn?.EnableEmail ?? false;
            var EnablePushNotificationIN = this.appConfiguration.Value?.ServiceConfigurationIn?.EnablePushNotification ?? false;
            var EnableMisReportIN = this.appConfiguration.Value?.ServiceConfigurationIn?.EnableMisReport ?? false;

            var EnableOTPSMSUAE = this.appConfiguration.Value?.ServiceConfigurationUAE?.EnableOTPSMS ?? false;
            var EnableOtherSMSUAE = this.appConfiguration.Value?.ServiceConfigurationUAE?.EnableOtherSMS ?? false;
            var EnableEmailUAE = this.appConfiguration.Value?.ServiceConfigurationUAE?.EnableEmail ?? false;
            var EnablePushNotificationUAE = this.appConfiguration.Value?.ServiceConfigurationUAE?.EnablePushNotification ?? false;
            var EnableMisReportUAE = this.appConfiguration.Value?.ServiceConfigurationUAE?.EnableMisReport ?? false;

            if (EnableOTPSMSIN)
            {
                this.ProcessPendingOTPSMS("in");
            }

            if (EnableOTPSMSUAE)
            {
                this.ProcessPendingOTPSMS("ae");
            }

            //if (EnableOtherSMSIN)
            //{
            //    this.ProcessPendingOTHERSMS("in");
            //}

            //if (EnableOtherSMSUAE)
            //{
            //    this.ProcessPendingOTHERSMS("ae");
            //}

            if (EnableEmailIN)
            {
                this.ProcessPendingEmailTasks("in");
            }

            if (EnableEmailUAE)
            {
                this.ProcessPendingEmailTasks("ae");
            }

            //if (EnablePushNotificationIN)
            //{
            //    this.ProcessPendingPushNotificationTasks("in");
            //}

            //if (EnablePushNotificationUAE)
            //{
            //    this.ProcessPendingPushNotificationTasks("ae");
            //}

            //if (EnableMisReportIN)
            //{
            //    this.ProcessPendingMISEmailTasks("in");
            //}

            //if (EnableMisReportUAE)
            //{
            //    this.ProcessPendingMISEmailTasks("ae");
            //}
        }

        private void ProcessPendingOTPSMS(string countryCode)
        {
            IEnumerable<PendingTask> pendingTasks = new PendingTaskChecker(this.appConfiguration).FetchPendingOTPSMSTasks(countryCode);
            if (pendingTasks?.Any() ?? false)
            {
                IEnumerable<SendNotificationCommand>? pendingSendSMSCommands = pendingTasks.Where(item => item.EntityTypeId == DOFYEcomConstants.SMS_ENTITY_TYPE)
                       ?.Select(item => new SendNotificationCommand(item, this.appConfiguration));
                Task pendingSMSTask = Task.Factory.StartNew(() =>
                {
                    if (pendingSendSMSCommands?.Any() ?? false)
                    {
                        this.ProcessPendingSMS(pendingSendSMSCommands, countryCode);
                    }
                });


                Task.WaitAll(pendingSMSTask);

            }
        }

        //private void ProcessPendingOTHERSMS(string countryCode)
        //{
        //    IEnumerable<PendingTask> pendingTasks = new PendingTaskChecker(this.appConfiguration).FetchPendingOTHERSMSTasks(countryCode);
        //    if (pendingTasks?.Any() ?? false)
        //    {
        //        IEnumerable<SendNotificationCommand>? pendingSendSMSCommands = pendingTasks.Where(item => item.EntityTypeId == DOFYEcomConstants.SMS_ENTITY_TYPE)
        //               ?.Select(item => new SendNotificationCommand(item, this.appConfiguration));
        //        Task pendingSMSTask = Task.Factory.StartNew(() =>
        //        {
        //            if (pendingSendSMSCommands?.Any() ?? false)
        //            {
        //                this.ProcessPendingSMS(pendingSendSMSCommands, countryCode);
        //            }
        //        });


        //        Task.WaitAll(pendingSMSTask);

        //    }
        //}

        //private void ProcessPendingMISEmailTasks(string countryCode)
        //{
        //    IEnumerable<PendingTask> pendingTasks = new PendingTaskChecker(this.appConfiguration).FetchMISPendingTasks(countryCode);
        //    var pendingModal = new PendingTaskChecker(this.appConfiguration);

        //    if (pendingTasks?.Any() ?? false)
        //    {
        //        IEnumerable<SendNotificationCommand>? pendingSendEmailCommands = pendingTasks.Where(item => item.EntityTypeId == DOFYEcomConstants.EMAIL_ENTITY_TYPE && item.IsProcessed == false)
        //               ?.Select(item => new SendNotificationCommand(item, this.appConfiguration));
        //        Task pendingEmailTask = Task.Factory.StartNew(() =>
        //        {
        //            if (pendingSendEmailCommands?.Any() ?? false)
        //            {
        //                this.ProcessPendingEmails(pendingSendEmailCommands, countryCode);
        //            }
        //        });

        //        Task.WaitAll(pendingEmailTask);

        //    }
        //    else
        //    {
        //        pendingModal.SentMISReport(countryCode);
        //    }
        //}

        //private void ProcessPendingPushNotificationTasks(string countryCode)
        //{
        //    IEnumerable<PushNotificationChecker> pendingTasks = new PendingTaskChecker(this.appConfiguration).FetchPushNotificationPendingTasks(countryCode);
        //    var pendingModal = new PendingTaskChecker(this.appConfiguration);

        //    if (pendingTasks?.Any() ?? false)
        //    {
        //        pendingModal.SentPushNotificationForpendingOrders(countryCode, pendingTasks);
        //    }
        //}

        private void ProcessPendingEmailTasks(string countryCode)
        {
            IEnumerable<PendingTask> pendingTasks = new PendingTaskChecker(this.appConfiguration).FetchPendingTasks(countryCode);
            if (pendingTasks?.Any() ?? false)
            {

                IEnumerable<SendNotificationCommand>? pendingSendEmailCommands = pendingTasks.Where(item => item.EntityTypeId == DOFYEcomConstants.EMAIL_ENTITY_TYPE)
                       ?.Select(item => new SendNotificationCommand(item, this.appConfiguration));
                Task pendingEmailTask = Task.Factory.StartNew(() =>
                {
                    if (pendingSendEmailCommands?.Any() ?? false)
                    {
                        this.ProcessPendingEmails(pendingSendEmailCommands, countryCode);
                    }
                });

                Task.WaitAll(pendingEmailTask);

            }
        }

        private void ProcessPendingEmails(IEnumerable<SendNotificationCommand> pendingSendEmailCommands, string countryCode)
        {
            using SmtpClient smtpClient = new SmtpClient(this.appConfiguration?.Value?.EmailConfiguration?.SMTPClientHostName)
            {
                Port = this.appConfiguration?.Value?.EmailConfiguration?.SMTPClientPort ?? 0,
                EnableSsl = this.appConfiguration?.Value?.EmailConfiguration?.EnableSSL ?? true,
                DeliveryFormat = (SmtpDeliveryFormat)Enum.Parse(typeof(SmtpDeliveryFormat), this.appConfiguration?.Value?.EmailConfiguration?.SMTPDeliveryFormat, true),
                DeliveryMethod = (SmtpDeliveryMethod)Enum.Parse(typeof(SmtpDeliveryMethod), this.appConfiguration?.Value?.EmailConfiguration?.SMTPDeliveryMethod, true),
                Credentials = new NetworkCredential(this.appConfiguration?.Value?.EmailConfiguration?.UserName, this.appConfiguration?.Value?.EmailConfiguration?.Password)
            };

            PendingEmailTaskQueue taskQueue = new PendingEmailTaskQueue(smtpClient);

            // this will automagically fire the dequeue and execute command in the queue
            taskQueue.Enqueue(pendingSendEmailCommands, countryCode);
        }


        private void ProcessPendingSMS(IEnumerable<SendNotificationCommand> pendingSendEmailCommands,string countryCode)
        {
            using HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            if (countryCode == "in")
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", this.appConfiguration?.Value?.SMSConfiguration?.AuthorizationKey));
            }
            else
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes($"{appConfiguration.Value?.SMSConfigurationUAE?.AuthKey}:{appConfiguration.Value?.SMSConfigurationUAE?.AuthToken}")));
            }

            PendingSMSTaskQueue taskQueue = new PendingSMSTaskQueue(httpClient, countryCode);

            // this will automagically fire the dequeue and execute command in the queue
            taskQueue.Enqueue(pendingSendEmailCommands, countryCode);
        }
    }
}