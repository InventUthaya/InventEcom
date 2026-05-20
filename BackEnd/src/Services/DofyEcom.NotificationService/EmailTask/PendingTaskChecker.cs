namespace DofyEcom.NotificationService
{
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Linq;
    using Dapper;
    using DofyEcom.Helper;
    using Microsoft.Extensions.Options;
    using Serilog;

    public class PendingTaskChecker : ITaskChecker<PendingTask>
    {
        private readonly IOptionsSnapshot<AppConfiguration> appConfiguration;

        public PendingTaskChecker(IOptionsSnapshot<AppConfiguration> _AppConfiguration)
        {
            this.appConfiguration = _AppConfiguration;
        }

        //protected IDbConnection Connection
        //{
        //    get
        //    {
        //        return new SqlConnection(this.appConfiguration.Value.ApplicationConfiguration.CountryCode == "in" ?
        //            this.appConfiguration.Value.DatabaseConfiguration.ConnectionStringIndia : this.appConfiguration.Value.DatabaseConfiguration.ConnectionStringUAE);
        //    }
        //}

        protected IDbConnection ConnectionIN
        {
            get
            {
                return new SqlConnection(this.appConfiguration.Value.DatabaseConfiguration.ConnectionStringIndia);
            }
        }

        protected IDbConnection ConnectionUAE
        {
            get
            {
                return new SqlConnection(this.appConfiguration.Value.DatabaseConfiguration.ConnectionStringUAE);
            }
        }

        public IEnumerable<PendingTask> FetchPendingOTPSMSTasks(string countryCode)
        {
            string pendingEmailTaskQuery = string.Concat(@"SELECT Id, Parms, EmailTo, EmailCC, EmailBCC, EmailFrom, TemplateId, EmailSubject, Template, 
                                                           AdditionalInformation, Attachment, EntityTypeId, EmailTemplatesTemplateId, RetryCount FROM [vw_PendingOTPSMS] where RetryCount <=",
                                                         this.appConfiguration.Value.ApplicationConfiguration.RetryCount);
            IEnumerable<PendingTask> tasks = new List<PendingTask>();
            using (IDbConnection cn = countryCode == "in" ? this.ConnectionIN : this.ConnectionUAE)
            {
                cn.Open();
                tasks = cn.Query<PendingTask>(pendingEmailTaskQuery);
            }


            return tasks;
        }

        public IEnumerable<PendingTask> FetchPendingOTHERSMSTasks(string countryCode)
        {
            string pendingEmailTaskQuery = string.Concat(@"SELECT Id, Parms, EmailTo, EmailCC, EmailBCC, EmailFrom, TemplateId, EmailSubject, Template, 
                                                           AdditionalInformation, Attachment, EntityTypeId, EmailTemplatesTemplateId, RetryCount FROM [vw_PendingOTHERSMS] where RetryCount <=",
                                                         this.appConfiguration.Value.ApplicationConfiguration.RetryCount);
            IEnumerable<PendingTask> tasks = new List<PendingTask>();
            using (IDbConnection cn = countryCode == "in" ? this.ConnectionIN : this.ConnectionUAE)
            {
                cn.Open();
                tasks = cn.Query<PendingTask>(pendingEmailTaskQuery);
            }


            return tasks;
        }

        public IEnumerable<PendingTask> FetchMISPendingTasks(string countryCode)
        {
            string todaysPendingEmailTaskQuery = string.Concat(@"SELECT Id, Parms, EmailTo, EmailCC, EmailBCC,IsProcessed, EmailFrom, TemplateId, EmailSubject, Template, 
                                                           AdditionalInformation, Attachment, EntityTypeId, EmailTemplatesTemplateId,Created, RetryCount FROM [vw_PendingEmailMISReport] where RetryCount <=",
                                                 this.appConfiguration.Value.ApplicationConfiguration.RetryCount);
            IEnumerable<PendingTask> tasks = new List<PendingTask>();
            using (IDbConnection cn = countryCode == "in" ? this.ConnectionIN : this.ConnectionUAE)
            {
                cn.Open();
                tasks = cn.Query<PendingTask>(todaysPendingEmailTaskQuery);
            }


            return tasks;
        }

        public IEnumerable<PushNotificationChecker> FetchPushNotificationPendingTasks(string countryCode)
        {
            string pendingNotificationTaskQuery = string.Concat(@"SELECT Id,Modified FROM [vw_PendingOrdersNotificationList]");
            IEnumerable<PushNotificationChecker> pendingNotifications = new List<PushNotificationChecker>();
            using (IDbConnection cn = countryCode == "in" ? this.ConnectionIN : this.ConnectionUAE)
            {
                cn.Open();
                pendingNotifications = cn.Query<PushNotificationChecker>(pendingNotificationTaskQuery);
            }

            return pendingNotifications;
        }

        public IEnumerable<PendingTask> FetchPendingTasks(string countryCode)
        {
            string pendingEmailTaskQuery = string.Concat(@"SELECT Id, Parms, EmailTo, EmailCC, EmailBCC, EmailFrom, TemplateId, EmailSubject, Template, 
                                                           AdditionalInformation, Attachment, EntityTypeId, EmailTemplatesTemplateId, RetryCount FROM [vw_PendingEmail] where RetryCount <=",
                                                         this.appConfiguration.Value.ApplicationConfiguration.RetryCount);
            IEnumerable<PendingTask> tasks = new List<PendingTask>();
            using (IDbConnection cn = countryCode == "in" ? this.ConnectionIN : this.ConnectionUAE)
            {
                cn.Open();
                tasks = cn.Query<PendingTask>(pendingEmailTaskQuery);
            }


            return tasks;
        }

        public void MarkTaskAsProcessed(PendingTask task, string countryCode)
        {
            string sendEmailQuery = @"INSERT INTO [dbo].[SentEmail] ([PendingEmailId],[EmailTemplateId], [EmailSubject], [EmailBody], [ToAddress],
                                      [FromAddress], [Attachment]) VALUES (@{0})";
            using IDbConnection cn = countryCode == "in" ? this.ConnectionIN : this.ConnectionUAE;
            var parms = new
            {
                PendingEmailId = task.Id,
                EmailTemplateId = task.TemplateId,
                EmailSubject = task.EmailSubject,
                EmailBody = task.Template,
                ToAddress = task.EmailTo,
                FromAddress = task.EmailFrom,
                Attachment = task.Attachment
            };
            string[] columns = parms.GetType().GetProperties().Select(item => item.Name).ToArray();
            string sentEmailQuery = string.Format(sendEmailQuery, string.Join(",@", columns));

            cn.Open();
            cn.Execute(sentEmailQuery, parms);
            cn.Execute(string.Format("UPDATE [dbo].[PendingEmail] SET [IsProcessed] = 1 WHERE [Id] = {0}", task.Id));
        }

        public void UpdateRetryCount(PendingTask task, string countryCode)
        {
            using IDbConnection cn = countryCode == "in" ? this.ConnectionIN : this.ConnectionUAE;
            cn.Open();
            cn.Execute(string.Format("UPDATE [dbo].[PendingEmail] SET [RetryCount] = {1} WHERE [Id] = {0}", task.Id, ++task.RetryCount));
        }

        public void SentMISReport(string countryCode)
        {
            if (this.CheckTime())
            {
                var adminURL = Convert.ToString(this.appConfiguration.Value.ApplicationConfiguration.AdminURL);
                HttpResponseMessage responseMessage = new HttpResponseMessage();

                try
                {
                    var MISURL = adminURL + "master/GetMISReport";
                    HttpClient client = new HttpClient();
                    client.DefaultRequestHeaders.Add("LanguageCode", "en");
                    client.DefaultRequestHeaders.Add("CountryCode", countryCode);
                    responseMessage = client.GetAsync(MISURL).Result;

                    if (!responseMessage.IsSuccessStatusCode)
                    {
                        throw new Exception(responseMessage.ReasonPhrase);
                    }
                }
                catch (Exception ex)
                {
                    Log.Error("Issue in mail" + ':' + ex);
                }
            }
        }

        public void SentPushNotificationForpendingOrders(string countryCode, IEnumerable<PushNotificationChecker> pendingNotifications)
        {

            if (pendingNotifications?.Count() > 0)
            {
                var publicURL = Convert.ToString(this.appConfiguration.Value.ApplicationConfiguration?.PublicURL);
                HttpResponseMessage responseMessage = new HttpResponseMessage();

                try
                {
                    var NotifyUrl = publicURL + "sell/Notify";
                    HttpClient client = new HttpClient();
                    client.DefaultRequestHeaders.Add("LanguageCode", "en");
                    client.DefaultRequestHeaders.Add("CountryCode", countryCode);
                    responseMessage = client.GetAsync(NotifyUrl).Result;

                    if (!responseMessage.IsSuccessStatusCode)
                    {
                        throw new Exception(responseMessage.ReasonPhrase);
                    }
                }
                catch (Exception ex)
                {
                    Log.Error("Issue in Notification" + ':' + ex);
                }
            }
        }

        public bool CheckTime()
        {
            DateTime currentTime = DateTime.Now;

            return (currentTime.Hour == this.appConfiguration.Value.EmailConfiguration.DailyEmailTime) && (currentTime.Hour <= this.appConfiguration.Value.EmailConfiguration.DailyEmailTime + 1);
        }
    }
}
