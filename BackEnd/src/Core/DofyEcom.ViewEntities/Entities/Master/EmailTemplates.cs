namespace DofyEcom.ViewEntities
{

    public class EmailTemplates : EntityBase
    {
        public string TemplateName { get; set; }

        public string DisplayName { get; set; }

        public string Template { get; set; }

        public Guid EmailGroupId { get; set; }

        public string EmailSubject { get; set; }

        public string EmailCC { get; set; }

        public string EmailBCC { get; set; }

        public string SenderEmail { get; set; }

        public string AdditionalInformation { get; set; }

        public bool? AttachementRequired { get; set; }

        public bool IncludeLoginInfo { get; set; }

        public byte[] VerCol { get; set; }

        public long? RowOrder { get; set; }

        public long? EntityTypeId { get; set; }

        public string EnumName { get; set; }

        public string? TemplateId { get; set; }

    }
}
