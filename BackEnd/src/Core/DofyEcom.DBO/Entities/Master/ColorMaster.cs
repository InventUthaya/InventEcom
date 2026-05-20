namespace DofyEcom.DBO
{
    public class ColorMaster : EntityBase
    {
        public string ColorName { get; set; }
        public string HexCode { get; set; }
        public bool IsActive { get; set; }
        public bool DisplayInList { get; set; }
        public int? PartnerId { get; set; }
    }
}