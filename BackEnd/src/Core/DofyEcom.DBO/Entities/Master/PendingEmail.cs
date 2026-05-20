namespace DofyEcom.DBO
{

    public class PendingEmail : EntityBase
    {


        public Guid EmailTemplateGroupId { get; set; }

        public bool IsProcessed { get; set; }

        public string Parms { get; set; }

        public string EmailTo { get; set; }

        public string EmailFrom { get; set; }

        public string Attachment { get; set; }

        public long? RowOrder { get; set; }
        public int? PartnerId { get; set; }
    }
}