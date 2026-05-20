namespace DofyEcom.DBO
{
    public class RamMaster : EntityBase
    {
        public string RamSize { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}