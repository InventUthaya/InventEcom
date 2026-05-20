namespace DofyEcom.NotificationService
{
    public class PendingTask
    {
        public int Id { get; set; }

        public int EntityTypeId { get; set; }

        public string Parms { get; set; }

        public string EmailTo { get; set; }

        public string EmailCC { get; set; }

        public string EmailBCC { get; set; }

        public string EmailFrom { get; set; }

        public int TemplateId { get; set; }

        public string TemplateName { get; set; }

        public string EmailSubject { get; set; }

        public string Template { get; set; }

        public string Attachment { get; set; }

        public string AdditionalInformation { get; set; }

        public long RetryCount { get; set; }

        public bool? IsProcessed { get; set; }

        public string EmailTemplatesTemplateId { get; set; }
    }
}
