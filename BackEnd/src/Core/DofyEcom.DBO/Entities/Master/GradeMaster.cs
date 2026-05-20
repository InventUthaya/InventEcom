namespace DofyEcom.DBO
{
    public class GradeMaster : EntityBase
    {
        public string GradeName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}