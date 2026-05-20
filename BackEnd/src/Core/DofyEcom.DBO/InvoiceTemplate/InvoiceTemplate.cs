namespace DofyEcom.DBO
{
    public class InvoiceTemplate : EntityBase
    {
        public int InvoiceTypeId { get; set; }

        public string EnumName { get; set; }

        public string Template { get; set; }

    }
}
